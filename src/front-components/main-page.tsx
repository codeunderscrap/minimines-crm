import { defineFrontComponent } from 'twenty-sdk/define';
import React, { useState } from 'react';

import {
  APP_DISPLAY_NAME,
  MAIN_PAGE_FRONT_COMPONENT_UNIVERSAL_IDENTIFIER,
} from '../constants/universal-identifiers';

const BRAND = {
  primary: '#001B2E',
  secondary: '#54595F',
  text: '#7A7A7A',
  accent: '#3B6E93',
  lightAccent: '#4C9EAF',
  white: '#FFFFFF',
  border: '#EAEAEA',
  bg: '#F9F9F9',
};

const FONTS = `
  @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@600&family=Barlow:wght@400;500;600&family=Roboto+Slab:wght@400;500&display=swap');

  .minimines-dashboard {
    font-family: 'Barlow', sans-serif;
    color: ${BRAND.text};
    background-color: ${BRAND.bg};
    min-height: 100vh;
    padding: 40px;
    box-sizing: border-box;
  }

  .h1, .h2, .h3 {
    font-family: 'Barlow Condensed', sans-serif;
    text-transform: uppercase;
    font-weight: 600;
    margin: 0;
  }

  .h1 { font-size: 32px; color: ${BRAND.primary}; margin-bottom: 8px; }
  .h2 { font-size: 24px; color: ${BRAND.primary}; margin-bottom: 24px; }
  .h3 { font-size: 18px; color: ${BRAND.secondary}; }

  .subtitle {
    font-family: 'Roboto Slab', serif;
    font-size: 16px;
    color: ${BRAND.text};
    font-weight: 400;
  }

  .card {
    background: ${BRAND.white};
    border: 1px solid ${BRAND.border};
    padding: 24px;
    display: flex;
    flex-direction: column;
    transition: border-color 0.2s;
  }
  
  .card:hover {
    border-color: ${BRAND.accent};
  }

  .stat-value {
    font-family: 'Barlow', sans-serif;
    font-size: 36px;
    font-weight: 600;
    color: ${BRAND.primary};
    margin-top: 12px;
  }

  .stat-label {
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 16px;
    font-weight: 600;
    text-transform: uppercase;
    color: ${BRAND.accent};
    letter-spacing: 0.5px;
  }

  .stat-sub {
    font-family: 'Roboto Slab', serif;
    font-size: 12px;
    color: ${BRAND.text};
    margin-top: 8px;
  }

  .data-table {
    width: 100%;
    border-collapse: collapse;
  }

  .data-table th, .data-table td {
    padding: 12px 16px;
    text-align: left;
    border-bottom: 1px solid ${BRAND.border};
  }

  .data-table th {
    font-family: 'Barlow Condensed', sans-serif;
    font-weight: 600;
    text-transform: uppercase;
    font-size: 14px;
    color: ${BRAND.secondary};
    background-color: ${BRAND.bg};
  }

  .data-table td {
    font-size: 14px;
    color: ${BRAND.primary};
    font-weight: 500;
  }

  .data-table tr:last-child td {
    border-bottom: none;
  }

  .status-badge {
    display: inline-block;
    padding: 4px 8px;
    font-size: 12px;
    font-weight: 600;
    font-family: 'Barlow', sans-serif;
    background: ${BRAND.bg};
    color: ${BRAND.accent};
    border: 1px solid ${BRAND.accent};
  }
  
  .btn {
    display: inline-block;
    background: ${BRAND.primary};
    color: ${BRAND.white};
    font-family: 'Barlow Condensed', sans-serif;
    text-transform: uppercase;
    font-weight: 600;
    font-size: 16px;
    padding: 12px 24px;
    border: none;
    cursor: pointer;
    text-decoration: none;
    transition: background 0.2s;
  }
  
  .btn:hover {
    background: ${BRAND.accent};
  }
  
  .btn-outline {
    background: transparent;
    color: ${BRAND.primary};
    border: 2px solid ${BRAND.primary};
  }
  
  .btn-outline:hover {
    background: ${BRAND.bg};
  }
`;

const StatCard = ({ label, value, sub }: any) => (
  <div className="card">
    <div className="stat-label">{label}</div>
    <div className="stat-value">{value}</div>
    <div className="stat-sub">{sub}</div>
  </div>
);

const ActivityTable = () => (
  <div className="card" style={{ padding: 0 }}>
    <table className="data-table">
      <thead>
        <tr>
          <th>Reference ID</th>
          <th>Type</th>
          <th>Client / Details</th>
          <th>Status</th>
          <th>Date</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>SO-2024-142</td>
          <td>Sales Order</td>
          <td>Aluminium Billets 500MT</td>
          <td><span className="status-badge" style={{ borderColor: BRAND.secondary, color: BRAND.secondary }}>PENDING</span></td>
          <td style={{ color: BRAND.text }}>Today</td>
        </tr>
        <tr>
          <td>EXP-2024-089</td>
          <td>Export Shipment</td>
          <td>Rotterdam Port</td>
          <td><span className="status-badge">IN TRANSIT</span></td>
          <td style={{ color: BRAND.text }}>Yesterday</td>
        </tr>
        <tr>
          <td>CTR-2024-004</td>
          <td>Contract</td>
          <td>Annual Supply - TechCorp</td>
          <td><span className="status-badge">ACTIVE</span></td>
          <td style={{ color: BRAND.text }}>Oct 12</td>
        </tr>
      </tbody>
    </table>
  </div>
);

const MainPage = () => {
  return (
    <>
      <style>{FONTS}</style>
      <div className="minimines-dashboard">
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '40px', borderBottom: `2px solid ${BRAND.primary}`, paddingBottom: '24px' }}>
            <div>
              <h1 className="h1">MiniMines BD CRM</h1>
              <div className="subtitle">Corporate Command Center</div>
            </div>
            <div style={{ display: 'flex', gap: '16px' }}>
              <a href="/objects/contracts" className="btn btn-outline">Contracts</a>
              <a href="/objects/salesOrders" className="btn btn-outline">Sales Orders</a>
              <a href="/objects/exportShipments" className="btn btn-outline">Shipments</a>
              <a href="/objects/lMETrackers" className="btn btn-outline">LME Tracker</a>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px', marginBottom: '40px' }}>
            <StatCard label="Active Contracts" value="24" sub="4 awaiting renewal" />
            <StatCard label="LME Aluminium" value="$2,450.50" sub="Last update: 14:00 GMT" />
            <StatCard label="Pending Orders" value="14" sub="Requires fulfillment" />
            <StatCard label="Active Shipments" value="8" sub="In transit / Customs" />
          </div>

          <div style={{ marginBottom: '40px' }}>
             <div style={{
                fontFamily: "'Barlow', sans-serif",
                backgroundColor: '#FFFFFF',
                border: '1px solid #EAEAEA',
                padding: '24px',
                width: '100%',
                boxSizing: 'border-box'
              }}>
                <div style={{ marginBottom: '24px', borderBottom: '2px solid #001B2E', paddingBottom: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h2 className="h2" style={{ marginBottom: '4px' }}>LME Market Watch</h2>
                    <p className="subtitle" style={{ margin: 0, fontSize: '14px' }}>Live Data Feed • London Metal Exchange</p>
                  </div>
                  <div style={{ backgroundColor: '#04AED1', color: '#FFFFFF', padding: '6px 12px', fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase' }}>Live</div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px' }}>
                  {[
                    { id: 1, metal: 'Aluminium', date: 'Jul 11, 2026', rateUSD: 2450.50, trend: '+1.2%' },
                    { id: 2, metal: 'Copper', date: 'Jul 11, 2026', rateUSD: 9840.00, trend: '-0.5%' },
                    { id: 3, metal: 'Iron', date: 'Jul 11, 2026', rateUSD: 105.20, trend: '+2.1%' }
                  ].map(rate => (
                    <div key={rate.id} style={{ border: '1px solid #54595F', padding: '16px', backgroundColor: '#FAFAFA' }}>
                      <div style={{ fontSize: '12px', color: '#7A7A7A', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '1px' }}>{rate.date}</div>
                      <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '24px', color: '#001B2E', marginBottom: '4px' }}>{rate.metal}</div>
                      <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px', marginBottom: '4px' }}>
                        <span style={{ fontSize: '28px', fontWeight: 'bold', color: '#001B2E' }}>${rate.rateUSD.toLocaleString('en-US', {minimumFractionDigits: 2})}</span>
                        <span style={{ fontSize: '14px', fontWeight: 'bold', color: rate.trend.startsWith('+') ? '#04AED1' : '#54595F' }}>{rate.trend}</span>
                      </div>
                      <div style={{ fontSize: '14px', color: '#54595F', fontWeight: 500 }}>
                        ≈ ₹{(rate.rateUSD * 83.5).toLocaleString('en-IN', {maximumFractionDigits: 0})} INR
                      </div>
                    </div>
                  ))}
                </div>
              </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
            <div>
              <h2 className="h2">Recent Operations</h2>
              <ActivityTable />
            </div>
            
            <div>
              <h2 className="h2">System Links</h2>
              <div className="card" style={{ gap: '16px' }}>
                <a href="/objects/contracts" style={{ color: BRAND.primary, textDecoration: 'none', fontWeight: 500 }}>&rarr; Manage Contracts</a>
                <a href="/objects/salesOrders" style={{ color: BRAND.primary, textDecoration: 'none', fontWeight: 500 }}>&rarr; Manage Sales Orders</a>
                <a href="/objects/exportShipments" style={{ color: BRAND.primary, textDecoration: 'none', fontWeight: 500 }}>&rarr; Manage Export Shipments</a>
                <a href="/objects/lMETrackers" style={{ color: BRAND.primary, textDecoration: 'none', fontWeight: 500 }}>&rarr; LME Price Feeds</a>
                
                <div style={{ marginTop: '24px', paddingTop: '24px', borderTop: `1px solid ${BRAND.border}` }}>
                  <div className="stat-label" style={{ marginBottom: '8px' }}>Module Status</div>
                  <div style={{ fontSize: '14px', color: BRAND.text }}>All custom business development modules are active and synced.</div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </>
  );
};

export default defineFrontComponent({
  universalIdentifier: MAIN_PAGE_FRONT_COMPONENT_UNIVERSAL_IDENTIFIER,
  name: APP_DISPLAY_NAME,
  description: 'MiniMines Custom CRM Dashboard',
  component: MainPage,
});
