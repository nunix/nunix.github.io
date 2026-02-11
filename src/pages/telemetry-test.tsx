import React from 'react';
import Layout from '@theme/Layout';

export default function TelemetryTest() {
  return (
    <Layout title="Telemetry Debug" description="GoatCounter Iframe Test">
      <div style={{ padding: '50px', background: '#222', minHeight: '100vh', color: '#fff' }}>
        <h1>TELEMETRY UPLINK TEST</h1>
        <p>Testing direct embed of: <code>https://nunix.goatcounter.com</code></p>
        
        <div style={{ border: '2px solid red', height: '600px', width: '100%' }}>
          <iframe 
            src="https://nunix.goatcounter.com" 
            style={{ width: '100%', height: '100%', border: 'none' }}
            title="GoatCounter Debug"
          />
        </div>
        
        <div style={{ marginTop: '20px', padding: '10px', background: '#444' }}>
          <h3>DEBUG CHECKLIST:</h3>
          <ul>
            <li>If this box is <strong>BLANK (White/Grey)</strong>: The browser is blocking the connection (Refused to Connect).</li>
            <li>If you see <strong>"nunix.goatcounter.com refused to connect"</strong>: You need to add `nunix.dev` to the "Sites that can embed" setting.</li>
            <li>If you see the dashboard: The URL works, and we just need to resize it.</li>
          </ul>
        </div>
      </div>
    </Layout>
  );
}