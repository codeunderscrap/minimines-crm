import React, { useState, useEffect } from 'react';
import { defineFrontComponent } from 'twenty-sdk/define';
import { LEAD_ANALYTICS_FRONT_COMPONENT_UNIVERSAL_IDENTIFIER } from '../constants/universal-identifiers';

const BRAND = {
  primary: '#001B2E',
  secondary: '#54595F',
  text: '#7A7A7A',
  accent: '#3B6E93',
  lightAccent: '#4C9EAF',
  white: '#FFFFFF',
  border: '#EAEAEA',
  bg: '#F9F9F9',
  success: '#28A745',
  warning: '#FFC107'
};

const LeadAnalytics = () => {
  const [loading, setLoading] = useState(true);
  const [leadSources, setLeadSources] = useState<any[]>([]);
  const [funnelData, setFunnelData] = useState<any[]>([]);

  useEffect(() => {
    // Simulated API Call to fetch native 'People' or 'Companies' with lead status
    setTimeout(() => {
      setLeadSources([
        { source: 'LinkedIn Ads', count: 145, color: BRAND.primary },
        { source: 'Website Forms', count: 86, color: BRAND.accent },
        { source: 'Facebook Ads', count: 42, color: BRAND.lightAccent },
        { source: 'Cold Calls', count: 28, color: BRAND.secondary },
      ]);
      
      setFunnelData([
        { stage: 'Total Leads', count: 301, percent: 100 },
        { stage: 'Contacted', count: 184, percent: 61 },
        { stage: 'Qualified', count: 85, percent: 28 },
        { stage: 'Converted', count: 27, percent: 9 },
      ]);
      setLoading(false);
    }, 800);
  }, []);

  if (loading) {
    return <div style={{ padding: '24px', fontFamily: "'Barlow', sans-serif" }}>Loading Lead Analytics...</div>;
  }

  const totalLeads = leadSources.reduce((sum, item) => sum + item.count, 0);

  return (
    <div style={{
      fontFamily: "'Barlow', sans-serif",
      backgroundColor: '#FFFFFF',
      border: `1px solid ${BRAND.border}`,
      padding: '24px',
      height: '100%',
      boxSizing: 'border-box'
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@600&family=Barlow:wght@400;500;600&display=swap');
      `}</style>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h2 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '24px', color: BRAND.primary, textTransform: 'uppercase', margin: '0 0 4px 0' }}>Lead Pipeline Analytics</h2>
          <div style={{ fontSize: '14px', color: BRAND.text }}>Source distribution & Conversion funnel</div>
        </div>
        <div style={{ padding: '6px 12px', backgroundColor: BRAND.bg, border: `1px solid ${BRAND.border}`, fontSize: '12px', fontWeight: 600, color: BRAND.secondary }}>
          YTD DATA
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
        
        {/* Left: Lead Sources (Horizontal Stacked Bar + Legend) */}
        <div>
          <div style={{ fontSize: '14px', color: BRAND.secondary, textTransform: 'uppercase', fontWeight: 600, marginBottom: '16px' }}>Lead Sources</div>
          
          <div style={{ width: '100%', height: '24px', borderRadius: '4px', overflow: 'hidden', display: 'flex', marginBottom: '20px' }}>
            {leadSources.map((source, i) => (
              <div key={i} style={{ 
                width: `${(source.count / totalLeads) * 100}%`, 
                height: '100%', 
                backgroundColor: source.color,
                borderRight: i < leadSources.length - 1 ? '1px solid #FFF' : 'none'
              }}></div>
            ))}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {leadSources.map((source, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: '12px', height: '12px', borderRadius: '2px', backgroundColor: source.color }}></div>
                  <span style={{ fontSize: '14px', color: BRAND.primary }}>{source.source}</span>
                </div>
                <div style={{ fontSize: '14px', fontWeight: 600, color: BRAND.primary }}>
                  {source.count} <span style={{ color: BRAND.text, fontWeight: 400, fontSize: '12px' }}>({Math.round((source.count / totalLeads) * 100)}%)</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Conversion Funnel */}
        <div>
          <div style={{ fontSize: '14px', color: BRAND.secondary, textTransform: 'uppercase', fontWeight: 600, marginBottom: '16px' }}>Conversion Funnel</div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'center' }}>
            {funnelData.map((stage, i) => (
              <div key={i} style={{ display: 'flex', width: '100%', alignItems: 'center', gap: '16px' }}>
                <div style={{ width: '80px', fontSize: '13px', color: BRAND.text, textAlign: 'right' }}>{stage.stage}</div>
                
                <div style={{ flexGrow: 1, display: 'flex', justifyContent: 'center' }}>
                  <div style={{ 
                    width: `${stage.percent}%`, 
                    minWidth: '4px',
                    height: '28px', 
                    backgroundColor: i === funnelData.length - 1 ? BRAND.success : BRAND.accent, 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    color: '#FFF',
                    fontSize: '12px',
                    fontWeight: 600,
                    borderRadius: '2px'
                  }}>
                    {stage.count}
                  </div>
                </div>
                
                <div style={{ width: '40px', fontSize: '13px', fontWeight: 600, color: BRAND.primary }}>{stage.percent}%</div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default defineFrontComponent({
  universalIdentifier: LEAD_ANALYTICS_FRONT_COMPONENT_UNIVERSAL_IDENTIFIER,
  name: 'Lead Analytics',
  component: LeadAnalytics
});
