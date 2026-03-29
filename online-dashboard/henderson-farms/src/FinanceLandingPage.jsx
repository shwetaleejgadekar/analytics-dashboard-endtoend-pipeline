import React from 'react';
import { useNavigate } from 'react-router-dom';
import treeBg from './tree_bg.png';

function FinanceLandingPage() {
  const navigate = useNavigate();

  const buttonStyle = {
    padding: '15px 40px',
    fontSize: '1.2rem',
    borderRadius: '30px',
    background: 'linear-gradient(to right, #4CAF50, #81C784)',
    color: 'white',
    fontWeight: 'bold',
    border: 'none',
    cursor: 'pointer',
    boxShadow: '0 4px 10px rgba(0,0,0,0.3)'
  };

  return (
    <div style={{
      backgroundImage: `url(${treeBg})`,
      backgroundRepeat: 'no-repeat',
      backgroundSize: 'cover',
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      position: 'relative'
    }}>
      <button onClick={() => navigate('/')} style={{
        position: 'absolute', top: '20px', right: '20px',
        padding: '10px 20px', backgroundColor: '#7CB342', color: 'white',
        border: 'none', borderRadius: '25px', fontWeight: 'bold',
        cursor: 'pointer', boxShadow: '0 4px 10px rgba(0,0,0,0.3)'
      }}>Back</button>

      <h1 style={{ color: 'black', fontSize: '3rem', marginBottom: '30px' }}>Finance Data</h1>
      <div style={{ display: 'flex', gap: '40px', flexWrap: 'wrap' }}>
        <button style={buttonStyle} onClick={() => navigate('/pnl-data')}>P & L Finance</button>
        <button style={buttonStyle} onClick={() => navigate('/finance-pie')}>Category Breakdown</button>
      </div>
    </div>
  );
}

export default FinanceLandingPage;
