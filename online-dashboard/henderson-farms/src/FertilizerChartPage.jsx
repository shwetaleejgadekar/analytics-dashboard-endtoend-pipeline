import React, { useState, useEffect } from "react";
import Plot from "react-plotly.js";
import Papa from "papaparse";
import treeBg from "./tree_bg.png";
import { useNavigate } from "react-router-dom";

function FertilizerChartPage() {
  const [data, setData] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [filters, setFilters] = useState({
    um: "gal",
    field: "",
    fertilizer: [],
    year: [],
    month: [],
  });
  const navigate = useNavigate();

  useEffect(() => {
    Papa.parse(`${process.env.PUBLIC_URL}/fertilizer_data.csv`, {
      download: true,
      header: true,
      complete: (result) => {
        setData(result.data);
        setFiltered(result.data);
      },
    });
  }, []);

  useEffect(() => {
    const filteredData = data.filter((row) => {
      return (
        (!filters.um || row["U/M"] === filters.um) &&
        (!filters.field || row.Field === filters.field) &&
        (filters.year.length === 0 || filters.year.includes(String(row.Year))) &&
        (filters.month.length === 0 || filters.month.includes(String(row.Month)))
      );
    });
    setFiltered(filteredData);
  }, [filters, data]);

  const unique = (key) => {
    const rawValues = data.map((row) => row[key]).filter((v) => v);
    return key === "Year" || key === "Month"
      ? Array.from(new Set(rawValues.map(String))).sort((a, b) => +a - +b)
      : Array.from(new Set(rawValues)).sort((a, b) => a.localeCompare(b));
  };

  const sortedData = [...filtered].sort((a, b) => {
    const aKey = `${a.Year}-${String(a.Month).padStart(2, "0")}`;
    const bKey = `${b.Year}-${String(b.Month).padStart(2, "0")}`;
    return aKey.localeCompare(bKey);
  });

  const xLabels = sortedData.map(
    (d) => `${d.Year}-${String(d.Month).padStart(2, "0")}`
  );

  const createPlotData = () => {
    const periods = [...new Set(xLabels)];
    const fertilizers = [...new Set(sortedData.map((d) => d.Fertilizer))].filter(Boolean).sort();
    const selectedFertilizers = filters.fertilizer.length === 0 ? fertilizers : filters.fertilizer;

    const colors = [
      "#FF6B6B", "#4ECDC4", "#45B7D1", "#FFA07A", "#98D8C8", "#7986CB",
      "#F9A825", "#BCAAA4", "#81C784", "#9575CD", "#FFD54F", "#A1887F"
    ];

    const barTraces = selectedFertilizers.map((fertilizer, i) => {
      const qtyData = {};
      periods.forEach(p => qtyData[p] = 0);
      sortedData.forEach(row => {
        if (row.Fertilizer === fertilizer) {
          const period = `${row.Year}-${String(row.Month).padStart(2, "0")}`;
          qtyData[period] += parseFloat(row["Qty"] || 0);
        }
      });
      return {
        x: periods,
        y: periods.map(p => qtyData[p]),
        type: "bar",
        name: fertilizer.split("(")[0].trim(),
        marker: { color: colors[i % colors.length] },
        yaxis: "y"
      };
    });

    const lineTraces = selectedFertilizers.map((fertilizer, i) => {
      const salesData = {};
      periods.forEach(p => salesData[p] = 0);
      sortedData.forEach(row => {
        if (row.Fertilizer === fertilizer) {
          const period = `${row.Year}-${String(row.Month).padStart(2, "0")}`;
          salesData[period] += parseFloat(row["Sales Price"] || 0);
        }
      });
      return {
        x: periods,
        y: periods.map(p => salesData[p]),
        type: "scatter",
        mode: "lines+markers",
        name: `${fertilizer.split("(")[0].trim()} (Sales)`,
        yaxis: "y2",
        line: { color: colors[i % colors.length], width: 2 },
        marker: { size: 5 }
      };
    });

    return [...lineTraces.sort((a, b) => a.name.localeCompare(b.name)), ...barTraces.sort((a, b) => a.name.localeCompare(b.name))];
  };

  const handleMultiChange = (e, key) => {
    const options = Array.from(e.target.options);
    const selected = Array.from(e.target.selectedOptions, o => o.value);
    const allSelected = selected.includes("ALL");
    const allValues = options.filter(o => o.value !== "ALL").map(o => o.value);
    setFilters({ ...filters, [key]: allSelected ? allValues : selected.filter(v => v !== "ALL") });
  };

  return (
    <div
      style={{
        backgroundColor: "#FFF8DC",
        backgroundImage: `url(${treeBg})`,
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        backgroundSize: "cover",
        padding: "40px",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        position: "relative"
      }}
    >
      <h2 style={{
        fontSize: '20px',
        fontWeight: 'bold',
        color: 'black',
        marginBottom: '20px',
        textAlign: 'center'
      }}>
        Fertilizer Detailed View
      </h2>

      <button
        onClick={() => navigate("/fertilizer-finance")}
        style={{
          position: "absolute",
          top: "20px",
          right: "20px",
          padding: "10px 20px",
          backgroundColor: "#7CB342",
          color: "white",
          border: "none",
          borderRadius: "25px",
          fontWeight: "bold",
          cursor: "pointer",
          boxShadow: "0 4px 10px rgba(0,0,0,0.3)",
        }}
      >
        Back
      </button>

      <div style={{ display: 'flex', gap: '20px', marginBottom: '30px', flexWrap: 'nowrap', overflowX: 'auto', textAlign: 'center' }}>
        {[
          ["um", "U/M", false, "Unit"],
          ["fertilizer", "Fertilizer", true, "Fertilizer (Bar + Line)"],
          ["field", "Field", false, "Field"],
          ["year", "Year", true, "Year"],
          ["month", "Month", true, "Month"]
        ].map(([stateKey, dataKey, isMultiple, label]) => (
          <div key={stateKey} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <label style={{ fontWeight: 'bold', marginBottom: '4px', color: 'black', whiteSpace: 'pre-line' }}>{label}</label>
            <select
              style={{ width: isMultiple ? '180px' : '120px' }}
              value={!isMultiple ? filters[stateKey] : undefined}
              multiple={!!isMultiple}
              onChange={(e) => {
                if (isMultiple) {
                  handleMultiChange(e, stateKey);
                } else {
                  setFilters({ ...filters, [stateKey]: e.target.value });
                }
              }}
            >
              {isMultiple && <option value="ALL">All</option>}
              {!isMultiple && <option value="">All {label}</option>}
              {unique(dataKey).map((v) => (
                <option key={v} value={v}>
                  {stateKey === "fertilizer" ? v.split("(")[0].trim() : v}
                </option>
              ))}
            </select>
          </div>
        ))}
      </div>

      <Plot
        data={createPlotData()}
        layout={{
          width: 1300,
          height: 650,
          barmode: "stack",
          title: "Fertilizer Quantity and Sales Price Trends",
          xaxis: { title: "Year-Month", type: "category" },
          yaxis: { title: "Quantity (Selected Unit) - Bar Chart", rangemode: "tozero" },
          yaxis2: {
            title: "Sales Price ($) - Line Chart",
            overlaying: "y",
            side: "right",
            rangemode: "tozero"
          },
          legend: { x: 1.05, y: 1 },
          bargap: 0.15,
          bargroupgap: 0.1
        }}
        config={{ responsive: true }}
      />
    </div>
  );
}

export default FertilizerChartPage;