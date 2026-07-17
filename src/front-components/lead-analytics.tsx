import React, { useEffect, useState } from 'react';
import { defineFrontComponent } from 'twenty-sdk/define';
import { LEAD_ANALYTICS_FRONT_COMPONENT_UNIVERSAL_IDENTIFIER } from '../constants/universal-identifiers';

const BRAND = {
  primary: '#001B2E',
  secondary: '#294C60',
  accent: '#FFC857',
  text: '#1F2937',
  bg: '#F9FAFB',
  white: '#FFFFFF',
  border: '#E5E7EB',
  green: '#10B981',
  blue: '#3B82F6',
  yellow: '#F59E0B',
  red: '#EF4444'
};

const FONTS = `
  @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@500;600;700&family=Barlow:wght@400;500;600&family=Roboto+Slab:wght@300;400;600&display=swap');
`;

const fetchTwenty = async (path: string, method = 'GET', body: any = null) => {
  try {
    const opts: any = {
      method,
      headers: { 
        'Authorization': `Bearer ${(window as any).TWENTY_ACCESS_TOKEN}`,
        'Content-Type': 'application/json'
      }
    };
    if (body) opts.body = JSON.stringify(body);
    
    const res = await fetch(`/rest/${path}`, opts);
    const json = await res.json();
    
    if (method !== 'GET') return json;

    const key = path.split('?')[0]; // Extract base path e.g. leads
    let items = json.data && json.data[key] ? json.data[key] : [];
    if (items && items.edges) {
      items = items.edges.map((e: any) => e.node);
    }
    return Array.isArray(items) ? items : (json.data?.edges?.map((e: any) => e.node) || json.data || []);
  } catch (error) {
    console.error('fetchTwenty Error:', error);
    return [];
  }
};

const StatCard = ({ title, value, icon, color }: any) => (
  <div style={{
    backgroundColor: BRAND.white,
    padding: '24px',
    borderRadius: '12px',
    border: `1px solid ${BRAND.border}`,
    boxShadow: '0 4px 6px rgba(0,0,0,0.02)',
    display: 'flex',
    alignItems: 'center',
    gap: '16px'
  }}>
    <div style={{
      width: '48px', height: '48px', borderRadius: '12px',
      backgroundColor: `${color}15`, color: color,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: '24px'
    }}>
      {icon}
    </div>
    <div>
      <div style={{ color: BRAND.secondary, fontSize: '13px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
        {title}
      </div>
      <div style={{ color: BRAND.primary, fontSize: '28px', fontWeight: 700, fontFamily: "'Barlow Condensed', sans-serif" }}>
        {value}
      </div>
    </div>
  </div>
);

const LeadAnalytics = () => {
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      const data = await fetchTwenty('leads?limit=500');
      setLeads(data);
      setLoading(false);
    };
    init();
  }, []);

  if (loading) return <div style={{ padding: '40px', fontFamily: "'Barlow', sans-serif" }}>Crunching Lead Data...</div>;

  const totalLeads = leads.length;
  const converted = leads.filter(l => l.convertedToOpportunityId).length;
  const conversionRate = totalLeads ? Math.round((converted / totalLeads) * 100) : 0;
  
  const sources = leads.reduce((acc, lead) => {
    const src = lead.source || 'UNKNOWN';
    acc[src] = (acc[src] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <>
      <style>{FONTS}</style>
      <div style={{ padding: '40px', fontFamily: "'Barlow', sans-serif", backgroundColor: BRAND.bg, minHeight: '100vh' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          
          <h1 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '36px', color: BRAND.primary, marginBottom: '8px' }}>
            Lead Conversion & Analytics
          </h1>
          <div style={{ color: BRAND.secondary, marginBottom: '32px' }}>
            Track marketing performance and BD conversion rates.
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px', marginBottom: '40px' }}>
            <StatCard title="Total Leads (All Time)" value={totalLeads} icon="📊" color={BRAND.blue} />
            <StatCard title="Converted to Opp" value={converted} icon="🎯" color={BRAND.green} />
            <StatCard title="Conversion Rate" value={`${conversionRate}%`} icon="🚀" color={BRAND.yellow} />
            <StatCard title="Active Follow-ups" value={leads.filter(l => l.followUpStatus && l.followUpStatus !== 'NONE').length} icon="📞" color={BRAND.red} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
            {/* Source Distribution */}
            <div style={{ backgroundColor: BRAND.white, padding: '24px', borderRadius: '12px', border: `1px solid ${BRAND.border}` }}>
              <h2 style={{ fontSize: '18px', color: BRAND.primary, marginTop: 0, marginBottom: '24px' }}>Lead Sources</h2>
              {Object.entries(sources).map(([src, count]) => (
                <div key={src as string} style={{ marginBottom: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '14px', fontWeight: 500 }}>
                    <span>{src}</span>
                    <span>{count as number}</span>
                  </div>
                  <div style={{ width: '100%', height: '8px', backgroundColor: BRAND.bg, borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ width: `${((count as number) / totalLeads) * 100}%`, height: '100%', backgroundColor: BRAND.blue, borderRadius: '4px' }} />
                  </div>
                </div>
              ))}
            </div>

            {/* Retention Notice */}
            <div style={{ backgroundColor: BRAND.white, padding: '24px', borderRadius: '12px', border: `1px solid ${BRAND.border}` }}>
              <h2 style={{ fontSize: '18px', color: BRAND.primary, marginTop: 0, marginBottom: '24px' }}>Data Retention Policy Active</h2>
              <div style={{ color: BRAND.text, lineHeight: '1.6' }}>
                <p>✅ <strong>All leads are permanently saved.</strong></p>
                <p>Even if a lead is marked as "Disqualified" or not immediately converted, it remains in the CRM database for future marketing drips and retargeting campaigns.</p>
                <p>✅ <strong>Automated Acknowledgments.</strong></p>
                <p>Use the "Send Ack" button on the Leads Dashboard to manually fire acknowledgment templates to newly ingested manual leads.</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </>
  );
};

export default defineFrontComponent({
  universalIdentifier: LEAD_ANALYTICS_FRONT_COMPONENT_UNIVERSAL_IDENTIFIER,
  name: 'Lead Analytics',
  description: 'Analytics for Lead Conversion',
  component: LeadAnalytics,
});
