import React from 'react';
import Head from '@docusaurus/Head';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

export default function NotFound(): JSX.Element {
  const {siteConfig} = useDocusaurusContext();

  return (
    <>
      <Head>
        <title>SYSTEM HALTED | {siteConfig.title}</title>
      </Head>
      {/* NOTE: We are NOT using <Layout> here. 
         This removes the Navbar and Footer for a true "Crash" feel.
      */}
      <div className="panic-container">
        <div className="panic-overlay"></div>
        <div className="panic-content">
          <h1 className="panic-title">KERNEL_PANIC: PAGE_FAULT_IN_NONPAGED_AREA</h1>
          
          <div className="panic-console">
            <p>PID: 404 (http_worker)</p>
            <p>UID: 0 (root)</p>
            <p className="panic-trace">
              [ <span className="trace-time">0.000000</span> ] checked_url_path (vfs_lookup.c:120)<br/>
              [ <span className="trace-time">0.000214</span> ] <span className="text-danger">ERROR: MOUNT_POINT_NOT_FOUND</span><br/>
              [ <span className="trace-time">0.000420</span> ] Dumping physical memory to disk... 
            </p>
            <p>
              The requested resource could not be located in the VFS tree. 
              The link might be broken, or the node has been unlinked.
            </p>
          </div>

          <div className="panic-actions">
            <Link to="/" className="panic-btn reboot-btn">
              [ SYSTEM_REBOOT ]
            </Link>
            <button onClick={() => history.back()} className="panic-btn back-btn">
              [ ROLLBACK_TRANSACTION ]
            </button>
          </div>
          
          <div className="panic-footer">
            NUNIX_OS // KERNEL v3.0 // HALT CODE: 0x00000404
          </div>
        </div>
      </div>
    </>
  );
}