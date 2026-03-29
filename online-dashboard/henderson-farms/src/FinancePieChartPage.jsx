import React, { useState, useEffect } from 'react';
import Plot from 'react-plotly.js';
import Papa from 'papaparse';
import { useNavigate } from 'react-router-dom';
import treeBg from './tree_bg.png';

function FinancePieChartPage() {
  const [data, setData] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [filters, setFilters] = useState({ Year: [], Attribute: [], Category: [], Type: [] });
  const [selected, setSelected] = useState({ Year: [], Attribute: [], Category: [], Type: [] });
  const navigate = useNavigate();

  useEffect(() => {
    Papa.parse(`${process.env.PUBLIC_URL}/finance pie chart final tab.csv`, {
      download: true,
      header: true,
      complete: (results) => {
        const excludedCategories = ["Total Income", "Total COGS", "Net Income", "Total Expense"];
        const parsed = results.data.filter(r =>
          r['Category'] &&
          r['Attribute'] &&
          r['Year'] &&
          r['Type'] &&
          !isNaN(parseFloat(r['Value'])) &&
          !excludedCategories.includes(r['Category'].trim())
        );
        const getUnique = key => [...new Set(parsed.map(d => d[key]).filter(Boolean))].sort();
        setData(parsed);
        setFiltered(parsed);
        setFilters({
          Year: getUnique('Year'),
          Attribute: getUnique('Attribute'),
          Category: getUnique('Category'),
          Type: getUnique('Type')
        });
        setSelected({
          Year: getUnique('Year'),
          Attribute: getUnique('Attribute'),
          Category: getUnique('Category'),
          Type: getUnique('Type')
        });
      }
    });
  }, []);
  

  useEffect(() => {
    const f = data.filter(d =>
      selected.Year.includes(d['Year']) &&
      selected.Attribute.includes(d['Attribute']) &&
      selected.Category.includes(d['Category']) &&
      selected.Type.includes(d['Type'])
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
    const cat = d['Category'];
    grouped[cat] = (grouped[cat] || 0) + (parseFloat(d['Value']) || 0);
  });

  const labels = Object.keys(grouped).sort();
  const values = labels.map(cat => grouped[cat]);

  return (
    <div style={{
      backgroundColor: '#E8F5E9',
      backgroundImage: `url(${treeBg})`,
      backgroundRepeat: 'no-repeat',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      padding: '40px',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      position: 'relative'
    }}>
      <h1 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '20px', color: 'Black', textAlign: 'center' }}>
        Finance Category Breakdown
      </h1>

      <button onClick={() => navigate('/finance')} style={{
        position: 'absolute', top: '20px', right: '20px',
        padding: '10px 20px', backgroundColor: '#7CB342', color: 'white',
        border: 'none', borderRadius: '25px', fontWeight: 'bold',
        cursor: 'pointer', boxShadow: '0 4px 10px rgba(0,0,0,0.3)'
      }}>Back</button>

      <div style={{ display: 'flex', gap: '20px', marginBottom: '30px', flexWrap: 'wrap' }}>
        {Object.entries(filters).map(([key, options]) => (
          <div key={key}>
            <label style={{
              fontWeight: 'bold',
              color: 'black',
              display: 'block',
              textAlign: 'center',
              marginBottom: '4px'
            }}>{key === 'Attribute' ? 'Field' : key}</label>
            <select multiple value={selected[key]} onChange={handleSelect(key, options)} style={{ width: '200px' }}>
              <option value="ALL">All</option>
              {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
            </select>
          </div>
        ))}
      </div>

      {labels.length === 0 ? (
        <div style={{ color: 'darkred', fontWeight: 'bold' }}>No data available for selected filters.</div>
      ) : (
        <Plot
          data={[{
            type: 'pie',
            hole: 0,
            pull: 0,
            domain: { x: [0, 0.8] },
            labels: labels,
            values: values,
            textinfo: 'label',
            textposition: 'inside',
            automargin: true,
            hoverinfo: 'label+percent+value'
          }]}
          layout={{
            title: {
              text: 'Finance Category Breakdown',
              font: { size: 22 },
              x: 0.5,
              xanchor: 'center'
            },
            showlegend: true,
            legend: {
              orientation: 'v',
              x: 1.05,
              y: 0.5,
              font: { size: 12 }
            },
            margin: { l: 40, r: 200, b: 40, t: 80 },
            width: 1000,
            height: 650
          }}
          config={{ responsive: true }}
        />
      )}
    </div>
  );
}

export default FinancePieChartPage;
