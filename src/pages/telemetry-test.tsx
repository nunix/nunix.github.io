import React from 'react';
import Layout from '@theme/Layout';

export default function Telemetry() {
  const GOAT_USER = 'nunix';

  return (
    <Layout title="Network Intelligence" description="System Telemetry Uplink">
      <div className="container" style={{ paddingTop: '4rem', paddingBottom: '4rem', minHeight: '100vh' }}>
        
        {/* Header */}
        <div style={{ marginBottom: '20px', fontFamily: 'var(--vintage-mono)', color: 'var(--ifm-color-primary)' }}>
          <h1 style={{ fontSize: '1.5rem', borderBottom: '1px solid var(--ifm-color-primary)', display: 'inline-block', paddingRight: '20px' }}>
            // NETWORK_INTELLIGENCE
          </h1>
          <p style={{ opacity: 0.7, fontSize: '0.8rem' }}>
            UPLINK_STATUS: <span style={{ color: 'var(--neon-blue)', fontWeight: 'bold' }}>ACTIVE</span> :: SOURCE: GOATCOUNTER_RELAY
          </p>
        </div>

        {/* The Dashboard Frame */}
        <div style={{
          border: '1px solid var(--ifm-color-primary)',
          borderRadius: '4px',
          overflow: 'hidden',
          background: '#fff', // Base for the iframe
          height: '85vh',
          boxShadow: '0 0 30px rgba(0,0,0,0.3)',
          position: 'relative'
        }}>
           <iframe
            src={`https://${GOAT_USER}.goatcounter.com`}
            style={{ 
              width: '100%', 
              height: '100%', 
              border: 'none',
              // DARK MODE HACK: Inverts colors to make the white dashboard dark
              // Hue rotate fixes the colors (so green stays green instead of turning purple)
              filter: 'invert(1) hue-rotate(180deg)' 
            }}
            title="Global Telemetry"
            loading="lazy"
          />
        </div>

        {/* Footer Note */}
        <div style={{ marginTop: '10px', textAlign: 'right', fontSize: '0.7rem', fontFamily: 'var(--vintage-mono)', opacity: 0.5 }}>
          SECURE_CONNECTION // END_OF_LINE
        </div>

      </div>
    </Layout>
  );
}