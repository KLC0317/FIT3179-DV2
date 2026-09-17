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
    { el: "viz-dietwaffle",    spec: "09-diet-waffle.json", facet: 2     },
    { el: "viz-discretionary", spec: "10-discretionary-slope.json"     },
    { el: "viz-water",         spec: "11-water-connected-scatter.json" },
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

  /* Size one small multiple (a 10x10 icon grid) so the whole faceted row
     fills its card edge to edge, not just a fraction of it. The mark is a
     text glyph, so the tunable is fontSize, not the "size" (area) property a
     square or circle mark would use. Only a floor is enforced (so icons never
     shrink past legibility on a narrow phone width) — no ceiling, because
     capping childW well below the card's actual width is exactly what left a
     few hundred pixels of blank space on the right of this chart before. */
  function sizeFacet(s, columns, childW) {
    childW = Math.max(170, childW);
    s.spec.width = childW;
    s.spec.height = Math.round(childW * 1.06);
    var side = (childW / 10) * 0.86;          // ten icons across, with air
    s.spec.mark.fontSize = Math.round(side);
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
    var next = childW - Math.ceil(overflow / chart.facet) - 3;
    if (next >= childW || next < 100) return Promise.resolve(result);

    sizeFacet(s, chart.facet, next);
    return vegaEmbed(el, s, EMBED_OPTIONS).then(function (r) {
      return fitFacet(el, s, chart, next, r, pass + 1);
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

        if (!chart.facet) {
          s.width = cardWidth(el);
          return vegaEmbed(el, s, EMBED_OPTIONS);
        }

        var gap = s.spacing || 22;
        var childW = sizeFacet(
          s, chart.facet,
          Math.floor((cardWidth(el) - gap * (chart.facet - 1)) / chart.facet));

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

  function renderAll() {
    return Promise.all(CHARTS.map(render)).then(function () {
      linkSeasonSignal("viz-choropleth", "viz-symbolmap");
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

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", renderAll);
  } else {
    renderAll();
  }
})();
