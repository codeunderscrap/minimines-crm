import React, { useEffect, useState } from 'react';
import { defineFrontComponent } from 'twenty-sdk/define';
import { useRecordId } from 'twenty-sdk/front-component';
import { PRODUCT_DASHBOARD_FRONT_COMPONENT_UNIVERSAL_IDENTIFIER } from '../constants/universal-identifiers';

const BRAND = {
  primary: '#001B2E',
  secondary: '#54595F',
  text: '#7A7A7A',
  accent: '#3B6E93',
  lightAccent: '#4C9EAF',
  white: '#FFFFFF',
  border: '#EAEAEA',
  bg: '#F9F9F9',
  green: '#2E8B57',
  red: '#D32F2F',
  orange: '#F57C00',
  gray: '#9E9E9E'
};

const FONTS = `
  @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@600&family=Roboto+Slab:wght@400&family=Barlow:wght@400;500;600&display=swap');
  
  .product-dashboard {
    font-family: 'Barlow', sans-serif;
    color: ${BRAND.text};
    background: ${BRAND.white};
    padding: 24px;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 27, 46, 0.04);
    border: 1px solid ${BRAND.border};
  }

  .h2 {
    font-family: 'Barlow Condensed', sans-serif;
    color: ${BRAND.primary};
    text-transform: uppercase;
    font-size: 24px;
    margin: 0 0 16px 0;
  }
`;

const fetchTwenty = async (path: string) => {
  const url = `http://localhost:3000/rest/${path}`;
  const apiKey = 'Bearer eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IjYyMDI2ODQzLTA5ZDItNDM5My05NTM1LTZlODJhNTE3ZjRmNCJ9.eyJzdWIiOiI2MWJlMjBjYi1jMGQ2LTRiZTAtYWYxNy02YzUwMDY3NmRmOWIiLCJ0eXBlIjoiQVBJX0tFWSIsIndvcmtzcGFjZUlkIjoiNjFiZTIwY2ItYzBkNi00YmUwLWFmMTctNmM1MDA2NzZkZjliIiwiaWF0IjoxNzgzNjg1MzQ0LCJleHAiOjQ5MzcyODUzNDEsImp0aSI6Ijg5YjcwMjEyLTY0NzktNDc2Zi05Y2ZlLTEyMTVkZDgyZWVmZCJ9.lPQmTpJ7lAK73_4ToKzb_FeiQbXbgC-h732qCGP7ezgBj8sPolSaILQh755UcVcr_pesNJdMI9gMS7V2c1GjsA';
  
  try {
    const res = await fetch(url, { headers: { Authorization: apiKey, 'Content-Type': 'application/json' } });
    const json = await res.json();
    return json?.data?.items || json?.data || [];
  } catch (error) {
    console.error('Fetch error:', error);
    return [];
  }
};

const ProductDashboard = () => {
  const recordId = useRecordId();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      if (!recordId) return;
      const data = await fetchTwenty(`products/${recordId}`);
      setProduct(data);
      setLoading(false);
    };
    loadData();
  }, [recordId]);

  if (loading) {
    return <div style={{ padding: '24px', fontFamily: "'Barlow', sans-serif" }}>Loading product specifications...</div>;
  }

  if (!product) {
    return <div style={{ padding: '24px', fontFamily: "'Barlow', sans-serif" }}>Could not load product details.</div>;
  }

  return (
    <>
      <style>{FONTS}</style>
      <div className="product-dashboard">
        <h2 className="h2">Product Specifications</h2>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginTop: '16px' }}>
           <div style={{ padding: '16px', backgroundColor: BRAND.bg, borderRadius: '4px', border: `1px solid ${BRAND.border}` }}>
              <div style={{ fontSize: '12px', textTransform: 'uppercase', color: BRAND.text }}>Material SKU</div>
              <div style={{ fontSize: '20px', fontWeight: 600, color: BRAND.primary }}>{product.sku || 'N/A'}</div>
           </div>
           
           <div style={{ padding: '16px', backgroundColor: BRAND.bg, borderRadius: '4px', border: `1px solid ${BRAND.border}` }}>
              <div style={{ fontSize: '12px', textTransform: 'uppercase', color: BRAND.text }}>Category</div>
              <div style={{ fontSize: '20px', fontWeight: 600, color: BRAND.primary }}>{(product.category || 'N/A').replace('_', ' ')}</div>
           </div>

           <div style={{ padding: '16px', backgroundColor: BRAND.bg, borderRadius: '4px', border: `1px solid ${BRAND.border}`, gridColumn: 'span 2' }}>
              <div style={{ fontSize: '12px', textTransform: 'uppercase', color: BRAND.text }}>Base Composition</div>
              <div style={{ fontSize: '16px', fontWeight: 500, color: BRAND.secondary, marginTop: '8px' }}>
                {product.baseComposition || 'No composition specified.'}
              </div>
           </div>

           <div style={{ padding: '16px', backgroundColor: BRAND.bg, borderRadius: '4px', border: `1px solid ${BRAND.border}`, gridColumn: 'span 2' }}>
              <div style={{ fontSize: '12px', textTransform: 'uppercase', color: BRAND.text }}>Pricing Strategy</div>
              <div style={{ fontSize: '16px', fontWeight: 500, color: BRAND.secondary, marginTop: '8px' }}>
                {product.targetLmeLinkage 
                  ? `Linked to: ${product.targetLmeLinkage}` 
                  : 'Fixed domestic pricing model (No LME linkage).'}
              </div>
           </div>
        </div>
      </div>
    </>
  );
};

export default defineFrontComponent({
  universalIdentifier: PRODUCT_DASHBOARD_FRONT_COMPONENT_UNIVERSAL_IDENTIFIER,
  name: 'Product Master Dashboard',
  component: ProductDashboard,
});
