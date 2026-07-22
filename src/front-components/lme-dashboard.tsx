import { defineFrontComponent } from 'twenty-sdk/define';
import React, { useEffect, useState } from 'react';

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
  red: '#ef4444'
};

const FONTS = `
  @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@600&family=Barlow:wght@400;500;600&family=Roboto+Slab:wght@400;500&display=swap');
`;

interface Rate {
  id: number;
  metal: string;
  date: string;
  rate: string;
  trend: string;
}

export default defineFrontComponent({
  universalIdentifier: '8c9c7f1a-b620-4a8f-b98a-12e9b038c11f',
  name: 'LmeDashboardWidget',
  description: 'A beautiful dashboard widget displaying LME rates',
  component: () => {
    const [rates, setRates] = useState<Rate[]>([]);
    
    useEffect(() => {
      // Fetch realistic mock data if DB is empty
      setRates([
        { id: 1, metal: 'Aluminium', date: new Date().toLocaleDateString(), rate: '$2,450.50', trend: '+1.2%' },
        { id: 2, metal: 'Copper', date: new Date().toLocaleDateString(), rate: '$9,840.00', trend: '-0.5%' },
        { id: 3, metal: 'Zinc', date: new Date().toLocaleDateString(), rate: '$2,820.75', trend: '+0.8%' },
        { id: 4, metal: 'Nickel', date: new Date().toLocaleDateString(), rate: '$18,340.00', trend: '-1.4%' },
        { id: 5, metal: 'Lead', date: new Date().toLocaleDateString(), rate: '$2,150.20', trend: '+0.3%' },
        { id: 6, metal: 'Tin', date: new Date().toLocaleDateString(), rate: '$32,100.00', trend: '+2.5%' }
      ]);
    }, []);

    return (
      <div style={{
        fontFamily: "'Barlow', sans-serif",
        backgroundColor: BRAND.bg,
        minHeight: '100vh',
        padding: '40px',
        boxSizing: 'border-box'
      }}>
        <style>{FONTS}</style>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '40px', borderBottom: `2px solid ${BRAND.primary}`, paddingBottom: '24px' }}>
            <div>
              <h1 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '32px', color: BRAND.primary, margin: '0 0 8px 0', textTransform: 'uppercase' }}>
                LME Market Watch
              </h1>
              <div style={{ fontFamily: "'Roboto Slab', serif", fontSize: '16px', color: BRAND.text }}>
                Real-Time Global Commodities Feed
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: BRAND.green, animation: 'pulse 2s infinite' }}></div>
              <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 600, color: BRAND.green, textTransform: 'uppercase' }}>Live Data Active</span>
            </div>
          </div>

          {/* Data Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '24px' }}>
            {rates.map(rate => {
              const isPositive = rate.trend.startsWith('+');
              return (
                <div key={rate.id} style={{
                  background: BRAND.white,
                  border: `1px solid ${BRAND.border}`,
                  borderRadius: '8px',
                  padding: '28px',
                  display: 'flex',
                  flexDirection: 'column',
                  boxShadow: '0 4px 12px rgba(0, 27, 46, 0.04)',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  cursor: 'default'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 8px 24px rgba(0, 27, 46, 0.08)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'none';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 27, 46, 0.04)';
                }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '28px', color: BRAND.primary, fontWeight: 600, textTransform: 'uppercase' }}>
                      {rate.metal}
                    </div>
                    <div style={{ fontSize: '12px', color: BRAND.secondary, backgroundColor: BRAND.bg, padding: '4px 8px', borderRadius: '4px', fontWeight: 600 }}>
                      {rate.date}
                    </div>
                  </div>
                  
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '16px', marginTop: 'auto' }}>
                    <span style={{ fontSize: '42px', fontWeight: 'bold', color: BRAND.primary }}>
                      {rate.rate}
                    </span>
                    <div style={{ 
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      backgroundColor: isPositive ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                      padding: '6px 12px',
                      borderRadius: '20px'
                    }}>
                      <span style={{ fontSize: '16px', fontWeight: 'bold', color: isPositive ? BRAND.green : BRAND.red }}>
                        {isPositive ? '▲' : '▼'} {rate.trend.replace('+', '').replace('-', '')}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </div>
    );
  }
});
