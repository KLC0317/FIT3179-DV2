/* ==========================================================================
   Australia's food system — chart loader
   FIT3179 Data Visualisation 2

   Each chart is a standalone Vega or Vega-Lite specification in js/specs/.
   This file only does three things:
     1. give every spec the real pixel width of its card, so nothing is ever
        clipped and nothing overflows on a small laptop screen;
     2. embed the specs;
     3. keep the two wheat maps showing the same season as each other.
   ========================================================================== */

(function () {
  "use strict";

  var CHARTS = [
    { el: "viz-streamgraph",   spec: "01-crop-streamgraph.json"        },
    { el: "viz-matrix",        spec: "02-harvest-matrix.json"          },
    { el: "viz-boxplot",       spec: "03-volatility-boxplot.json"      },
    { el: "viz-treemap",       spec: "04-crop-value-treemap.json"      },
    { el: "viz-choropleth",    spec: "05-wheat-choropleth.json"        },
    { el: "viz-symbolmap",     spec: "06-wheat-symbol-map.json"        },
    { el: "viz-flowmap",       spec: "07-wheat-flow-map.json"          },
    { el: "viz-stateslope",    spec: "08-state-slope.json"             },
    { el: "viz-dietwaffle",    spec: "09-diet-waffle.json", facet: true  },
    { el: "viz-discretionary", spec: "10-discretionary-slope.json"     },
    { el: "viz-water",         spec: "11-water-rain-timeline.json"     },
    { el: "viz-footprint",     spec: "12-footprint-dumbbell.json"      },
    { el: "viz-parallel",      spec: "13-water-parallel.json"          },
    { el: "viz-insecurity",    spec: "14-food-insecurity-waffle.json"  }
  ];

  var EMBED_OPTIONS = {
    actions: false,
    renderer: "svg",
    tooltip: { theme: "light", offsetX: 8, offsetY: 8 }
  };

  var views = {};       // el id -> vega view
  var specCache = {};   // file  -> parsed spec
  var syncing = false;  // guards the linked-map signal loop

  function cardWidth(el) {
    // Math.floor keeps the SVG inside the card on fractional layout widths.
    var w = Math.floor(el.getBoundingClientRect().width);
    return w > 0 ? w : 640;
  }

  function showError(el, file) {
    el.innerHTML =
      '<p class="viz-error">This chart could not be loaded. It needs to be served over ' +
      'HTTP (for example VS Code Live Server or GitHub Pages) so that it can read ' +
      '<code>' + file + '</code> and the files in <code>data/</code>.</p>';
  }

  /* Size one small multiple (a block of pictograms, usermeta.grid columns by
     rows) to a given panel width. The mark is an SVG-path symbol, so the
     tunable is its "size" - the AREA of the symbol in square pixels - set
     from the width of one grid step. Only a floor is enforced, so the
     pictograms never shrink past legibility on a narrow screen. */
  function sizeFacet(s, childW) {
    var grid = (s.usermeta && s.usermeta.grid) || [10, 10];
    childW = Math.max(140, childW);
    s.spec.width = childW;
    s.spec.height = Math.round(childW * grid[1] / grid[0]);
    var step = childW / grid[0];              // one person per step
    s.spec.mark.size = Math.round(Math.pow(step * 0.8, 2));
    return childW;
  }

  /* A faceted spec sizes itself from its children, and the overhead it adds
     on top of them is not predictable from the card width alone — and isn't
     always proportional to it either (a facet header or an icon glyph can
     add a roughly CONSTANT overflow regardless of column width). So this
     measures the actual pixel overflow each pass and subtracts it straight
     back out per column, rather than scaling by a ratio that only corrects
     proportional overflow. Six passes is generous; two or three is typical. */
  function fitFacet(el, s, chart, childW, result, pass) {
    pass = pass || 1;
    var svg = el.querySelector("svg");
    if (!svg || pass > 6) return Promise.resolve(result);

    var cardW = cardWidth(el);
    var svgW = svg.getBoundingClientRect().width;
    if (svgW <= cardW) return Promise.resolve(result);

    var overflow = svgW - cardW;
    var next = childW - Math.ceil(overflow / s.columns) - 3;
    if (next >= childW || next < 100) return Promise.resolve(result);

    sizeFacet(s, next);
    return vegaEmbed(el, s, EMBED_OPTIONS).then(function (r) {
      return fitFacet(el, s, chart, next, r, pass + 1);
    });
  }

  /* Every Vega-Lite chart is laid out with autosize "pad", so its SVG grows to
     hold everything drawn outside the plot: the label column, direct labels,
     annotations. The plot is given a first-guess width (the card width minus
     the gutters the spec declares in usermeta.gutter), the real SVG width is
     measured, and the plot is corrected by the difference until the chart's
     edges land exactly on the card's. Two passes is typical. (Vega's own
     fit-to-width makes one pass, which under-measured labels that hang off
     points inside the plot and clipped them.) */
  function fitToCard(el, s, setWidth, plotW, result, pass) {
    var svg = el.querySelector("svg");
    if (!svg || pass > 5) return Promise.resolve(result);
    var diff = cardWidth(el) - svg.getBoundingClientRect().width;
    if (Math.abs(diff) < 1) return Promise.resolve(result);
    var next = Math.floor(plotW + diff);
    setWidth(next);
    return vegaEmbed(el, s, EMBED_OPTIONS).then(function (r) {
      return fitToCard(el, s, setWidth, next, r, pass + 1);
    });
  }

  function render(chart) {
    var el = document.getElementById(chart.el);
    if (!el || typeof vegaEmbed === "undefined") return Promise.resolve();

    var file = "js/specs/" + chart.spec;

    return (specCache[file]
      ? Promise.resolve(specCache[file])
      : fetch(file).then(function (r) {
          if (!r.ok) throw new Error(r.status + " " + r.statusText);
          return r.json();
        }).then(function (json) { specCache[file] = json; return json; })
    )
      .then(function (spec) {
        // Deep copy so the cached spec is never mutated by the width override.
        var s = JSON.parse(JSON.stringify(spec));
        // The card heading already names the chart, so drop the in-spec title
        // to avoid printing the same words twice. The title stays in the JSON
        // file so each specification still reads correctly on its own.
        delete s.title;

        // A plain Vega spec (the treemap) draws at exactly the width given.
        if (s.$schema && s.$schema.indexOf("vega-lite") < 0) {
          s.width = cardWidth(el);
          return vegaEmbed(el, s, EMBED_OPTIONS);
        }

        if (!chart.facet) {
          var setWidth = s.vconcat
            ? function (w) { s.vconcat.forEach(function (v) { v.width = w; }); }
            : function (w) { s.width = w; };
          var gutter = (s.usermeta && s.usermeta.gutter) || [0, 0];
          var plotW = cardWidth(el) - gutter[0] - gutter[1];
          setWidth(plotW);
          return vegaEmbed(el, s, EMBED_OPTIONS).then(function (result) {
            return fitToCard(el, s, setWidth, plotW, result, 1);
          });
        }

        // Two panels per row. On a two-column page the gap between them is
        // exactly the gap between two half-width cards' text (the gutter
        // plus both cards' padding), so the second panel starts on the same
        // vertical line as every right-hand card above and below it.
        var css = getComputedStyle(document.documentElement);
        var gap = stacked()
          ? 30
          : parseFloat(css.getPropertyValue("--gutter")) +
            2 * parseFloat(css.getPropertyValue("--card-pad"));
        var cols = cardWidth(el) >= 520 ? 2 : 1;
        s.columns = cols;
        s.spacing = { row: 22, column: gap };
        var childW = sizeFacet(
          s, Math.floor((cardWidth(el) - gap * (cols - 1)) / cols));

        return vegaEmbed(el, s, EMBED_OPTIONS).then(function (result) {
          return fitFacet(el, s, chart, childW, result);
        });
      })
      .then(function (result) {
        views[chart.el] = result.view;
      })
      .catch(function (err) {
        showError(el, file);
        if (window.console) console.error(chart.spec, err);
      });
  }

  /* Change the season on one wheat map and the other follows, so the
     choropleth and the proportional-symbol map always show the same year. */
  function linkSeasonSignal(a, b) {
    var va = views[a], vb = views[b];
    if (!va || !vb) return;

    function bind(from, to) {
      from.addSignalListener("season", function (_, value) {
        if (syncing) return;
        syncing = true;
        try {
          if (to.signal("season") !== value) to.signal("season", value).run();
        } catch (e) { /* signal not ready yet */ }
        syncing = false;
      });
    }
    bind(va, vb);
    bind(vb, va);
  }

  /* True when the page has collapsed to one column (matches the CSS). */
  function stacked() {
    return window.matchMedia("(max-width: 1040px)").matches;
  }

  /* The plot area of a single-view chart: Vega draws its frame's background
     exactly over the data rectangle. */
  function plotRect(svg) {
    var bg = svg && svg.querySelector(
      "g.mark-group.role-frame.root > g > path.background");
    return bg ? bg.getBoundingClientRect() : null;
  }

  /* A callout card sits beside a chart. Once the chart is drawn, the
     callout's figures are pinned to that chart's plot area: the first starts
     on the plot's top edge and the last ends on its baseline, so the two
     cards share those horizontal lines as well as their card edges. */
  function alignCallouts() {
    document.querySelectorAll(".card.aside .stats").forEach(function (stats) {
      stats.style.paddingTop = stats.style.paddingBottom = "";
      if (stacked()) return;
      var partner = stats.closest(".card").previousElementSibling;
      var plot = plotRect(partner && partner.querySelector(".viz svg"));
      if (!plot) return;
      var box = stats.getBoundingClientRect();
      stats.style.paddingTop = Math.max(0, plot.top - box.top) + "px";
      stats.style.paddingBottom = Math.max(0, box.bottom - plot.bottom) + "px";
    });
  }

  function renderAll() {
    return Promise.all(CHARTS.map(render)).then(function () {
      linkSeasonSignal("viz-choropleth", "viz-symbolmap");
      alignCallouts();
    });
  }

  /* Re-embed on resize so every chart keeps matching its card exactly. */
  var resizeTimer = null;
  var lastWidth = window.innerWidth;
  window.addEventListener("resize", function () {
    if (Math.abs(window.innerWidth - lastWidth) < 40) return;
    lastWidth = window.innerWidth;
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(renderAll, 220);
  });

  /* Vega measures label widths when it lays a chart out, so wait for the
     web fonts first; otherwise annotations are placed using the fallback
     font's widths and drift once the real font arrives. */
  function start() {
    var fontsReady = document.fonts && document.fonts.ready
      ? document.fonts.ready : Promise.resolve();
    fontsReady.then(renderAll, renderAll);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start);
  } else {
    start();
  }
})();
