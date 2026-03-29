import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter, Routes, Route } from 'react-router-dom';
import LandingPage from './LandingPage';
import ChartPage from './LeafChartPage';
import SoilChartPage from './SoilChartPage';
import CropYieldChartPage from './CropYieldChartPage';
import PnLChartPage from './PnLChartPage';
import FinancePieChartPage from './FinancePieChartPage';
import FinanceLandingPage from './FinanceLandingPage';
import FertilizerFinanceChart from './FertilizerFinanceChart';
import FertilizerChartPage from './FertilizerChartPage';
import SoilDetailedChartPage from './SoilDetailedChartPage';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <HashRouter>
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/chart" element={<ChartPage />} />
      <Route path="/soil" element={<SoilChartPage />} />
      <Route path="/crop-yield" element={<CropYieldChartPage />} />
      <Route path="/pnl-data" element={<PnLChartPage />} />
      <Route path="/finance-pie" element={<FinancePieChartPage />} />
      <Route path="/finance" element={<FinanceLandingPage />} />
      <Route path="/fertilizer-finance" element={<FertilizerFinanceChart />} />
      <Route path="/fertilizer-detailed" element={<FertilizerChartPage />} />
      <Route path="/soil-detailed" element={<SoilDetailedChartPage />} />
    </Routes>
  </HashRouter>
);
