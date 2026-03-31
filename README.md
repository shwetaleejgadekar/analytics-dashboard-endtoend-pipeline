# Henderson Farms Analytics — SCU Practicum 2025

An end-to-end agricultural data analytics project for Henderson Farms, a California almond operation. The project covers data ingestion and cleaning, nutrient analysis, machine learning-based predictions, weather correlation, financial modeling, and interactive visualization through both a live web dashboard and a Power BI report.

---

## Project Overview

| Component | Description |
|---|---|
| **Python Analysis** | Data pipeline, EDA, ML predictions, weather correlation |
| **Online Dashboard** | React + Plotly interactive web app (deployed via GitHub Pages) |
| **Power BI Report** | Offline dashboard for farm stakeholders |

---

## Repository Structure

```
henderson-farms/
├── src/                          # React app source
│   ├── LandingPage.jsx           # Main navigation hub
│   ├── CropYieldChartPage.jsx    # Crop yield visualizations
│   ├── LeafChartPage.jsx         # Leaf nutrient analysis
│   ├── SoilChartPage.jsx         # Soil nutrient summary view
│   ├── SoilDetailedChartPage.jsx # Soil nutrient detailed view
│   ├── FertilizerFinanceChart.jsx# Fertilizer cost summary
│   ├── FertilizerChartPage.jsx   # Fertilizer detailed trends
│   ├── FinanceLandingPage.jsx    # Finance section hub
│   ├── PnLChartPage.jsx          # Profit & Loss chart
│   ├── FinancePieChartPage.jsx   # Finance category breakdown
│   └── index.js                  # App routing (HashRouter)
├── public/                       # Static assets and data CSVs
│   ├── leaf_data.csv
│   ├── thresholds.csv
│   ├── soil_data.csv
│   ├── detailed_soil_data.csv
│   ├── fertilizer_data.csv
│   ├── finance fertilizer data.csv
│   ├── pandL data.csv
│   ├── finance pie chart final tab.csv
│   ├── crop yield data pie.csv
│   └── cropyieldnormalized.csv
├── HendersonFarms_Analysis_Code20250324.ipynb  # Full Python analysis
├── Henderson_Farms_-_Practicum.pbix            # Power BI dashboard
├── package.json
└── README.md
```

---

## Python Analysis (`HendersonFarms_Analysis_Code20250324.ipynb`)

### Data Sources Ingested

- **Leaf Nutrient Data:** Lab CSV reports spanning 2021–2025 (historical + completed work), covering 24 nutrients including Nitrogen, Potassium, Calcium, Iron, Boron, Zinc, and more
- **Soil Solution Data:** Lab soil analysis files across multiple sampling dates and orchard fields
- **Weather Data:** Daily observations (temperature, precipitation, wind, pressure) merged with leaf and soil sample dates
- **Fertilizer Records:** January 2022 – April 2025 supply and sales records by field, item, unit of measure, and date
- **P&L Data:** Profit & Loss records by class, type, and basis across multiple years
- **Orchard Metadata:** Coordinates and acreage per orchard field
- **PG&E Energy Data:** Historical electricity usage and cost cross-referenced with field activity

---

### Section 1: Leaf Nutrient Analysis

**Data ingestion and cleaning:**
- Parsed and standardized lab CSV files with inconsistent headers across multiple years
- Merged historical (2021–2022) and completed work (2023) datasets into a unified DataFrame
- Standardized field name aliases across sources (e.g., `C&H 2`, `C+H 2`, `CH2` → `C&H2`)
- Dropped non-analytical columns (client info, report metadata, copyright fields)

**Nutrient classification against target ranges:**
- Loaded both old and new almond target range standards
- Classified each nutrient reading per sample as **Deficient / Low / Medium / High / Excessive** against defined thresholds
- Produced a unified comparison DataFrame aligning old and new classification schemes into a 3-tier system (Low / Medium / High)
- Identified the most common classification per nutrient across all samples

**Correlation analysis:**
- Computed a heatmap correlation matrix across key nutrients: Fe-Iron, Al-Aluminum, pH, EC, NO3-Nitrate, Mn-Manganese, Total Nitrogen, Zn-Zinc
- Key findings:
  - **Fe-Iron & Al-Aluminum** strongly correlated → indicates highly acidic soil conditions
  - **NO3-Nitrate & Total Nitrogen** positively correlated → nitrate is the primary nitrogen form absorbed by plants
  - **EC & pH** negatively correlated → higher conductivity accompanies lower pH

**Machine learning — Nitrogen prediction:**
- Trained and benchmarked Linear Regression, Random Forest, Gradient Boosting, SVR, and Decision Tree models to predict Total Nitrogen (PPM)
- Best model explained ~51% of variance (R²); remaining error attributed to weather variability and management differences between training (2021–2022) and test (2023) years

**Machine learning — EC and Fe-Iron prediction:**
- Decision Tree models built for EC (MS/CM) and Fe-Iron
- **EC model:** pH is the dominant predictor — very low pH leads to minimal EC due to reduced nutrient availability; Nitrate and Potassium are secondary contributors
- **Fe-Iron model:** Aluminum is the primary driver; Iodine and Chloride further refine the split

**Per-acre normalization:**
- Merged orchard acreage data with leaf nutrient readings
- Normalized all nutrient values per acre to enable field-to-field comparison regardless of orchard size

---

### Section 2: Soil Nutrient Analysis

- Ingested and cleaned soil solution lab files (2021–2024)
- Identified nutrients with the highest variability (largest spread between highs and lows) across fields and dates
- Time-series plots of key nutrients (Calcium and others) to surface seasonal trends
- ML model comparison to predict ORP (Oxidation-Reduction Potential) from numeric soil features
- Merged soil data with weather observations and computed a weather–soil correlation matrix:
  - **pH strongly inversely correlated with temperature** (tavg: -0.85) — warmer conditions produce more acidic soil
  - **pH positively correlated with atmospheric pressure** (0.73)
  - **Cobalt shows strong positive correlation with temperature**

---

### Section 3: Weather Correlation

- Combined multi-year weather datasets with both leaf and soil sample dates
- Correlation heatmaps across weather variables and key nutrients:
  - **Sulfur positively correlated with temperature** — warmer weather enhances sulfur uptake in almond leaves (tavg: 0.52, tmin: 0.55)
  - **Total Nitrogen positively correlated with precipitation** — rainfall drives nitrogen availability and uptake
- Time-series plots of seasonal nutrient trends by field (Nitrogen, Potassium, Phosphorous, Sulfur, Calcium)
- Wind direction distribution across orchard fields

---

### Section 4: Fertilizer Analysis

- Cleaned and parsed fertilizer purchase and application records (January 2022 – April 2025)
- Standardized field names and fertilizer item names for consistent grouping
- Analyzed unit-of-measure overlaps — identified items sold under multiple units (gal, lb, ton)
- Field-level and month-level aggregations of quantity and cost
- Output: `cleaned_fertilizer_data.csv` — the source for fertilizer dashboard visualizations

---

### Section 5: Financial Analysis (P&L)

- Parsed multi-year P&L CSV data segmented by class, type, basis, and year
- Aggregated totals by class and year for grouped bar chart visualization
- Analyzed finance category breakdowns (income vs. COGS vs. expense categories)
- Excluded summary rows (Total Income, Net Income, Total COGS, Total Expense) to preserve leaf-level category granularity

---

### Section 6: Crop Yield Analysis

- Processed yield data by orchard field and almond variety
- Normalized field name aliases across data sources
- Computed total yield by field and by variety (Mt. Lbs.)
- Calculated average **turnout percentage** across selected fields and years
- Compared Sum of N_incoming vs. Average of N_Mt Lbs by variety

---

### Section 7: PG&E Energy Analysis

- Cross-referenced PG&E historical 15-minute interval usage data with energy cost records
- Identified fields with low-usage vs. high-usage periods
- Correlated energy usage windows with leaf nutrient samples collected during the same date range

---

### Section 8: Orchard Geospatial Mapping

- Parsed GPS coordinates from orchard metadata
- Generated an interactive map of all Henderson Farms orchard locations using Plotly Express

---

## Online Dashboard (React + Plotly)

**Tech Stack:** React, React Router (HashRouter), Plotly.js, PapaParse, GitHub Pages

All chart data is loaded client-side from CSVs in `public/` using PapaParse. Every page has multi-select filters that update charts in real time.

---

### Dashboard Sections

#### Landing Page
Full-screen almond farm background with navigation to five sections: Crop Yield, Finance, Fertilizer, Leaf Nutrient, Soil Nutrient.

---

#### Crop Yield
**Filters:** Field, Year (both multi-select)

Three scrollable charts:
1. **Pie chart — Total yield by field** (Mt. Lbs.)
2. **Pie chart — Total yield by variety** (Mt. Lbs.)
3. **Bar + line chart — Sum of N_incoming vs. Average of N_Mt Lbs by variety**, with live **Turnout %** annotation

---

#### Finance
Sub-landing with two views:

**P&L Finance** — Grouped bar chart of total by financial class, grouped by year. Filters: Basis, Type, Class, Year. Live **Total** annotation updates with filters.

**Category Breakdown** — Pie chart of value by financial category. Filters: Year, Field, Category, Type. Excludes aggregate rows (Total Income, Net Income, etc.) to show granular category distribution.

---

#### Fertilizer

**Summary view** — Bar chart of total fertilizer cost by field. Filters: Fertilizer type, Field, Year. Drill-down button to detailed view.

**Detailed view** — Dual-axis chart: **stacked bar (quantity)** + **line (sales price)** by fertilizer type over Year-Month. Filters: Unit of Measure, Fertilizer, Field, Year, Month. Supports 12 color-coded fertilizer types simultaneously.

---

#### Leaf Nutrient
- Grouped bar chart: **Original Value** and **Per Acre Value** by Year-Month
- **Dynamic threshold lines** — selecting an element overlays average high (pink) and low (green) thresholds from `thresholds.csv`
- Filters: Element, Field, Year, Month (all multi-select)
- Legend click toggles traces and threshold line visibility

---

#### Soil Nutrient

**Summary view** — Grouped bar chart (Original Value and Per Acre Value) by sample date with threshold lines. Filters: Element, Field, Date. Supports 21 elements with full names (e.g., `AL–ALUMINUM`, `NO3–NITRATE`).

**Detailed view** — Dual-axis chart: **bar (Sum of Current)** on left axis + **line (Average of Ideal)** on right axis, enabling direct comparison of actual soil readings against target ideal values. Filters: Field, Parameter (single-select).

---

## Power BI Dashboard (`Henderson_Farms_-_Practicum.pbix`)

An offline Power BI report covering the same data domains for farm stakeholder presentations. Provides static and drill-through views across crop yield, finance, fertilizer, and soil/leaf nutrient data with Power BI's native filtering and cross-chart highlighting.

---

## Setup and Local Development

```bash
npm install       # Install dependencies
npm start         # Run locally at localhost:3000
npm run build     # Build for production
npm run deploy    # Deploy to GitHub Pages
```

> Requires Node.js ≥ 16. Deployment requires `gh-pages` package and `homepage` configured in `package.json`.

---

## Tech Stack

| Layer | Tool |
|---|---|
| Data analysis | Python, Pandas, NumPy, Matplotlib, Seaborn |
| Machine learning | scikit-learn (Linear Regression, Random Forest, Gradient Boosting, SVR, Decision Tree) |
| Geospatial mapping | Plotly Express |
| Frontend framework | React |
| Routing | React Router (HashRouter) |
| Charts | Plotly.js (`react-plotly.js`) |
| CSV parsing | PapaParse |
| BI reporting | Microsoft Power BI |
| Deployment | GitHub Pages |
