# Australia grows far more food than it eats

FIT3179 Data Visualisation 2, Monash University, Semester 2 2026.
Topic 25: Australia's food system.

A single scrolling page of fourteen Vega-Lite and Vega charts, including three
different map idioms, that follows Australian food from the paddock to the plate
and asks why a country this productive still has households that run short of
food.

**Open `index.html` through a web server** (VS Code Live Server,
`python -m http.server`, or GitHub Pages). Opening the file directly with
`file://` will not work, because the browser blocks the local data files.

---

## Munzner's What / Why / Who / How

**What.** Australian crop production and value (ABS), wheat production by state
(ABS), long-run crop production 1961–2024 (FAO), wheat exports by destination
country (FAO), national water accounts (ABS), food consumption and food security
(ABS), and sector shares (ABARES). The assignment requires data from two
different sources; this uses three independent agencies, cross-checked against
each other.

**Why.** Australia produces a very large food surplus and exports most of it.
That surplus depends on rainfall it cannot control and on a share of national
water and land far larger than its share of the economy. Putting production,
trade, consumption and resource use on one page shows a trade-off that is
invisible in any one of them.

**Who.** A general Australian reader with no agricultural or statistical
background. Only one chart uses a statistical summary — the box plot — and its
subtitle explains what the box, the centre line and the dots each mean, without
using the words quartile or percentile.

**How.** Each chapter answers one question with the idiom that fits it.

| # | Chart | Idiom | Advanced? | Why this idiom |
|---|---|---|---|---|
| 1 | Grains and oilseeds, 1961–2024 | Streamgraph | yes | Total and composition change together over a long series |
| 2 | Harvest vs its own normal | Matrix / heatmap | yes | 7 crops × 64 years needs a dense small-cell layout |
| 3 | Year-on-year change | Box plot | yes | The question is about spread and outliers, not one value |
| 4 | Crop value 2024–25 | Treemap, two levels | yes | Cereal/oilseed/pulse groups, each holding its own crops — a genuine hierarchy, not nine siblings dressed up as one |
| 5 | Wheat per km² by state | Choropleth | yes | A rate over defined regions |
| 6 | Wheat tonnes by state | Proportional symbol map | yes | An absolute total, which must not go on a choropleth |
| 7 | Wheat exports by country | Flow map | yes | Movement between an origin and many destinations |
| 8 | State harvests, two seasons | Slope chart | yes | Six states, two seasons each — a real multi-item slope |
| 9 | Meeting the dietary guidelines | Waffle, small multiples, ISOTYPE icons | yes | Turns four percentages into countable, recognisable people |
| 10 | Discretionary energy | Two-point comparison | **no** | Exactly one series, two years — a basic line chart by the rubric's own definition; not dressed up as more than it is |
| 11 | Rainfall vs water use | Connected scatterplot | yes | Two measures moving together through time |
| 12 | Footprint vs economic weight | Dumbbell plot | yes | A gap between two values per row is the whole point |
| 13 | Ten years of water | Parallel coordinates | yes | Four measures per year, compared across years |
| 14 | Food insecurity | Waffle / ISOTYPE icons | yes | One headline rate, made concrete |

**Fourteen charts, twelve advanced idioms, one basic, three map idioms** —
against a rubric requirement of more than ten charts, at least eight advanced
idioms and at least three maps. Chart 10 is deliberately left off the advanced
list: it is one series compared at two points in time, which is a line chart
regardless of styling, and the rubric is explicit that idioms should be
applied because they fit, not stretched to look more advanced than the data
supports. The other twelve clear the bar with margin to spare even without it.

None of the fourteen is a bar, stacked bar, grouped bar, dot plot, line, area,
pie, scatterplot or bubble chart, the nine forms the rubric lists as basic —
except chart 10, which is honestly one of them.

### The two maps are a deliberate pair

The choropleth shows a **rate** (tonnes per square kilometre) and the symbol map
shows the **total** (tonnes). A choropleth of raw totals would mostly redraw the
map of which states are physically biggest. Showing both, from the same data and
linked to the same season control, makes the distinction the point rather than a
footnote: Victoria works its land hardest, Western Australia sells the most
wheat.

A dot map and a bin map were considered and rejected. Both need point-level
observations, and the finest spatial resolution the ABS publishes for this
series is the state.

### Why the footprint chart is a dumbbell

It began as a packed bubble chart. Two things were wrong with that. Encoding the
only quantitative attribute as circle **area** is a weak channel when position
on a common scale was available, and the rubric lists bubble charts as a basic
idiom — as it does dot plots, which ruled out the obvious lollipop replacement
too. The dumbbell fixes both: position carries the value, and the left-hand dot
pins every row to agriculture's 2.2% share of GDP, so the chart shows the *gap*
rather than seven unrelated magnitudes.

## Interaction

Interaction is used only where it answers a question:

- **Season selector on the two wheat maps.** Changing it on either map changes
  the other, so the rate view and the total view always describe the same year.
- **Hover on the flow map** isolates a single export route from the twelve.
- **Tooltips** everywhere, carrying the exact value, the units and the reference
  period.