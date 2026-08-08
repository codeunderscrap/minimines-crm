import { defineFrontComponent } from 'twenty-sdk/define';
import React, { useState, useEffect } from 'react';
import { COMPANY_DASHBOARD_FRONT_COMPONENT_UNIVERSAL_IDENTIFIER } from '../constants/universal-identifiers';

const BRAND = {
  primary: '#001B2E',
  secondary: '#54595F',
  text: '#7A7A7A',
  accent: '#3B6E93',
  lightAccent: '#4C9EAF',
  white: '#FFFFFF',
  border: '#EAEAEA',
  bg: '#F9F9F9',
  green: '#10b981',
  yellow: '#f59e0b',
  red: '#ef4444',
  blue: '#3b82f6',
};

const FONTS = `
  @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@600&family=Barlow:wght@400;500;600&display=swap');
  .minimines-company-dashboard {
    font-family: 'Barlow', sans-serif;
    color: ${BRAND.text};
    background-color: ${BRAND.bg};
    min-height: 100vh;
    display: flex;
    box-sizing: border-box;
  }
`;

const API_URL = 'https://minimines.twenty.com/rest';
const API_HEADERS = {
  Authorization: 'Bearer eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IjA5OTdlNjcwLWJmYTEtNGMxZS1hZWQzLTc1M2JjNjQ4ZDY1MSJ9.eyJzdWIiOiJlYzFlMDcwZi0yZmE0LTQ3MjMtYmVmMy0xYmY5NGFlNTg4ZDEiLCJ0eXBlIjoiQVBJX0tFWSIsIndvcmtzcGFjZUlkIjoiZWMxZTA3MGYtMmZhNC00NzIzLWJlZjMtMWJmOTRhZTU4OGQxIiwiaWF0IjoxNzg2MTAxMzgzLCJleHAiOjQ5Mzk3MDEzODIsImp0aSI6IjhjZmY3MGFlLTgzZmItNDQ4NS05YjI0LWFlNjczYzQzZmE0NSJ9.Wg93DjZtbUC8-a1I2IoVSMixlv4TIdA4ayjXG6C8Zm258IW6nQbEIyX7t3R9hdGeMfy6ssbplJRP2vWHBW6Odg',
  'Content-Type': 'application/json',
};

const fetchApi = async (path: string) => {
  try {
    const res = await fetch(`${API_URL}/${path}`, { headers: API_HEADERS });
    const json = await res.json();
    const key = path.split('?')[0];
    let items = json?.data?.[key] ?? json?.data ?? [];
    if (items?.edges) items = items.edges.map((e: any) => e.node);
    return Array.isArray(items) ? items : [];
  } catch (err) {
    console.error('API error:', err);
    return [];
  }
};

const relationId = (record: any, name: string): string | null => {
  const nested = record?.[name];
  if (nested && typeof nested === 'object' && nested.id) return nested.id;
  if (typeof nested === 'string') return nested;
  return record?.[`${name}Id`] ?? null;
};

const CompanyDashboard = () => {
  const [companies, setCompanies] = useState<any[]>([]);
  const [selectedCompanyId, setSelectedCompanyId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    contracts: [],
    opportunities: [],
    quotations: [],
    leads: [],
    shipments: []
  });

  useEffect(() => {
    fetchApi('companies').then(res => {
      setCompanies(res);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    if (!selectedCompanyId) return;
    const fetchCompanyData = async () => {
      // Assuming our custom fields are now relationships named "company" which maps to "companyId" in rest API
      const filter = `?filter[companyId][eq]=${selectedCompanyId}`;
      
      const [contracts, opportunities, quotations, leads, shipments] = await Promise.all([
        fetchApi(`contracts${filter}`),
        fetchApi(`opportunities${filter}`),
        fetchApi(`quotations${filter}`),
        fetchApi(`leads${filter}`),
        fetchApi(`exportShipments${filter}`)
      ]);

      setData({ contracts, opportunities, quotations, leads, shipments });
    };
    fetchCompanyData();
  }, [selectedCompanyId]);

  const selectedCompany = companies.find(c => c.id === selectedCompanyId);

  return (
    <>
      <style>{FONTS}</style>
      <div className="minimines-company-dashboard">
        
        {/* Left Panel: Company Directory */}
        <div style={{ width: '300px', borderRight: `1px solid ${BRAND.border}`, backgroundColor: BRAND.white, display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '20px', borderBottom: `1px solid ${BRAND.border}`, backgroundColor: BRAND.primary }}>
            <h2 style={{ margin: 0, color: BRAND.white, fontSize: '18px', fontFamily: "'Barlow Condensed', sans-serif", letterSpacing: '0.5px' }}>
              COMPANY DIRECTORY
            </h2>
          </div>
          <div style={{ flex: 1, overflowY: 'auto' }}>
            {loading ? (
              <div style={{ padding: '20px', textAlign: 'center', color: BRAND.text }}>Loading companies...</div>
            ) : companies.length === 0 ? (
              <div style={{ padding: '20px', textAlign: 'center', color: BRAND.text }}>No companies found. Add one in the Companies tab.</div>
            ) : (
              companies.map(company => (
                <div 
                  key={company.id}
                  onClick={() => setSelectedCompanyId(company.id)}
                  style={{
                    padding: '15px 20px',
                    borderBottom: `1px solid ${BRAND.border}`,
                    cursor: 'pointer',
                    backgroundColor: selectedCompanyId === company.id ? BRAND.bg : BRAND.white,
                    borderLeft: selectedCompanyId === company.id ? `4px solid ${BRAND.accent}` : '4px solid transparent',
                    transition: 'all 0.2s'
                  }}
                >
                  <div style={{ fontWeight: 600, color: BRAND.primary, fontSize: '14px' }}>{company.name || 'Unnamed Company'}</div>
                  <div style={{ fontSize: '12px', color: BRAND.text, marginTop: '4px' }}>
                    {company.domainName?.primaryLinkUrl || company.domainName?.primaryLinkLabel || 'No Domain'}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Panel: Master Profile */}
        <div style={{ flex: 1, padding: '40px', overflowY: 'auto' }}>
          {!selectedCompany ? (
            <div style={{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center', color: BRAND.text, fontSize: '16px' }}>
              Select a company from the directory to view its master profile.
            </div>
          ) : (
            <div style={{ maxWidth: '900px', margin: '0 auto' }}>
              
              {/* Header */}
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '40px', paddingBottom: '20px', borderBottom: `2px solid ${BRAND.border}` }}>
                <div style={{ width: '60px', height: '60px', borderRadius: '8px', backgroundColor: BRAND.primary, color: BRAND.white, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', fontWeight: 'bold', marginRight: '20px' }}>
                  {selectedCompany.name ? selectedCompany.name.charAt(0).toUpperCase() : 'C'}
                </div>
                <div>
                  <h1 style={{ margin: 0, color: BRAND.primary, fontSize: '28px', fontFamily: "'Barlow Condensed', sans-serif" }}>
                    {selectedCompany.name}
                  </h1>
                  <div style={{ display: 'flex', gap: '15px', marginTop: '8px', fontSize: '14px', color: BRAND.secondary }}>
                    <span>{selectedCompany.domainName?.primaryLinkUrl || selectedCompany.domainName?.primaryLinkLabel || 'No Website'}</span>
                    <span>•</span>
                    <span>{selectedCompany.address?.address1 || selectedCompany.address?.city || 'No Address'}</span>
                  </div>
                </div>
              </div>

              {/* Data Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '25px' }}>
                
                {/* Contracts Card */}
                <div style={{ backgroundColor: BRAND.white, padding: '25px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', border: `1px solid ${BRAND.border}` }}>
                  <div style={{ fontSize: '16px', fontWeight: 600, color: BRAND.primary, marginBottom: '15px', display: 'flex', justifyContent: 'space-between' }}>
                    <span>Active Contracts</span>
                    <span style={{ backgroundColor: BRAND.bg, padding: '2px 8px', borderRadius: '12px', fontSize: '12px' }}>{data.contracts.length}</span>
                  </div>
                  {data.contracts.length === 0 ? (
                    <div style={{ fontSize: '13px', color: BRAND.text }}>No contracts found.</div>
                  ) : (
                    data.contracts.map((c: any, i) => (
                      <div key={i} style={{ padding: '10px 0', borderBottom: i < data.contracts.length - 1 ? `1px solid ${BRAND.border}` : 'none' }}>
                        <div style={{ fontSize: '14px', color: BRAND.primary, fontWeight: 500 }}>{c.name || 'Unnamed Contract'}</div>
                        <div style={{ fontSize: '12px', color: BRAND.secondary, marginTop: '4px' }}>Total Quantity: {c.totalQuantity || 0} MT</div>
                      </div>
                    ))
                  )}
                </div>

                {/* Opportunities Card */}
                <div style={{ backgroundColor: BRAND.white, padding: '25px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', border: `1px solid ${BRAND.border}` }}>
                  <div style={{ fontSize: '16px', fontWeight: 600, color: BRAND.primary, marginBottom: '15px', display: 'flex', justifyContent: 'space-between' }}>
                    <span>Open Opportunities</span>
                    <span style={{ backgroundColor: BRAND.bg, padding: '2px 8px', borderRadius: '12px', fontSize: '12px' }}>{data.opportunities.length}</span>
                  </div>
                  {data.opportunities.length === 0 ? (
                    <div style={{ fontSize: '13px', color: BRAND.text }}>No open opportunities.</div>
                  ) : (
                    data.opportunities.map((o: any, i) => (
                      <div key={i} style={{ padding: '10px 0', borderBottom: i < data.opportunities.length - 1 ? `1px solid ${BRAND.border}` : 'none' }}>
                        <div style={{ fontSize: '14px', color: BRAND.primary, fontWeight: 500 }}>{o.name || 'Unnamed Opp'}</div>
                        <div style={{ fontSize: '12px', color: BRAND.green, marginTop: '4px', fontWeight: 600 }}>{o.stage || 'NEW'}</div>
                      </div>
                    ))
                  )}
                </div>

                {/* Leads Card */}
                <div style={{ backgroundColor: BRAND.white, padding: '25px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', border: `1px solid ${BRAND.border}` }}>
                  <div style={{ fontSize: '16px', fontWeight: 600, color: BRAND.primary, marginBottom: '15px', display: 'flex', justifyContent: 'space-between' }}>
                    <span>Associated Leads</span>
                    <span style={{ backgroundColor: BRAND.bg, padding: '2px 8px', borderRadius: '12px', fontSize: '12px' }}>{data.leads.length}</span>
                  </div>
                  {data.leads.length === 0 ? (
                    <div style={{ fontSize: '13px', color: BRAND.text }}>No leads recorded.</div>
                  ) : (
                    data.leads.map((l: any, i) => (
                      <div key={i} style={{ padding: '10px 0', borderBottom: i < data.leads.length - 1 ? `1px solid ${BRAND.border}` : 'none' }}>
                        <div style={{ fontSize: '14px', color: BRAND.primary, fontWeight: 500 }}>{l.name || 'Unnamed Lead'}</div>
                        <div style={{ fontSize: '12px', color: BRAND.secondary, marginTop: '4px' }}>Source: {l.source || 'Unknown'}</div>
                      </div>
                    ))
                  )}
                </div>

                {/* Shipments Card */}
                <div style={{ backgroundColor: BRAND.white, padding: '25px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', border: `1px solid ${BRAND.border}` }}>
                  <div style={{ fontSize: '16px', fontWeight: 600, color: BRAND.primary, marginBottom: '15px', display: 'flex', justifyContent: 'space-between' }}>
                    <span>Logistics & Shipments</span>
                    <span style={{ backgroundColor: BRAND.bg, padding: '2px 8px', borderRadius: '12px', fontSize: '12px' }}>{data.shipments.length}</span>
                  </div>
                  {data.shipments.length === 0 ? (
                    <div style={{ fontSize: '13px', color: BRAND.text }}>No shipments recorded.</div>
                  ) : (
                    data.shipments.map((s: any, i) => (
                      <div key={i} style={{ padding: '10px 0', borderBottom: i < data.shipments.length - 1 ? `1px solid ${BRAND.border}` : 'none' }}>
                        <div style={{ fontSize: '14px', color: BRAND.primary, fontWeight: 500 }}>{s.invoiceNumber || 'No Invoice'}</div>
                        <div style={{ fontSize: '12px', color: BRAND.secondary, marginTop: '4px' }}>Port: {s.destinationPort || 'Unknown'}</div>
                      </div>
                    ))
                  )}
                </div>

              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default defineFrontComponent({
  universalIdentifier: COMPANY_DASHBOARD_FRONT_COMPONENT_UNIVERSAL_IDENTIFIER,
  name: 'Company Dashboard',
  component: CompanyDashboard,
});
