# Australia grows far more food than it eats

FIT3179 Data Visualisation 2, Monash University, Semester 2 2026.
Domain: Australia's food system.

A single scrolling page of fourteen Vega-Lite and Vega charts, including three
different map idioms, that follows Australian food from the paddock to the plate
and asks why a country this productive still has households that go without.

**Open `index.html` through a web server** (VS Code Live Server,
`python -m http.server`, or GitHub Pages). Opening the file directly with
`file://` will not work, because the browser blocks the local data files.

---

## Domain, why and who

**Domain.** Australia's food system: what the country grows, where it goes, what
Australians actually eat, and the water and land it all depends on.

**Why.** Australia produces a very large food surplus and exports most of it. That
surplus depends on rainfall it cannot control and on a share of the nation's water
and land far larger than agriculture's share of the economy. Meanwhile more than one
household in eight experienced food insecurity in 2023. Each fact is published
somewhere, but in a different report by a different agency. Putting production,
trade, consumption and resource use on one page shows a trade-off that is invisible
in any one of them.

**Who.** A general Australian reader with no agricultural or statistical background.
Only one chart uses a statistical summary, the box plot, and its subtitle explains
what the box, the centre line and the dots mean without using the words quartile or
percentile. Technical terms (discretionary food, food insecurity) are explained where
they first appear.

## What: the data

| Source | Author | Used for |
|---|---|---|
| *Australian Agriculture: Broadacre Crops, 2024–25* | Australian Bureau of Statistics | Crop value (treemap), wheat by state (two maps, slope chart) |
| *Water Account, Australia, 2023–24* | Australian Bureau of Statistics | Rainfall and water use (connected scatterplot, parallel coordinates) |
| *National Nutrition and Physical Activity Survey, 2023* | Australian Bureau of Statistics | Dietary guidelines, discretionary energy, food insecurity |
| *Snapshot of Australian Agriculture 2026* | ABARES | Export share and value; agriculture's share of GDP, jobs, water and land |
| *FAOSTAT Crops and Livestock Products* | Food and Agriculture Organization of the UN | Crop production 1961–2024 (streamgraph, matrix, box plot) |
| *FAOSTAT Detailed Trade Matrix* | Food and Agriculture Organization of the UN | Wheat exports by destination, 2024 (flow map) |
| State boundaries | `rowanhogan/australian-states`, derived from the ABS ASGS | Both state maps |
| Natural Earth 1:110m | Natural Earth (public domain), via the FIT3179 studio files | World base map |

Three independent agencies (ABS, ABARES, FAO), cross-checked where they overlap: FAO
and ABS give identical wheat, barley and canola tonnages for 2022–23. Every figure on
the page comes from the most recent edition available when the page was built. Creation process, derivations and
scope decisions are in [`data/README.md`](data/README.md); nothing is fabricated or
modelled, and blank cells in source tables stay blank.

## How: idioms, marks and channels

Each chapter answers one question with the idiom that fits it. Data types:
**Q** quantitative, **O** ordinal, **N** nominal (categorical), **G** geographic.

| # | Chart | Idiom | Marks | Channels → data | Task it supports |
|---|---|---|---|---|---|
| 1 | Grains and oilseeds, 1961–2024 | Streamgraph | Area | x position → year (Q); band thickness → tonnes (Q), read against a 10 Mt scale bar; hue → crop (N) | See total and composition change together over 64 years |
| 2 | Harvest vs its own normal | Matrix (heatmap) | Rect | x → year (O); y → crop (N); colour (diverging, 5 classes) → % from 11-year median (Q) | Spot drought years that hit every crop at once |
| 3 | Year-on-year change | Box plot | Rect, rule, point | x → % change (Q); y → crop (N); hue → crop (N) | Compare spread and extremes between crops |
| 4 | Crop value 2024–25 | Treemap, two levels | Rect (area), containment | area → $ value (Q); nesting → crop type → crop (N, hierarchy); hue → crop (N) | Compare parts of a whole, inside a real hierarchy |
| 5 | Wheat per km² by state | Choropleth map | Area (geoshape) | colour (sequential, 5 classes) → tonnes per km² (Q, a rate); region → state (G); each state labelled with its abbreviation and rate | Compare how intensively each state is farmed |
| 6 | Wheat tonnes by state | Proportional symbol map | Point (circle) | area → tonnes (Q); position → state centroid (G); each circle labelled with its abbreviation and total, in the same style as chart 5 | Compare total production; read the map as totals, not rates |
| 7 | Wheat exports by country | Flow map | Line, point (arrowhead), point | path → great-circle route (G); arrowhead → direction of the flow; line width → tonnes (Q); hue → focus (Indonesia, N). Destination dots are one size, so tonnage is not encoded twice | See where the crop goes and which buyers matter |
| 8 | State harvests, two seasons | Slope chart | Line, point | x → season (O); y → tonnes (Q); hue → highlight (N) | Compare each state's change between two seasons |
| 9 | Meeting the dietary guidelines | Pictogram (ISOTYPE) small multiples, 2 × 2 | Point (SVG person) | count of figures → % of people (Q); hue → met / not met (N); panel → food group (N) | Make four percentages countable and concrete |
| 10 | Discretionary energy | Two-point line chart (**basic**) | Line, point, rule | x → survey year (O); y → % of energy (Q); a dashed reference line at one third | Read one change between two surveys, against "a third of all energy" |
| 11 | Rain and water use, ten years | Aligned bar panels (**basic**) | Bar | x → financial year (O, shared by both panels); y → rainfall (Q) above, water used (Q) below; hue → the driest / wettest years and what followed (N) | See that water use follows the previous year's rain |
| 12 | Footprint vs economic weight | Dumbbell plot | Point, rule | x → % of national total (Q); y → measure (N); hue → resource vs economy (N) | Read the gap between two values per row |
| 13 | Ten years of water | Parallel coordinates | Line, point | x → measure (N); y → value scaled to its own range (Q); hue → driest / wettest (N) | Compare years across four measures at once |
| 14 | Food insecurity | Pictogram (ISOTYPE) | Point (SVG house) | count of houses → % of households (Q); hue → insecure or not (N) | Make one headline rate concrete |

**Fourteen charts and eleven distinct advanced idioms** (the two pictogram charts
share one idiom), **two basic charts, and three map idioms**, against a requirement
of more than ten charts, at least eight advanced idioms and at least three maps. Charts
10 and 11 are deliberately basic. Chart 10 is one series at two points in time. Chart
11 replaced a connected scatterplot of each year's rainfall against the same year's
water use: those two barely move together, so the path was a tangle. Water use follows
the *previous* year's rain far more closely (the lowest use came after two dry years,
the highest the year after the wettest), and two bar panels on one year axis show that
lag more plainly than any advanced idiom could.

**The two state maps are a deliberate pair.** The choropleth shows a **rate** (tonnes
per km²) and the symbol map the **total** (tonnes). A choropleth of totals would
mostly redraw which states are physically biggest. Both maps use a conic equal-area
projection with standard parallels across Australia's latitudes, so state areas are
compared fairly; the world map uses the Equal Earth projection used in the studios.
All three maps load TopoJSON, joined to the data with a `lookup` on the region name.

**Why a dumbbell for the footprint chart.** Position on a common scale carries the
value, and the left-hand dot pins every row to agriculture's 2.2% share of GDP, so the
chart shows the *gap* rather than five unrelated magnitudes.

## Interaction

Used only where it answers a question:

- **Season selector on the two wheat maps.** Changing it on either map changes the
  other, so the rate view and the total view always describe the same season; the
  annotations on both maps are recomputed for the chosen season.
- **Click a band** on the streamgraph to isolate one crop (double-click to reset).
- **Hover a route** on the flow map, or **a line** on the parallel coordinates, to
  isolate one destination or one year.
- **Tooltips** everywhere, carrying the exact value, unit and period.

## Design

- **Colour.** One meaning per hue across all fourteen charts: teal is supply (wheat,
  barley, water and land), violet is canola, ochre is the accent (always the thing
  to notice, which on this page is always a shortfall), slate is context. Colours are
  named in the subtitles instead of legends. The palette was audited so every text
  colour clears 4.5:1, every thin mark 3:1, adjacent fills differ in luminance, and
  the crop colours stay distinct under simulated protanopia, deuteranopia and
  tritanopia. No red–green
  pairing and no rainbow scale anywhere.
- **Typography.** Fraunces, a soft old-style serif reminiscent of seed catalogues
  and farm almanacs, for headings and headline numbers; Source Sans 3 for all body
  text, labels and charts. Every reading paragraph (findings, chapter intros,
  closing, takeaways) is about 19 px with a ~60-character measure, the intro
  21 px; inside the charts, tick and legend labels are 15 px and annotations 16 px;
  nothing on the page renders below 15 px. Key numbers are set bold and, where
  they match a chart colour, in that colour.
- **Layout, figure-ground and sight-lines.** White cards on a warm tinted page.
  Every grid on the page is either full width or split exactly in half, so the only
  vertical sight-lines are the two page edges and one centre gutter (earlier drafts
  also used quarters, thirds and a two-thirds split). Inside the cards, every chart
  with labels down its left side reserves the same 108 px label column, flush with
  the card's text edge, so every plot area in a column starts on one line; the
  streamgraph and the harvest matrix share identical plot areas, so each year in the
  matrix sits directly under the same year in the stream. Every card has the same
  four rows (heading, subtitle, chart, finding), shared across a row with CSS
  subgrid, so headings, findings and card edges line up; inside each pair the two
  charts' plot areas share their top edge and baseline, and the callout's figures
  are pinned to its neighbour's plot top and baseline. The diet pictograms' two
  columns of panels start on the same two lines as the half-width cards. In all,
  the page has ten vertical lines: four card edges, four text edges and one plot
  line per column. Every one of these was measured on the rendered plot areas
  themselves, at four laptop widths: at most 1 px drift (sub-pixel rounding).
- **Annotation.** Every chart carries at least one on-chart annotation stating an
  insight, placed in reserved space (above a matrix, in open sea, beside a pictogram
  block) so none covers the data, plus a one-sentence finding under the chart.
  Values are labelled only where the story needs them; tooltips carry the rest.

## Repository layout

```
index.html              the page
css/styles.css          design tokens, grid, typography
js/app.js               sizes and embeds the specs, links the two maps
js/specs/*.json         fourteen standalone, formatted chart specifications
data/                   every dataset, plus data/README.md explaining each one
```

Each file in `js/specs/` is a complete specification that can be pasted straight
into the [Vega editor](https://vega.github.io/editor/). The only change made at
run time is the chart width, which is set to the real pixel width of its card.

## Sources

Full source list, reference periods and derivation notes:
[`data/README.md`](data/README.md).
