import React, { useState, useEffect, useRef } from 'react';
import Plot from 'react-plotly.js';
import Papa from 'papaparse';
import { useNavigate } from 'react-router-dom';
import treeBg from './tree_bg.png';

function CropYieldChartPage() {
  const [data, setData] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [normalizedData, setNormalizedData] = useState([]);
  const [fieldCodes, setFieldCodes] = useState([]);
  const [years, setYears] = useState([]);
  const [selectedFields, setSelectedFields] = useState([]);
  const [selectedYears, setSelectedYears] = useState([]);
  const [averageTurnout, setAverageTurnout] = useState(null);
  const navigate = useNavigate();

  const secondPieRef = useRef(null);
  const thirdChartRef = useRef(null);
  const topRef = useRef(null);

  const scrollToSecondPie = () => {
    if (secondPieRef.current) secondPieRef.current.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToThirdChart = () => {
    if (thirdChartRef.current) thirdChartRef.current.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToTop = () => {
    if (topRef.current) topRef.current.scrollIntoView({ behavior: 'smooth' });
  };

  const normalizeField = (name) => {
    const n = name?.toUpperCase().trim();
    if (!n) return '';
    if (["C & H 2", "C&H 2", "C & H 2 BLOCK 2 & 3"].includes(n)) return "C & H 2";
    if (["C & H 3", "C&H 3"].includes(n)) return "C & H 3";
    if (["GL 9 ACRE BLOCK", "GL NON/FRITZ BLOCK", "GL-RANCH", "GL RANCH", "GL NON/FRITZ BLOCK &GL-RANCH", "GL 9 ACRE BLOCK, GL NON/FRITZ BLOCK &GL-RANCH", "GL 9 ACRE BLOCK, GL NON/FRITZ BLOCK, GL NON/BUTTE BLOCK, GL EN40 &GL-RANCH"].includes(n)) return "GL-RANCH";
    if (["GOLFP", "GOLF-P"].includes(n)) return "GOLF-P";
    return n;
  };

  useEffect(() => {
    Papa.parse(`${process.env.PUBLIC_URL}/crop yield data pie.csv`, {
      download: true,
      header: true,
      complete: (results) => {
        const parsed = results.data.filter(row => row['Orchard Code'] && row['Variety'] && row['Year']);
        const normalized = parsed.map(d => ({ ...d, 'Orchard Code': normalizeField(d['Orchard Code']) }));
        const fields = Array.from(new Set(normalized.map(d => d['Orchard Code']))).sort();
        const yearList = [...new Set(normalized.map(d => d['Year']))].sort();
        setData(normalized);
        setFiltered(normalized);
        setFieldCodes(fields);
        setYears(yearList);
        setSelectedFields(fields);
        setSelectedYears(yearList);
      }
    });

    Papa.parse(`${process.env.PUBLIC_URL}/cropyieldnormalized.csv`, {
      download: true,
      header: true,
      complete: (results) => {
        const cleaned = results.data.map(row => {
          const fixed = {};
          for (let key in row) fixed[key.trim()] = row[key];
          return fixed;
        });
        const normalized = cleaned.map(row => ({
          'Orchard Code': normalizeField(row['Orchard Code']),
          'Year': row['Year'],
          'Variety': row['Variety'],
          'Sum of N_incoming': parseFloat(row['Sum of N_incoming']) || 0,
          'Average of N_Mt Lbs': parseFloat(row['Average of N_Mt Lbs']) || 0,
          'Turnout': parseFloat(row['Turnout']) || null
        })).filter(row => row['Orchard Code'] && row['Year'] && row['Variety']);
        setNormalizedData(normalized);
      }
    });
  }, []);

  useEffect(() => {
    const f = data.filter(d =>
      selectedFields.includes(d['Orchard Code']) &&
      selectedYears.includes(d['Year'])
    );
    setFiltered(f);
  }, [selectedFields, selectedYears, data]);

  useEffect(() => {
    const relevant = normalizedData.filter(
      d => selectedFields.includes(d['Orchard Code']) && selectedYears.includes(d['Year']) && d.Turnout !== null
    );
    if (relevant.length > 0) {
      const avg = relevant.reduce((sum, d) => sum + d.Turnout, 0) / relevant.length;
      setAverageTurnout(avg.toFixed(2));
    } else {
      setAverageTurnout(null);
    }
  }, [normalizedData, selectedFields, selectedYears]);

  const normalizedChartData = () => {
    const filteredNormalized = normalizedData.filter(d =>
      selectedFields.includes(d['Orchard Code']) &&
      selectedYears.includes(d['Year'])
    );

    const grouped = {};
    filteredNormalized.forEach(d => {
      const variety = d['Variety'];
      if (!grouped[variety]) grouped[variety] = { sumN: 0, avgN: [] };
      grouped[variety].sumN += d['Sum of N_incoming'];
      grouped[variety].avgN.push(d['Average of N_Mt Lbs']);
    });

    const varieties = Object.keys(grouped).sort();
    const sumIncoming = varieties.map(v => grouped[v].sumN);
    const avgMtLbs = varieties.map(v => {
      const arr = grouped[v].avgN;
      return arr.reduce((a, b) => a + b, 0) / arr.length;
    });

    return { varieties, sumIncoming, avgMtLbs };
  };

  const normData = normalizedChartData();

  return (
    <div ref={topRef} style={{
      backgroundColor: 'Black',
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
      <h1 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '20px', color: 'Black' }}>
        Crop Yield
      </h1>
      <button onClick={() => navigate('/')} style={{
        position: 'absolute', top: '20px', right: '20px',
        padding: '10px 20px', backgroundColor: '#7CB342', color: 'white',
        border: 'none', borderRadius: '25px', fontWeight: 'bold',
        cursor: 'pointer', boxShadow: '0 4px 10px rgba(0,0,0,0.3)'
      }}>Back</button>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '30px', marginBottom: '20px' }}>
        <div style={{ textAlign: 'center' }}>
          <label style={{ fontWeight: 'bold', fontSize: '20px', color: 'black' }}>Field</label><br />
          <select multiple value={selectedFields} onChange={e => {
            const selected = Array.from(e.target.selectedOptions, option => option.value);
            setSelectedFields(selected.includes('ALL') || selected.length === 0 ? fieldCodes : selected);
          }} style={{ width: '250px', marginTop: '10px' }}>
            <option value="ALL">All</option>
            {fieldCodes.map(code => <option key={code} value={code}>{code}</option>)}
          </select>
        </div>

        <div style={{ textAlign: 'center' }}>
          <label style={{ fontWeight: 'bold', fontSize: '20px', color: 'black' }}>Year</label><br />
          <select multiple value={selectedYears} onChange={e => {
            const selected = Array.from(e.target.selectedOptions, option => option.value);
            setSelectedYears(selected.includes('ALL') || selected.length === 0 ? years : selected);
          }} style={{ width: '150px', marginTop: '10px' }}>
            <option value="ALL">All</option>
            {years.map(y => <option key={y} value={y}>{y}</option>)}
          </select>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '60px', alignItems: 'center' }}>
        <div style={{ position: 'relative' }}>
          <Plot
            data={[{
              labels: filtered.map(d => d['Orchard Code']),
              values: filtered.map(d => parseFloat(d['Total_Acres_By_Variety_And_Orchard']) || 0),
              type: 'pie',
              textinfo: 'label',
              hoverinfo: 'label+percent+value',
              textposition: 'inside',
              automargin: true,
              hole: 0,
              marker: { line: { width: 0 } }
            }]}
            layout={{ width: 1200, height: 650, title: 'Total Yield by Field (Mt. Lbs.)' }}
            config={{ responsive: true }}
          />
          <button
            onClick={scrollToSecondPie}
            style={{
              position: 'absolute', bottom: '100px', right: '150px', padding: '10px 30px',
              backgroundColor: '#7CB342', color: 'white', border: 'none',
              borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer',
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)'
            }}>
            Scroll down
          </button>
        </div>

        <div ref={secondPieRef} style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Plot
            data={[{
              labels: filtered.map(d => d['Variety']),
              values: filtered.map(d => parseFloat(d['Total_Acres_By_Variety_And_Orchard']) || 0),
              type: 'pie',
              textinfo: 'label',
              hoverinfo: 'label+percent+value',
              textposition: 'inside',
              automargin: true,
              hole: 0,
              marker: { line: { width: 0 } }
            }]}
            layout={{ width: 1200, height: 650, title: 'Total Yield by Variety (Mt. Lbs.)' }}
            config={{ responsive: true }}
          />
          <button
            onClick={scrollToThirdChart}
            style={{
              position: 'absolute', bottom: '40px', right: '150px', padding: '10px 30px',
              backgroundColor: '#7CB342', color: 'white', border: 'none',
              borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer',
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)'
            }}>
            Scroll down
          </button>
        </div>

        <div ref={thirdChartRef} style={{ position: 'relative' }}>
          <Plot
            data={[
              {
                x: normData.varieties,
                y: normData.sumIncoming,
                type: 'bar',
                name: 'Sum of N_incoming',
                marker: { color: '#ADD8E6' }
              },
              {
                x: normData.varieties,
                y: normData.avgMtLbs,
                type: 'scatter',
                mode: 'lines+markers',
                name: 'Average of N_Mt Lbs',
                line: { color: '#FF69B4' }
              }
            ]}
            layout={{
              title: 'Sum of N_incoming vs Average of N_Mt Lbs by Variety',
              xaxis: { title: 'Variety' },
              yaxis: { title: 'Values' },
              height: 650,
              width: 1200,
              annotations: averageTurnout ? [
                {
                  xref: 'paper',
                  yref: 'paper',
                  x: 1.01,
                  y: 1.05,
                  text: `Turnout: ${averageTurnout}%`,
                  showarrow: false,
                  font: { size: 16, color: 'black', weight: 'bold' },
                  align: 'right'
                }
              ] : []
            }}
            config={{ responsive: true }}
          />
          <button
            onClick={scrollToTop}
            style={{
              position: 'absolute', bottom: '40px', right: '20px', padding: '10px 30px',
              backgroundColor: '#7CB342', color: 'white', border: 'none',
              borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer',
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)'
            }}>
            Scroll Top
          </button>
        </div>
      </div>
    </div>
  );
}

export default CropYieldChartPage;
