import { defineFrontComponent } from 'twenty-sdk/define';
import React, { useState, useEffect } from 'react';
import { useRecordId } from 'twenty-sdk/front-component';

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
    border-radius: 8px;
    padding: 28px;
    display: flex;
    flex-direction: column;
    box-shadow: 0 4px 12px rgba(0, 27, 46, 0.04);
    transition: transform 0.2s, box-shadow 0.2s;
  }
  
  .card:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(0, 27, 46, 0.08);
  }

  .stat-value {
    font-family: 'Barlow', sans-serif;
    font-size: 28px;
    font-weight: 600;
    color: ${BRAND.primary};
    margin-top: 8px;
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
    font-size: 15px;
    letter-spacing: 0.5px;
    padding: 10px 20px;
    border-radius: 6px;
    border: none;
    cursor: pointer;
    text-decoration: none;
    transition: background 0.2s, transform 0.1s;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  }
  
  .btn:hover {
    background: ${BRAND.accent};
    transform: translateY(-1px);
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

const StatCard = ({ label, value, sub, link }: any) => {
  const content = (
    <div className="card" style={{ padding: '20px' }}>
      <div className="stat-label">{label}</div>
      <div className="stat-value">{value}</div>
      <div className="stat-sub">{sub}</div>
    </div>
  );
  
  if (link) {
    return <a href={link} style={{ textDecoration: 'none', color: 'inherit' }}>{content}</a>;
  }
  return content;
};

const fetchTwenty = async (path: string, method = 'GET', body: any = null) => {
  const url = `https://api.twenty.com/rest/${path}`;
  const apiKey = 'Bearer eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IjA5OTdlNjcwLWJmYTEtNGMxZS1hZWQzLTc1M2JjNjQ4ZDY1MSJ9.eyJzdWIiOiJlYzFlMDcwZi0yZmE0LTQ3MjMtYmVmMy0xYmY5NGFlNTg4ZDEiLCJ0eXBlIjoiQVBJX0tFWSIsIndvcmtzcGFjZUlkIjoiZWMxZTA3MGYtMmZhNC00NzIzLWJlZjMtMWJmOTRhZTU4OGQxIiwiaWF0IjoxNzg2MTAxMzgzLCJleHAiOjQ5Mzk3MDEzODIsImp0aSI6IjhjZmY3MGFlLTgzZmItNDQ4NS05YjI0LWFlNjczYzQzZmE0NSJ9.Wg93DjZtbUC8-a1I2IoVSMixlv4TIdA4ayjXG6C8Zm258IW6nQbEIyX7t3R9hdGeMfy6ssbplJRP2vWHBW6Odg';
  
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px', marginBottom: '40px' }}>
            <StatCard label="Active Contracts" value={activeContracts.toString()} sub="Total Active" link="/objects/contracts" />
            <StatCard label="Active Shipments" value={data.exportShipments.length.toString()} sub="Total shipments recorded" link="/objects/exportShipments" />
            <StatCard label="Open Opportunities" value={openOpportunities.toString()} sub="In Pipeline" link={pageLinks[OPPORTUNITY_PAGE_UID] || '/objects/opportunities'} />
            <StatCard label="Total Leads" value={totalLeadsCount.toString()} sub="New Prospects" link={pageLinks[LEADS_PAGE_UID] || '/objects/leads'} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '40px', alignItems: 'stretch' }}>
             <ContractTracker contracts={data.contracts} />
             <ShipmentTracker shipments={data.exportShipments} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
            <div>
              <h2 className="h2">Incoming Enquiries</h2>
              <EnquiryQuickReply />
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


// cache-bust: 1786104341234
// cache-bust: 1786125236.73224
