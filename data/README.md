# Data

Every file the page reads is in this folder. Nothing is fetched from a third-party
repository at run time, so the visualisation cannot break because someone else's
repository moved. Total size is about 820 KB, dominated by the two boundary files.

## What each file is, and where it came from

### Source extracts (typed from the published tables, kept for provenance)

| File | Source | Reference period |
|---|---|---|
| `broadacre_production_summary.csv` | ABS, *Australian Agriculture: Broadacre Crops* | 2022–23 to 2024–25 |
| `broadacre_value_summary.csv` | ABS, *Australian Agriculture: Broadacre Crops* | 2022–23 to 2024–25 |
| `wheat_state_production.csv` | ABS, *Australian Agriculture: Broadacre Crops* | 2022–23 to 2024–25 |
| `food_consumption_indicators.csv` | ABS, *National Nutrition and Physical Activity Survey* | 2011–12 and 2023 |
| `water_account_national.csv` | ABS, *Water Account, Australia* | 2014–15 to 2023–24 |
| `farm_system_indicators.csv` | ABARES, *Snapshot of Australian Agriculture 2026* | 2023–24 and 2024–25 |
| `agriculture_exports_headlines.csv` | ABARES, *Snapshot of Australian Agriculture 2026* | 2004–05 to 2024–25 |
| `diet_guidelines.csv` | ABS, *National Nutrition and Physical Activity Survey* | 2023 |

Blank cells mean the source did not publish a figure for that cell. They are kept blank
rather than filled with zero, and the choropleth draws those states in grey rather than
treating them as a low value.

### Downloaded in full

| File | Source |
|---|---|
| `crop_production_long.csv` | FAOSTAT *Crops and Livestock Products* (QCL), Australia only, 1961–2024, seven crops, converted from tonnes to kilotonnes |
| `wheat_export_flows.csv` | FAOSTAT *Detailed Trade Matrix* (TM), Australian wheat export quantity by partner country, 2024, top twelve partners |
| `au-states.geojson` | State and territory boundaries, from the `rowanhogan/australian-states` repository, derived from the ABS ASGS |
| `countries-110m.json` | World country boundaries (TopoJSON), Natural Earth via the TopoJSON project |

### Derived here (and how)

| File | Derived from | Calculation |
|---|---|---|
| `wheat_state_density.csv` | `wheat_state_production.csv` + `au-states.geojson` | Tonnes of wheat divided by the state's area. Area is computed from the boundary polygons by spherical excess, not taken from a separate table. |
| `crop_value_hierarchy.csv` | `broadacre_value_summary.csv` | 2024–25 local value per crop, in a genuine two-level hierarchy for the treemap: root → {Cereal, Oilseed, Pulse} → individual crops. Group rows carry no value of their own; the treemap sums their children. |
| `wheat_export_arcs.csv` | `wheat_export_flows.csv` | 29 interpolated points along the great circle from Australia's centroid to each destination's centroid, so the flow map draws curved routes rather than straight segments. |
| `state_centroids.csv` | `au-states.geojson` | Area-weighted centroid of each state's largest polygon. |
| `farm_footprint_hierarchy.csv` | `farm_system_indicators.csv` | Same values with a `group` column (economy / natural resources / trade). The dumbbell chart reads the rows whose parent is `root`, drops GDP (it is the reference point) and drops "output exported" (a share of agricultural output, not of a national total, so it does not belong on the same axis). |
| `diet_waffle.csv` | `diet_guidelines.csv` | One row per square per food group: 100 squares, the first *n* marked as meeting the guideline. |
| `food_insecurity_waffle.csv` | ABS food insecurity figure (13.2%) | 100 squares, 13 marked. |

## Two checks worth knowing about

**The two production sources agree.** FAO reports Australian crops on a calendar year
that matches the start of the Australian financial year. Where the FAO and ABS series
overlap they reconcile exactly: both give wheat as 41,199 kilotonnes for 2022–23,
barley as 13,491 and canola as 8,918. That is why the long FAO series and the detailed
ABS tables can sit in the same story without a seam.

**The computed areas are right.** Areas calculated from the boundary file agree with
published state areas to within 0.2% (for example Western Australia: 2,531,465 km²
computed against 2,526,786 km² published).

## Scope decisions

- The streamgraph covers **wheat, barley, canola and a combined "other" band**
  (maize, dry peas and soybeans). **Sugar cane is deliberately excluded** from it: at
  about 30 million tonnes a year it is comparable to wheat by raw weight and would
  dominate the chart, but it is an irrigated tropical crop harvested for sugar, not part
  of the same winter broadacre system. It **is** included in the harvest matrix and the
  volatility box plot, where its stability is the point of the comparison.
- The volatility box plot ignores year-on-year changes where the previous year was under
  150 kilotonnes, so that percentage changes off a near-zero base do not distort it.
- The harvest matrix compares each crop with its own **eleven-year rolling median**
  rather than its all-period median. A single fixed median would make canola look
  spectacular in every recent year simply because the crop barely existed before 1990.
- Great-circle arcs on the flow map show origin, destination and volume. They are not
  shipping lanes.
- The water account has two near-ties worth stating plainly, because the page's wording
  depends on them. **2019–20 and 2018–19 tie as the driest year** at 347 mm, so 2019–20 is
  described as "equal-driest" and identified instead by the thing it holds outright, the
  decade's lowest water use (12,148 GL). **2022–23 is the wettest year** at 611 mm;
  2023–24, despite being the year of highest water use (17,223 GL), is only the third
  wettest, so it is never called the wettest.

## Official sources

- ABS, Australian Agriculture: Broadacre Crops — https://www.abs.gov.au/statistics/industry/agriculture/australian-agriculture-broadacre-crops/2024-25
- ABS, Water Account, Australia — https://www.abs.gov.au/statistics/environment/environmental-accounts/water-account-australia/2023-24
- ABS, National Nutrition and Physical Activity Survey — https://www.abs.gov.au/statistics/health/food-and-nutrition/national-nutrition-and-physical-activity-survey/2023
- ABARES, Snapshot of Australian Agriculture 2026 — https://www.agriculture.gov.au/abares/products/insights/snapshot-of-australian-agriculture
- FAOSTAT, Crops and Livestock Products — https://www.fao.org/faostat/en/#data/QCL
- FAOSTAT, Detailed Trade Matrix — https://www.fao.org/faostat/en/#data/TM
- Australian state boundaries — https://github.com/rowanhogan/australian-states
- World Atlas TopoJSON — https://github.com/topojson/world-atlas
