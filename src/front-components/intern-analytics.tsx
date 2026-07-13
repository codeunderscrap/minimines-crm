import React, { useState, useEffect } from 'react';
import { defineFrontComponent } from 'twenty-sdk/define';
import { INTERN_ANALYTICS_FRONT_COMPONENT_UNIVERSAL_IDENTIFIER } from '../constants/universal-identifiers';

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

const InternAnalytics = () => {
  const [loading, setLoading] = useState(true);
  const [internData, setInternData] = useState<any[]>([]);

  useEffect(() => {
    // Simulated API Call to fetch native 'Notes' or 'Tasks' assigned to interns
    // In production, this fetches from `https://api.twenty.com/rest/tasks` or custom call logs
    setTimeout(() => {
      setInternData([
        { name: 'Arsalan A.', calls: 145, converted: 12 },
        { name: 'Intern B', calls: 98, converted: 5 },
        { name: 'Intern C', calls: 112, converted: 8 },
        { name: 'Intern D', calls: 87, converted: 2 },
      ]);
      setLoading(false);
    }, 800);
  }, []);

  if (loading) {
    return <div style={{ padding: '24px', fontFamily: "'Barlow', sans-serif" }}>Loading Intern Performance Data...</div>;
  }

  const maxCalls = Math.max(...internData.map(d => d.calls));

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
          <h2 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '24px', color: BRAND.primary, textTransform: 'uppercase', margin: '0 0 4px 0' }}>Intern Call Tracker</h2>
          <div style={{ fontSize: '14px', color: BRAND.text }}>Outbound call volume vs Lead conversions</div>
        </div>
        <div style={{ padding: '6px 12px', backgroundColor: BRAND.bg, border: `1px solid ${BRAND.border}`, fontSize: '12px', fontWeight: 600, color: BRAND.secondary }}>
          THIS MONTH
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {internData.map((intern, i) => (
          <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
              <span style={{ fontWeight: 600, color: BRAND.primary, fontSize: '15px' }}>{intern.name}</span>
              <span style={{ fontSize: '13px', color: BRAND.secondary }}>
                <strong>{intern.calls}</strong> Calls &nbsp;|&nbsp; <strong style={{ color: BRAND.accent }}>{intern.converted}</strong> Converted
              </span>
            </div>
            
            {/* Native CSS Bar Chart */}
            <div style={{ width: '100%', height: '16px', backgroundColor: '#E0E0E0', borderRadius: '4px', overflow: 'hidden', display: 'flex' }}>
              <div style={{ 
                width: `${(intern.calls / maxCalls) * 100}%`, 
                height: '100%', 
                backgroundColor: BRAND.lightAccent,
                position: 'relative'
              }}>
                <div style={{
                  width: `${(intern.converted / intern.calls) * 100}%`,
                  height: '100%',
                  backgroundColor: BRAND.accent
                }}></div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div style={{ marginTop: '24px', paddingTop: '16px', borderTop: `1px solid ${BRAND.border}`, display: 'flex', gap: '16px', fontSize: '12px', color: BRAND.secondary }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <div style={{ width: '12px', height: '12px', backgroundColor: BRAND.lightAccent, borderRadius: '2px' }}></div>
          Total Calls Made
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <div style={{ width: '12px', height: '12px', backgroundColor: BRAND.accent, borderRadius: '2px' }}></div>
          Successfully Converted
        </div>
      </div>
    </div>
  );
};

export default defineFrontComponent({
  universalIdentifier: INTERN_ANALYTICS_FRONT_COMPONENT_UNIVERSAL_IDENTIFIER,
  name: 'Intern Analytics',
  component: InternAnalytics
});
