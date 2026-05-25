import React from 'react';
import Layout from '@theme/Layout';
import CosmicMap from '@site/src/components/CosmicMap';
import styles from './cosmos.module.css';

export default function CosmosPage() {
  return (
    <Layout
      title="AIverse Cosmic Map"
      description="A living map of the AIverse — eras, missions, and chronicles across the fleet's history."
    >
      <div style={{ paddingTop: '2.5rem', paddingBottom: '3rem', paddingLeft: '1rem', paddingRight: '1rem' }}>
        <div className={styles.header}>
          <p className={styles.label}>AIVERSE — COSMIC CARTOGRAPHY</p>
          <h1 className={styles.title}>The Known Universe</h1>
          <p className={styles.sub}>
            Six eras. Sixty missions. One fleet, growing in the dark.
            <br />
            Click an era to explore its chronicles.
          </p>
        </div>
        <CosmicMap />
        <p className={styles.punchline}>In AIverse, there is only Knowledge.</p>
      </div>
    </Layout>
  );
}
