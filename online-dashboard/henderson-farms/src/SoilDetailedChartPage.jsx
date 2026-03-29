import React, { useState, useEffect } from 'react';
import Plot from 'react-plotly.js';
import Papa from 'papaparse';
import treeBg from './tree_bg.png';
import { useNavigate } from 'react-router-dom';

function SoilDetailedChartPage() {
  const [data, setData] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [fields, setFields] = useState([]);
  const [parameters, setParameters] = useState([]);
  const [selectedField, setSelectedField] = useState('ALL');
  const [selectedParameter, setSelectedParameter] = useState('ALL');
  const navigate = useNavigate();

  useEffect(() => {
    Papa.parse(`${process.env.PUBLIC_URL}/detailed_soil_data.csv`, {
      download: true,
      header: true,
      complete: (results) => {
        const parsed = results.data
          .map(d => ({
            SampleDate: d['SampleDate'],
            Field: d['Field'],
            Parameter: d['Parameter'],
            SumOfCurrent: parseFloat(d['Sum of Current']) || 0,
            AvgOfIdeal: parseFloat(d['Average of Ideal']) || 0
          }))
          .filter(d => d.SampleDate && d.Field && d.Parameter);

        setData(parsed);

        const uniqueFields = [...new Set(parsed.map(d => d.Field))].sort();
        const uniqueParameters = [...new Set(parsed.map(d => d.Parameter))].sort();

        setFields(uniqueFields);
        setParameters(uniqueParameters);
        setSelectedField('ALL');
        setSelectedParameter('ALL');
      }
    });
  }, []);

  useEffect(() => {
    const f = data.filter(d =>
      (selectedField === 'ALL' || d.Field === selectedField) &&
      (selectedParameter === 'ALL' || d.Parameter === selectedParameter)
    );
    setFiltered(f);
  }, [data, selectedField, selectedParameter]);

  const dates = filtered.map(d => d.SampleDate);
  const sumCurrents = filtered.map(d => d.SumOfCurrent);
  const avgIdeals = filtered.map(d => d.AvgOfIdeal);

  return (
    <div style={{
      backgroundColor: '#E8F5E9',
      backgroundImage: `url(${treeBg})`,
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center',
      backgroundSize: 'cover',
      padding: '40px',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      position: 'relative'
    }}>
      <button
        onClick={() => navigate('/soil')}
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

      <h2 style={{ color: 'black', marginTop: '20px', marginBottom: '30px' }}>Soil Detailed View</h2>

      <div style={{ display: 'flex', gap: '40px', marginBottom: '30px', flexWrap: 'wrap', justifyContent: 'center' }}>
        <div>
          <label style={{ fontWeight: 'bold', color: 'black', display: 'block', textAlign: 'center', marginBottom: '5px' }}>Field</label>
          <select
            value={selectedField}
            onChange={e => setSelectedField(e.target.value)}
            style={{ width: '200px' }}
          >
            <option value="ALL">All</option>
            {fields.map(f => <option key={f} value={f}>{f}</option>)}
          </select>
        </div>

        <div>
          <label style={{ fontWeight: 'bold', color: 'black', display: 'block', textAlign: 'center', marginBottom: '5px' }}>Parameter</label>
          <select
            value={selectedParameter}
            onChange={e => setSelectedParameter(e.target.value)}
            style={{ width: '200px' }}
          >
            <option value="ALL">All</option>
            {parameters.map(p => <option key={p} value={p}>{p}</option>)}
          </select>
        </div>
      </div>

      <Plot
        data={[
          {
            x: dates,
            y: sumCurrents,
            type: 'bar',
            name: 'Sum of Current',
            yaxis: 'y1',
            marker: { color: '#ADD8E6' } // light blue
          },
          {
            x: dates,
            y: avgIdeals,
            type: 'scatter',
            mode: 'lines+markers',
            name: 'Average of Ideal',
            yaxis: 'y2',
            line: { color: '#FF69B4' } // hot pink
          }
        ]}
        layout={{
          title: 'Sum of Current vs Average of Ideal',
          xaxis: { title: 'Sample Date', type: 'category' },
          yaxis: { title: 'Sum of Current', side: 'left' },
          yaxis2: {
            title: 'Average of Ideal',
            overlaying: 'y',
            side: 'right'
          },
          height: 660,
          width: 1300,
          legend: {
            orientation: 'v',
            x: 1.05,
            y: 1,
            xanchor: 'left',
            yanchor: 'top',
            font: {
              size: 12,
              color: '#000'
            },
            bgcolor: 'rgba(0,0,0,0)',
            borderwidth: 0
          }
        }}
      />
    </div>
  );
}

export default SoilDetailedChartPage;
