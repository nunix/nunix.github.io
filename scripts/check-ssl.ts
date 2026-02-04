import * as tls from 'node:tls';
import { join } from 'node:path';

const DOMAIN = 'nunix.dev';
const REPO = 'nunix/nunix.github.io';

const fetchGitData = async () => {
  try {
    const response = await fetch(`https://api.github.com/repos/${REPO}/commits/main`);
    const data: any = await response.json();
    // Fetch the date and format it to YYYY.MM.DD
    const commitDate = new Date(data.commit.committer.date)
      .toISOString()
      .split('T')[0]
      .replace(/-/g, '.');
    return commitDate;
  } catch {
    return 'UNKNOWN';
  }
};

const checkSSL = () => {
  return new Promise((resolve, reject) => {
    const socket = tls.connect({
      host: DOMAIN,
      port: 443,
      servername: DOMAIN,
    }, () => {
      const cert = socket.getPeerCertificate();
      if (!cert || !cert.valid_to) {
        socket.end();
        return reject('No certificate');
      }
      const expiry = new Date(cert.valid_to);
      const data = {
        is_secure: new Date() < expiry,
        expiry_date: expiry.toISOString().split('T')[0],
      };
      socket.end();
      resolve(data);
    });
    socket.on('error', (err) => reject(err));
  });
};

// --- Main Execution ---
try {
  const sslData: any = await checkSSL(); // Variable is defined as sslData
  const gitDate = await fetchGitData();

  const finalData = {
    ...sslData,           // Corrected: was sslStatus
    last_updated: gitDate, 
    last_sync: new Date().toISOString(),
  };

  await Bun.write(
    join(import.meta.dir, '../static/ssl-info.json'), 
    JSON.stringify(finalData, null, 2)
  );
  
  console.log(`[SYS_LOG]: Sync successful for ${DOMAIN}. Last update: ${gitDate}`);
} catch (error) {
  console.error('[SYS_ERROR]: Sync failed:', error);
  process.exit(1);
}