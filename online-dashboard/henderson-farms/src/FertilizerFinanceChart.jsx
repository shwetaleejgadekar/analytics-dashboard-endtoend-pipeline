import React, { useState, useEffect } from 'react';
import Plot from 'react-plotly.js';
import Papa from 'papaparse';
import { useNavigate } from 'react-router-dom';
import treeBg from './tree_bg.png';

function FertilizerFinanceChart() {
  const [data, setData] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [filters, setFilters] = useState({ Fertilizer: [], Year: [], Field: [] });
  const [selected, setSelected] = useState({ Fertilizer: [], Year: [], Field: [] });
  const navigate = useNavigate();

  useEffect(() => {
    Papa.parse(`${process.env.PUBLIC_URL}/finance fertilizer data.csv`, {
      download: true,
      header: true,
      complete: (results) => {
        const parsed = results.data.filter(r => r['Name'] && r['Amount'] && r['Item'] && r['Date']);
        const enriched = parsed.map(d => ({
          ...d,
          Year: new Date(d['Date']).getFullYear().toString(),
          Fertilizer: d['Item'],
          Field: d['Name']
        }));
        setData(enriched);
        setFiltered(enriched);

        const getUnique = key => [...new Set(enriched.map(d => d[key]).filter(Boolean))].sort();
        const fertilizerList = getUnique('Fertilizer');
        const yearList = getUnique('Year');
        const fieldList = getUnique('Field');

        setFilters({ Fertilizer: fertilizerList, Year: yearList, Field: fieldList });
        setSelected({ Fertilizer: fertilizerList, Year: yearList, Field: fieldList });
      }
    });
  }, []);

  useEffect(() => {
    const f = data.filter(d =>
      selected.Fertilizer.includes(d['Fertilizer']) &&
      selected.Year.includes(d['Year']) &&
      selected.Field.includes(d['Field'])
    );
    setFiltered(f);
  }, [selected, data]);

  const handleSelect = (key, allOptions) => (e) => {
    const selectedValues = Array.from(e.target.selectedOptions, opt => opt.value);
    setSelected(prev => ({
      ...prev,
      [key]: selectedValues.includes('ALL') ? allOptions : (selectedValues.length ? selectedValues : allOptions)
    }));
  };

  const grouped = {};
  filtered.forEach(d => {
    const field = d['Field'];
    grouped[field] = (grouped[field] || 0) + (parseFloat(d['Amount']) || 0);
  });

  const xLabels = Object.keys(grouped).sort();
  const yValues = xLabels.map(field => grouped[field]);

  const orderedKeys = ['Fertilizer', 'Field', 'Year'];

  return (
    <div style={{
      backgroundColor: '#F1F8E9',
      backgroundImage: `url(${treeBg})`,
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center',
      backgroundSize: 'cover',
      padding: '40px 40px 40px 40px',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      position: 'relative'
    }}>
      <button onClick={() => navigate('/')} style={{
        position: 'absolute', top: '20px', right: '20px',
        padding: '10px 20px', backgroundColor: '#7CB342', color: 'white',
        border: 'none', borderRadius: '25px', fontWeight: 'bold',
        cursor: 'pointer', boxShadow: '0 4px 10px rgba(0,0,0,0.3)'
      }}>Back</button>

      <h2 style={{ color: 'Black', marginTop: '1px', marginBottom: '20px' }}>Fertilizer Data</h2>

      <div style={{ display: 'flex', gap: '20px', marginBottom: '30px', flexWrap: 'wrap' }}>
        {orderedKeys.map(key => (
          <div key={key} style={{ textAlign: 'center' }}>
            <label style={{ fontWeight: 'bold', color: 'black', display: 'block' }}>{key}</label>
            <select multiple value={selected[key]} onChange={handleSelect(key, filters[key])} style={{ width: '200px' }}>
              <option value='ALL'>All</option>
              {filters[key].map(opt => <option key={opt} value={opt}>{opt}</option>)}
            </select>
          </div>
        ))}
      </div>

      <button onClick={() => navigate('/fertilizer-detailed')} style={{
        marginBottom: '30px',
        padding: '12px 24px',
        backgroundColor: '#558B2F',
        color: 'white',
        fontSize: '1rem',
        border: 'none',
        borderRadius: '20px',
        cursor: 'pointer',
        fontWeight: 'bold',
        boxShadow: '0 3px 8px rgba(0,0,0,0.2)'
      }}>
        Detailed View
      </button>

      {xLabels.length === 0 ? (
        <div style={{ color: 'darkred', fontWeight: 'bold' }}>No data available for selected filters.</div>
      ) : (
        <Plot
          data={[{
            x: xLabels,
            y: yValues,
            type: 'bar',
            text: yValues.map(v => v.toFixed(0)),
            textposition: 'outside',
            marker: { color: '#8BC34A' },
            hoverinfo: 'text',
            hovertext: xLabels.map((label, i) => `${label}: ${yValues[i].toFixed(0)}`)
          }]}
          layout={{
            title: 'Fertilizer Finance: Amount by Field',
            xaxis: { title: 'Field', tickangle: 45 },
            yaxis: { title: 'Total Cost ($)' },
            bargap: 0.4,
            width: 1300,
            height: 600
          }}
          config={{ responsive: true }}
        />
      )}
    </div>
  );
}

export default FertilizerFinanceChart;
