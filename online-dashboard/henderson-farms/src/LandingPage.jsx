import React from 'react';
import { useNavigate } from 'react-router-dom';
import almondFarm from './almond_farm.png';

function LandingPage() {
  const navigate = useNavigate();

  const shinyButtonStyle = (startColor, endColor) => ({
    width: '200px',
    height: '60px',
    fontSize: '1.2rem',
    borderRadius: '30px',
    background: `linear-gradient(to bottom right, ${startColor}, ${endColor})`,
    border: 'none',
    color: 'white',
    fontWeight: 'bold',
    cursor: 'pointer',
    position: 'relative',
    overflow: 'hidden',
    boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
  });

  const overlayStyle = {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background: 'linear-gradient(to top left, rgba(255,255,255,0.4), rgba(255,255,255,0))',
    borderRadius: '30px',
    filter: 'blur(0.5px)',
    pointerEvents: 'none'
  };

  return (
    <div style={{
      backgroundImage: `url(${almondFarm})`,
      backgroundRepeat: 'no-repeat',
      backgroundSize: 'cover',
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center'
    }}>
      <h1 style={{ color: 'white', fontSize: '4rem', textShadow: '2px 2px 8px rgba(0,0,0,0.7)' }}>
        Henderson Farms
      </h1>
      <h2 style={{ color: 'white', fontSize: '2.2rem', textShadow: '1px 1px 5px rgba(0,0,0,0.6)', marginTop: '-10px' }}>
        SCU Practicum 2025
      </h2>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginTop: '30px' }}>
        <div style={{ display: 'flex', gap: '30px', justifyContent: 'center' }}>
          <div style={{ position: 'relative' }}>
            <button onClick={() => navigate('/crop-yield')} style={shinyButtonStyle('#1fa2ff', '#12d8fa')}>
              Crop Yield
            </button>
            <div style={overlayStyle}></div>
          </div>
          <div style={{ position: 'relative' }}>
            <button onClick={() => navigate('/finance')} style={shinyButtonStyle('#ff416c', '#ff4b2b')}>
              Finance
            </button>
            <div style={overlayStyle}></div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '30px', justifyContent: 'center' }}>
          <div style={{ position: 'relative' }}>
            <button onClick={() => navigate('/fertilizer-finance')} style={shinyButtonStyle('#00b09b', '#96c93d')}>
              Fertilizer
            </button>
            <div style={overlayStyle}></div>
          </div>
          <div style={{ position: 'relative' }}>
            <button onClick={() => navigate('/chart')} style={shinyButtonStyle('#f7971e', '#ffd200')}>
              Leaf Nutrient
            </button>
            <div style={overlayStyle}></div>
          </div>
          <div style={{ position: 'relative' }}>
            <button onClick={() => navigate('/soil')} style={shinyButtonStyle('#ff9a9e', '#fad0c4')}>
              Soil Nutrient
            </button>
            <div style={overlayStyle}></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;
