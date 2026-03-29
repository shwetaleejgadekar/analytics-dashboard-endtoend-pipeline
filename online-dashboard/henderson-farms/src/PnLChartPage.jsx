import React, { useState, useEffect } from 'react';
import Plot from 'react-plotly.js';
import Papa from 'papaparse';
import { useNavigate } from 'react-router-dom';
import treeBg from './tree_bg.png';

function PnLChartPage() {
  const [data, setData] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [basisList, setBasisList] = useState([]);
  const [typeList, setTypeList] = useState([]);
  const [classList, setClassList] = useState([]);
  const [yearList, setYearList] = useState([]);
  const [selectedBasis, setSelectedBasis] = useState([]);
  const [selectedType, setSelectedType] = useState([]);
  const [selectedClass, setSelectedClass] = useState([]);
  const [selectedYear, setSelectedYear] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    Papa.parse(`${process.env.PUBLIC_URL}/pandL data.csv`, {
      download: true,
      header: true,
      complete: (results) => {
        const parsed = results.data.filter(row =>
          row['Basis'] && row['Type'] && row['Class'] && row['Year'] && !isNaN(+row['Total'])
        );
        setData(parsed);
        setFiltered(parsed);
        const basis = [...new Set(parsed.map(r => r['Basis']))].sort();
        const types = [...new Set(parsed.map(r => r['Type']))].sort();
        const classes = [...new Set(parsed.map(r => r['Class']))].sort();
        const years = [...new Set(parsed.map(r => r['Year']))].sort();
        setBasisList(basis);
        setTypeList(types);
        setClassList(classes);
        setYearList(years);
        setSelectedBasis(basis);
        setSelectedType(types);
        setSelectedClass(classes);
        setSelectedYear(years);
      }
    });
  }, []);

  useEffect(() => {
    const f = data.filter(d =>
      selectedBasis.includes(d['Basis']) &&
      selectedType.includes(d['Type']) &&
      selectedClass.includes(d['Class']) &&
      selectedYear.includes(d['Year'])
    );
    setFiltered(f);
  }, [selectedBasis, selectedType, selectedClass, selectedYear, data]);

  const handleMultiSelect = (e, setter, fullList) => {
    const selected = Array.from(e.target.selectedOptions, opt => opt.value);
    setter(selected.includes('ALL') ? fullList : (selected.length ? selected : fullList));
  };

  const grouped = {};
  filtered.forEach(d => {
    const year = d['Year'];
    const cls = d['Class'];
    if (!grouped[year]) grouped[year] = {};
    grouped[year][cls] = (grouped[year][cls] || 0) + parseFloat(d['Total'] || 0);
  });

  const allClasses = [...new Set(filtered.map(d => d['Class']))].sort();
  const traces = Object.keys(grouped).map(year => ({
    x: allClasses,
    y: allClasses.map(cls => grouped[year]?.[cls] || 0),
    type: 'bar',
    name: year,
    text: allClasses.map(cls => grouped[year]?.[cls] ? grouped[year][cls].toFixed(0) : ''),
    textposition: 'outside',
    hoverinfo: 'text',
    hovertext: allClasses.map(cls => grouped[year]?.[cls] ? `${cls}: ${grouped[year][cls].toFixed(0)}` : '')
  }));

  const totalSum = filtered.reduce((sum, row) => sum + parseFloat(row['Total'] || 0), 0);

  return (
    <div style={{
      backgroundColor: '#F0F4E3',
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
      <h1 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '20px', color: 'Black', textAlign: 'center' }}>
        P and L Finance
      </h1>

      <button onClick={() => navigate('/finance')} style={{
        position: 'absolute', top: '20px', right: '20px',
        padding: '10px 20px', backgroundColor: '#7CB342', color: 'white',
        border: 'none', borderRadius: '25px', fontWeight: 'bold',
        cursor: 'pointer', boxShadow: '0 4px 10px rgba(0,0,0,0.3)'
      }}>Back</button>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '30px', marginBottom: '30px', color: 'black' }}>
        <div style={{ textAlign: 'center' }}>
          <label style={{ fontWeight: 'bold', display: 'block' }}>Basis</label>
          <select multiple value={selectedBasis} onChange={e => handleMultiSelect(e, setSelectedBasis, basisList)} style={{ width: '200px' }}>
            <option value="ALL">All</option>
            {basisList.map(b => <option key={b} value={b}>{b}</option>)}
          </select>
        </div>
        <div style={{ textAlign: 'center' }}>
          <label style={{ fontWeight: 'bold', display: 'block' }}>Type</label>
          <select multiple value={selectedType} onChange={e => handleMultiSelect(e, setSelectedType, typeList)} style={{ width: '200px' }}>
            <option value="ALL">All</option>
            {typeList.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <div style={{ textAlign: 'center' }}>
          <label style={{ fontWeight: 'bold', display: 'block' }}>Class</label>
          <select multiple value={selectedClass} onChange={e => handleMultiSelect(e, setSelectedClass, classList)} style={{ width: '200px' }}>
            <option value="ALL">All</option>
            {classList.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div style={{ textAlign: 'center' }}>
          <label style={{ fontWeight: 'bold', display: 'block' }}>Year</label>
          <select multiple value={selectedYear} onChange={e => handleMultiSelect(e, setSelectedYear, yearList)} style={{ width: '200px' }}>
            <option value="ALL">All</option>
            {yearList.map(y => <option key={y} value={y}>{y}</option>)}
          </select>
        </div>
      </div>

      <Plot
        data={traces}
        layout={{
          width: 1400,
          height: 600,
          barmode: 'group',
          title: {
            text: 'Sum of Total by Class and Year',
            font: { size: 24 },
            xref: 'container'
          },
          annotations: [
            {
              text: `<b>Total: $${totalSum.toLocaleString(undefined, { maximumFractionDigits: 0 })}</b>`,
              showarrow: false,
              align: 'right',
              x: 1,
              xanchor: 'right',
              xref: 'paper',
              y: 1.10,
              yanchor: 'bottom',
              yref: 'paper',
              font: {
                size: 20  ,
                color: 'black',
                family: 'Arial'
              }
            }
          ],
          xaxis: { title: { text: 'Class', standoff: 60 }, tickangle: 0 },
          yaxis: { title: 'Total' },
          legend: { orientation: 'h', y: -0.2 },
          bargap: 0.3,
          bargroupgap: 0.1
        }}
        config={{ responsive: true }}
      />
    </div>
  );
}

export default PnLChartPage;
