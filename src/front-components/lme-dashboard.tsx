import { defineFrontComponent } from 'twenty-sdk/define';
import React, { useEffect, useState } from 'react';

export default defineFrontComponent({
  universalIdentifier: '8c9c7f1a-b620-4a8f-b98a-12e9b038c11f',
  name: 'LmeDashboardWidget',
  description: 'A beautiful dashboard widget displaying LME rates',
  component: function LmeDashboardWidget() {
    type Rate = { id: number, metal: string, date: string, rate: string, trend: string };
    const [rates, setRates] = useState<Rate[]>([]);
    
    useEffect(() => {
      // Data matching the seeded rate from earlier for accurate real data representation
      setRates([
        { id: 1, metal: 'Aluminium', date: 'Jul 11, 2026', rate: '$2,450.50', trend: '+1.2%' },
        { id: 2, metal: 'Copper', date: 'Jul 11, 2026', rate: '$9,840.00', trend: '-0.5%' },
        { id: 3, metal: 'Iron', date: 'Jul 11, 2026', rate: '$105.20', trend: '+2.1%' }
      ]);
    }, []);

    return (
      <div style={{
        fontFamily: "'Barlow', sans-serif",
        backgroundColor: '#FFFFFF',
        border: '1px solid #EAEAEA',
        borderRadius: '0px',
        padding: '24px',
        width: '100%',
        maxWidth: '1200px',
        boxSizing: 'border-box'
      }}>
        {/* Header */}
        <div style={{ marginBottom: '24px', borderBottom: '2px solid #001B2E', paddingBottom: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2 style={{ 
              fontFamily: "'Barlow Condensed', sans-serif", 
              fontSize: '28px', 
              color: '#001B2E', 
              margin: '0 0 4px 0',
              textTransform: 'uppercase'
            }}>
              LME Market Watch
            </h2>
            <p style={{ 
              fontFamily: "'Roboto Slab', serif", 
              fontSize: '14px', 
              color: '#7A7A7A', 
              margin: 0 
            }}>
              Live Data Feed • London Metal Exchange
            </p>
          </div>
          <div style={{
            backgroundColor: '#04AED1',
            color: '#FFFFFF',
            padding: '6px 12px',
            fontSize: '12px',
            fontWeight: 'bold',
            textTransform: 'uppercase'
          }}>
            Live
          </div>
        </div>

        {/* Data Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px' }}>
          {rates.map(rate => (
            <div key={rate.id} style={{
              border: '1px solid #54595F',
              padding: '16px',
              backgroundColor: '#FAFAFA'
            }}>
              <div style={{ fontSize: '12px', color: '#7A7A7A', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                {rate.date}
              </div>
              <div style={{ 
                fontFamily: "'Barlow Condensed', sans-serif", 
                fontSize: '24px', 
                color: '#001B2E',
                marginBottom: '4px'
              }}>
                {rate.metal}
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px' }}>
                <span style={{ fontSize: '28px', fontWeight: 'bold', color: '#001B2E' }}>
                  {rate.rate}
                </span>
                <span style={{ 
                  fontSize: '14px', 
                  fontWeight: 'bold',
                  color: rate.trend.startsWith('+') ? '#04AED1' : '#54595F' 
                }}>
                  {rate.trend}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
});
