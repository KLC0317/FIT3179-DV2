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
| *Water Account, Australia, 2023–24* | Australian Bureau of Statistics | Rainfall and water use (bar panels, scatterplot) |
| *National Nutrition and Physical Activity Survey, 2023* | Australian Bureau of Statistics | Dietary guidelines, discretionary energy, food insecurity |
| *Snapshot of Australian Agriculture 2026* | ABARES | Export share and value; agriculture's share of GDP, jobs, water and land |
| *FAOSTAT Crops and Livestock Products* | Food and Agriculture Organization of the UN | Crop production 1961–2024 (streamgraph, matrix, box plot, scatterplot) |
| *FAOSTAT Detailed Trade Matrix* | Food and Agriculture Organization of the UN | Wheat exports by destination, 2024 (flow map) |
| State boundaries | `rowanhogan/australian-states`, derived from the ABS ASGS | Both state maps |
| Natural Earth 1:110m | Natural Earth (public domain), via the FIT3179 studio files | World base map |

Three independent agencies (ABS, ABARES, FAO), cross-checked where they overlap: FAO
and ABS give identical wheat, barley and canola tonnages for 2022–23. Creation
process, derivations and scope decisions are in [`data/README.md`](data/README.md);
nothing is fabricated or modelled, and blank cells in source tables stay blank (the
maps shade them grey as "no figure").

The annotations add outside context the data cannot show by itself (why a year was
dry, why a number jumped). Each of those facts is cited on the page under *Context in
the annotations*: the Bureau of Meteorology (El Niño droughts, the 2019 Indian Ocean
Dipole, the Millennium Drought, the triple La Niña), the Australian Oilseeds
Federation (herbicide-tolerant canola, 1993), ABC News (India's chickpea duty, 2024;
South Australia's 2024 season), the ABS (population; the 7.8% inflation peak), USDA
(Indonesia grows no wheat), NHMRC *Eat for Health* (daily serves) and ABARES (land
use).

## How: idioms, marks and channels

Each chapter answers one question with the idiom that fits it. Data types:
**Q** quantitative, **O** ordinal, **N** nominal (categorical), **G** geographic.

| # | Chart | Idiom | Marks | Channels → data | Task it supports |
|---|---|---|---|---|---|
| 1 | Grains and oilseeds, 1961–2024 (lead chart) | Streamgraph | Area | x position → year (Q); band thickness → tonnes (Q), read against a 10 Mt scale bar; hue → crop (N) | See total and composition change together over 64 years |
| 2 | Harvest vs its own normal (same figure) | Matrix (heatmap) | Rect | x → year (Q, one column per year); y → crop (N); colour (diverging, 5 classes) → % from 11-year median (Q) | Spot drought years that hit every crop at once |
| 3 | Year-on-year change | Box plot | Rect, rule, point | x → % change (Q); y → crop (N); hue → focus crop (N) | Compare spread and extremes between crops |
| 4 | Crop value 2024–25 | Treemap, two levels | Rect (area), containment | area → $ value (Q); nesting → crop type → crop (N, hierarchy); hue → crop (N). Every cell labelled; the four smallest pulses are one "Others" cell, listed in its tooltip | Compare parts of a whole, inside a real hierarchy |
| 5 | Wheat exports by country (lead chart) | Flow map | Line, point (arrowhead), point | path → route from one origin (G); arrowhead → direction; line width → tonnes (Q); hue → focus (Indonesia, N) | See where the crop goes and which buyers matter |
| 6 | Wheat per km² by state | Choropleth map | Area (geoshape) | colour (sequential, 5 classes) → tonnes per km² (Q, a rate); region → state (G); grey → no published figure | Compare how intensively each state is farmed |
| 7 | Wheat tonnes by state | Proportional symbol map | Point (circle) | area → tonnes (Q); position → state centroid (G); grey state → no published figure | Compare total production; read the map as totals, not rates |
| 8 | State harvests, two seasons | Slope chart | Line, point | x → season (O); y → tonnes (Q); hue → chosen state (N) | Compare each state's change between two seasons |
| 9 | Meeting the dietary guidelines (lead chart) | Pictogram (ISOTYPE) small multiples, 2 × 2 | Point (SVG person) | count of figures → % of people (Q); hue → met / not met (N); panel → food group (N) | Make four percentages countable and concrete |
| 10 | Discretionary energy | 100% stacked bars (**basic**) | Bar, rule | x → share of daily energy (Q, 0–100%); y → survey (O); hue → discretionary / everything else (N) | Read a share of a whole, and its change, on an honest scale |
| 11 | Food insecurity | Pictogram (ISOTYPE) | Point (SVG house) | count of houses → % of households (Q); hue → insecure or not (N) | Make one headline rate concrete |
| 12 | Rain and water use, ten years (lead chart) | Aligned bar panels (**basic**) | Bar | x → financial year (O, shared); y → rainfall (Q) above, water used (Q) below; hue → driest / wettest years and what followed (N) | See that water use follows the previous year's rain |
| 13 | Rain and the wheat harvest | Scatterplot (**basic**) | Point, line (fit) | x → rainfall (Q); y → wheat harvested (Q); hue → driest / wettest years (N) | See the relationship between two quantities |
| 14 | Agriculture's footprint | 100% bars (**basic**) | Bar, rule, point (SVG icon) | x → share of a national total (Q, 0–100%); y → measure (N), with an icon per measure; hue → natural resource / economy (N); dashed rule → GDP share | Read six part-to-whole shares against agriculture's economic weight |

**Fourteen charts, nine distinct advanced idioms** (the two pictogram charts share
one idiom), **four basic charts, and three map idioms.**

### Why some charts were replaced

Each chart was checked against the question it answers; three did not fit.

- **The dumbbell (chart 14) became 100% bars.** A dumbbell compares two values per
  row, but here the left end of every row was the same 2.2% (GDP), so it was really a
  bar chart with a decoration. Each measure is agriculture's *share of a national
  total*, a part-to-whole, so each row now is that total with agriculture's part
  filled in, and the GDP share is one reference line through every row.
- **The discretionary line chart (chart 10) became 100% bars.** Two survey values do
  not make a trend, and its 28–38% axis made a four-point fall look like a collapse.
  The finding is about a share of daily energy, so each survey is now drawn as the
  whole day's energy split in two, on a full 0–100% scale.
- **Parallel coordinates became a scatterplot (chart 13).** Its finding was a trend
  over time, which parallel coordinates cannot show (time was only a hover). The
  chapter's real question is a relationship between two quantities, whether the
  harvest follows the rain, and a scatterplot is the idiom for exactly that.

**The two state maps are a deliberate pair.** The choropleth shows a **rate** (tonnes
per km²) and the symbol map the **total** (tonnes). A choropleth of totals would mostly
redraw which states are physically biggest. Both maps use a conic equal-area
projection with standard parallels across Australia's latitudes; the world map uses
the Equal Earth projection used in the studios. All three maps load TopoJSON, joined
to the data with a `lookup` on the region name. Following the week 10 studio, every
region is drawn as a base layer first, so a region with no data is shaded grey and
labelled, never left out.

## Interaction

All of it from the FIT3179 studios, and each answers a question:

- **Overview + detail (week 10).** The Grow lead chart is one figure of three linked
  views: a slim strip of the total harvest carries an interval brush, and dragging
  across it sets the year domain of both the streamgraph and the harvest matrix (the
  studio's `"scale": {"domain": {"param": "brush"}}` pattern). A readout above the
  strip summarises whatever period is showing (the average wheat crop and the
  smallest), recomputed from the data like the studio's "worst earthquake of the
  selected period".
- **Coordinated views (week 10).** Clicking a band of the streamgraph isolates that
  crop there and in the matrix. Hovering a year's rainfall on the water chart lights
  up the water used the *following* year, which is the chart's whole point.
- **Bound inputs (week 9).** A season selector on the two wheat maps (changing either
  map changes the other, and their notes recompute); a dropdown on the slope chart
  that highlights any state and rewrites its note.
- **Hover to isolate** a flow-map route, and **tooltips** everywhere carrying the exact
  value, unit and period.
- **Reset and access.** Double-click clears the zoom brush and a clicked band. Every
  chart is a keyboard-focusable image announced to screen readers with its heading,
  subtitle and finding, and the controls are native radio buttons and a dropdown.

## Design

- **Hierarchy of charts, not only of type.** Each chapter opens with one lead chart:
  full width, the tallest chart of its chapter, a larger heading and a heavy rule along
  its top edge. Supporting charts follow at half width. Inside every chart, one or two
  things carry colour and everything else is slate: wheat and canola in the
  streamgraph (barley and the minor crops are context), wheat and sugar cane in the box
  plot, New South Wales and Western Australia on the symbol map, the chosen state on
  the slope chart, Indonesia on the flow map.
- **Colour: one meaning per colour, on every chart.** Teal is wheat and supply
  (harvests, buyers, water and land, "enough", the wettest year, a state whose crop
  grew). Violet is canola. Ochre is a shortfall and only a shortfall (a short
  harvest, a drought, a state whose crop fell, discretionary food, households going
  without). Slate is context and "the rest". Mid grey on a map means no published
  figure, and is used nowhere else. Ink marks a reference line. The focus of a chart
  is picked out in its meaning colour against slate; it is never given a colour
  that means something else (the largest wheat buyer stays wheat teal, standing out
  by width and label). The palette was audited so every text colour clears 4.5:1,
  every thin mark 3:1, adjacent fills differ in luminance, and the colours stay
  distinct under simulated protanopia, deuteranopia and tritanopia. No red–green
  pairing and no rainbow scale anywhere.
- **Typography.** The title is set in Big Shoulders Stencil: condensed stencil capitals,
  like the lettering stamped on grain sacks and painted on silos, used once, for the
  page's theme. Fraunces, a soft old-style serif, sets headings and headline numbers;
  Source Sans 3 every paragraph, label and chart. Reading text is about 19 px, chart
  labels 15–16 px, and nothing renders below 15 px. **No line of any paragraph holds
  more than ten words**, checked on the rendered page.
- **Layout, spacing and sight-lines.** Every grid on the page is full width or split
  exactly in half. Every card is built from the same rows (heading, subtitle, chart,
  finding), shared across a row with CSS subgrid, and the gap from subtitle to chart
  and from chart to finding is the same 20 px in every card. Every chart with labels
  down its left side reserves the same 108 px label column, so plot areas in a column
  start on one line; each pair of charts shares its plot top and baseline (within
  1 px at four laptop widths).
- **Symbols, used sparingly.** Icons are SVG paths drawn as point shapes (the week
  10 technique), and appear only where they help a reader tell things apart: the
  person and house pictograms, and one icon per measure on the footprint chart
  (water, land, exports, jobs, GDP). No icon passes judgement: there are no smiling
  or frowning faces, because whether a share is good or bad is the reader's call.
- **Annotation.** Every chart carries an insight annotation that adds something the
  data cannot say by itself, placed in reserved space so no text sits on a bar,
  a cell or a route (checked on the rendered page): on the flow map every label sits
  in open sea or inside its own country, never on another country or across a route.

## Repository layout

```
index.html              the page
css/styles.css          design tokens, grid, typography
js/app.js               sizes and embeds the specs, links the two maps
js/specs/*.json         thirteen standalone specifications (the Grow figure
                        holds the streamgraph and the matrix together)
data/                   every dataset, plus data/README.md explaining each one
```

Each file in `js/specs/` is a complete specification that can be pasted straight
into the [Vega editor](https://vega.github.io/editor/). The only change made at
run time is the chart width, which is set to the real pixel width of its card.

## Sources

Full source list, reference periods and derivation notes:
[`data/README.md`](data/README.md).
