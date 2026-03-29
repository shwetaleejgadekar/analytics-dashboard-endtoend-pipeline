
import React, { useState, useEffect } from 'react';
import Plot from 'react-plotly.js';
import Papa from 'papaparse';
import treeBg from './tree_bg.png';
import { useNavigate } from 'react-router-dom';

function ChartPage() {
  const [data, setData] = useState([]);
  const [thresholds, setThresholds] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [filters, setFilters] = useState({ element: [], year: [], month: [], field: [] });
  const [hiddenTraces, setHiddenTraces] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    Papa.parse(`${process.env.PUBLIC_URL}/leaf_data.csv`, {
      download: true,
      header: true,
      complete: (result) => {
        const cleanedData = result.data.filter(d =>
          d.element && d.field && d.year && d.month &&
          d.value !== undefined && d.normalizedValue !== undefined &&
          !isNaN(+d.value) && !isNaN(+d.normalizedValue)
        );
        setData(cleanedData);
        setFiltered(cleanedData);
      }
    });

    Papa.parse('/thresholds.csv', {
      download: true,
      header: true,
      complete: (result) => {
        setThresholds(result.data);
      }
    });
  }, []);

  useEffect(() => {
    const filteredData = data.filter(row => {
      return (filters.element.length === 0 || filters.element.includes(row.element)) &&
             (filters.year.length === 0 || filters.year.includes(String(row.year))) &&
             (filters.month.length === 0 || filters.month.includes(String(row.month))) &&
             (filters.field.length === 0 || filters.field.includes(row.field));
    });
    setFiltered(filteredData);
  }, [filters, data]);

  const unique = (key) => {
    const rawValues = data.map(row => row[key]).filter(v => v !== undefined && v !== null && v !== '');
    const values = Array.from(new Set(rawValues));
    return key === 'year' || key === 'month'
      ? values.map(String).sort((a, b) => +a - +b)
      : values.sort((a, b) => a.localeCompare(b));
  };

  const grouped = {};
  filtered.forEach(d => {
    const key = `${d.year}-${String(d.month).padStart(2, '0')}`;
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(d);
  });

  const sortedData = Object.entries(grouped)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, group]) => {
      const avgValue = group.reduce((sum, d) => sum + +d.value, 0) / group.length;
      const avgNorm = group.reduce((sum, d) => sum + +d.normalizedValue, 0) / group.length;
      return {
        key,
        avgValue,
        avgNorm
      };
    });

  const xLabels = sortedData.map(d => d.key);

  // Compute average threshold values across selected elements
  let high = null;
  let low = null;

  if (filters.element.length > 0) {
    const selectedThresholds = thresholds.filter(t => filters.element.includes(t['Element_Full']));
    const highVals = selectedThresholds.map(t => +t['High Threshold Value']).filter(v => !isNaN(v));
    const lowVals = selectedThresholds.map(t => +t['Low Threshold Value']).filter(v => !isNaN(v));

    if (highVals.length > 0) {
      high = highVals.reduce((a, b) => a + b, 0) / highVals.length;
    }
    if (lowVals.length > 0) {
      low = lowVals.reduce((a, b) => a + b, 0) / lowVals.length;
    }
  }

  const shapes = [];
  const showThresholds = !hiddenTraces['Original Value'];
  if (showThresholds && high != null) {
    shapes.push({
      type: 'line',
      xref: 'paper',
      x0: 0,
      x1: 1,
      y0: high,
      y1: high,
      line: { color: 'hotpink', width: 2 }
    });
  }
  if (showThresholds && low != null) {
    shapes.push({
      type: 'line',
      xref: 'paper',
      x0: 0,
      x1: 1,
      y0: low,
      y1: low,
      line: { color: 'forestgreen', width: 2 }
    });
  }

  const handleMultiSelect = (e, key) => {
    const selected = Array.from(e.target.selectedOptions, option => option.value);
    setFilters(prev => ({ ...prev, [key]: selected }));
  };

  const handleLegendClick = (e) => {
    const name = e.data[e.curveNumber].name;
    const isCurrentlyHidden = hiddenTraces[name];
    const newHiddenState = { ...hiddenTraces, [name]: !isCurrentlyHidden };
    setHiddenTraces(newHiddenState);
    return false;
  };

  return (
    <div style={{
      backgroundColor: '#ADEBB3',
      backgroundImage: `url(${treeBg})`,
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center',
      backgroundSize: 'cover',
      padding: '20px 40px 40px 40px',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      position: 'relative'
    }}>
      <button
        onClick={() => navigate('/')}
        style={{
          position: 'absolute',
          top: '20px',
          right: '20px',
          padding: '10px 20px',
          backgroundColor: '#7CB342',
          color: 'white',
          border: 'none',
          borderRadius: '25px',
          fontWeight: 'bold',
          cursor: 'pointer',
          boxShadow: '0 4px 10px rgba(0,0,0,0.3)'
        }}
      >
        Back
      </button>

      <h2 style={{ color: 'black', fontWeight: 'bold', marginBottom: '20px', fontSize: '20px', textAlign: 'center' }}>
        Leaf Nutrient
      </h2>

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '20px' }}>
        <div style={{
          display: 'flex',
          gap: '20px',
          flexWrap: 'wrap',
          justifyContent: 'center'
        }}>
          {['element', 'field', 'year', 'month'].map((key) => (
            <div key={key} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <label style={{ fontWeight: 'bold', marginBottom: '4px', color: 'black' }}>
                {key.charAt(0).toUpperCase() + key.slice(1)}
              </label>
              <select multiple value={filters[key]} onChange={e => handleMultiSelect(e, key)} style={{ width: '200px' }}>
                <option value="">All</option>
                {unique(key).map(v => <option key={v} value={v}>{v}</option>)}
              </select>
            </div>
          ))}
        </div>
      </div>

      <Plot
        data={[
          {
            x: xLabels,
            y: sortedData.map(d => d.avgValue),
            type: 'bar',
            name: 'Original Value',
            visible: hiddenTraces['Original Value'] ? 'legendonly' : true,
            marker: { color: '#86CFFF' },
            text: sortedData.map(d => d.avgValue.toFixed(3)),
            textposition: 'outside',
            textfont: { size: 12, color: 'black' },
            hovertemplate: '%{x}:<br> %{y:.3f}<extra></extra>'
          },
          {
            x: xLabels,
            y: sortedData.map(d => d.avgNorm),
            type: 'bar',
            name: 'Per Acre Value',
            visible: hiddenTraces['Per Acre Value'] ? 'legendonly' : true,
            marker: { color: '#CAC691' },
            text: sortedData.map(d => d.avgNorm.toFixed(3)),
            textposition: 'outside',
            textfont: { size: 12, color: 'black' },
            hovertemplate: '%{x}<br>Per Acre Value: %{y:.3f}<extra></extra>'
          }
        ]}
        layout={{
          width: 1300,
          height: 650,
          barmode: 'group',
          title: 'Leaf Nutrient',
          xaxis: { title: 'Year-Month', type: 'category' },
          yaxis: { autorange: true },
          legend: { x: 1.1, y: 1 },
          shapes,
          annotations: [
            high != null && showThresholds ? {
              xref: 'paper',
              yref: 'y',
              x: 1,
              y: high,
              text: `Avg High: ${high.toFixed(2)}`,
              showarrow: false,
              font: { color: 'hotpink', size: 12 },
              yshift: -20,
              xanchor: 'left',
              align: 'right'
            } : null,
            low != null && showThresholds ? {
              xref: 'paper',
              yref: 'y',
              x: 1,
              y: low,
              text: `Avg Low: ${low.toFixed(2)}`,
              showarrow: false,
              font: { color: 'forestgreen', size: 12 },
              yshift: -20,
              xanchor: 'left',
              align: 'right'
            } : null
          ].filter(Boolean)
        }}
        config={{ responsive: true }}
        onLegendClick={handleLegendClick}
      />
    </div>
  );
}

export default ChartPage;
