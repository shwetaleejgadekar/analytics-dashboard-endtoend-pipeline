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


## Analysis

**Data Cleaning & Integration**
- Consolidated lab CSVs (2021–2025) with inconsistent headers across 8 sources into a single analysis-ready DataFrame
- Merged leaf nutrient, soil, weather, fertilizer, P&L, and orchard acreage data for cross-domain analysis

**EDA & Statistical Analysis**
- Classified 24 leaf nutrients per sample against almond-specific target thresholds; unified two classification standards into a consistent 3-tier schema
- Correlation heatmaps across nutrients and weather variables — soil pH inversely correlated with temperature (r = -0.85), sulfur uptake positively correlated with temperature (r = 0.52)
- Normalized nutrient readings per orchard acre for field-to-field comparison; time-series analysis of seasonal nutrient trends

**Machine Learning**
- Benchmarked 5 regression models (Linear Regression, Random Forest, Gradient Boosting, SVR, Decision Tree) to predict Total Nitrogen; best model R² ≈ 0.51
- Decision Tree models identified pH as primary driver of EC and Aluminum as primary driver of Fe-Iron levels

**Additional Analysis:** fertilizer cost aggregation by field and month, multi-year P&L breakdown, crop yield and turnout % by variety, PG&E energy usage correlation, orchard geospatial mapping

---

## Dashboards

**Online (React + Plotly)** — 5 interactive sections with real-time multi-select filters: Crop Yield, Finance (P&L + category breakdown), Fertilizer (summary + dual-axis detail), Leaf Nutrient (with dynamic threshold lines), and Soil Nutrient (actual vs. ideal comparison).

**Power BI** — Offline stakeholder report with drill-through views and cross-chart filtering across all data domains.

---

## Setup
```bash
npm install && npm start         # Run locally
npm run build && npm run deploy  # Deploy to GitHub Pages
```
