import React, { useEffect, useState } from 'react';
import { defineFrontComponent } from 'twenty-sdk/define';
import { useRecordId } from 'twenty-sdk/front-component';
import { PRODUCT_DASHBOARD_FRONT_COMPONENT_UNIVERSAL_IDENTIFIER } from '../constants/universal-identifiers';
import { useUserRole, AccessDenied, RoleLoading } from '../utils/role-gate';

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

const API_URL = 'https://api.twenty.com/rest';
const API_HEADERS = {
  Authorization: 'Bearer eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IjYwMjNlNTZkLTQ2NmMtNDQxOC1iMjE4LWZjOWFmMGU3ODU5MiJ9.eyJzdWIiOiI0MzQ4MGMxNi01ZjA1LTQ5OGUtYjdjZC1mOTFmMjdkMGUxMjUiLCJ0eXBlIjoiQVBJX0tFWSIsIndvcmtzcGFjZUlkIjoiNDM0ODBjMTYtNWYwNS00OThlLWI3Y2QtZjkxZjI3ZDBlMTI1IiwiaWF0IjoxNzg0MzU3MTIwLCJleHAiOjQ5Mzc5NTcxMTksImp0aSI6IjZkODliNmU5LTcwZmYtNGIwZS05MzUyLTk0ZTljMmJiOGQ5MyJ9.al8pc21Lc12mGgMEKu8GaWZDJytK55FjUx5_egt8jd3rAhUa0TpCfq7PAWoCDX5KUeqt2VrLN29QSfXHicnbzQ',
  'Content-Type': 'application/json',
};

const fetchList = async (path: string) => {
  try {
    const res = await fetch(`${API_URL}/${path}`, { headers: API_HEADERS });
    const json = await res.json();
    const key = path.split('?')[0];
    let items = json?.data?.[key] ?? [];
    if (items && items.edges) items = items.edges.map((e: any) => e.node);
    return Array.isArray(items) ? items : [];
  } catch (error) {
    console.error('Fetch error:', error);
    return [];
  }
};

const fetchOne = async (path: string, key: string) => {
  try {
    const res = await fetch(`${API_URL}/${path}`, { headers: API_HEADERS });
    const json = await res.json();
    return json?.data?.[key] ?? null;
  } catch (error) {
    console.error('Fetch error:', error);
    return null;
  }
};

const ProductDashboard = () => {
  const userRole = useUserRole();
  const recordId = useRecordId();
  const [recordProduct, setRecordProduct] = useState<any>(null);
  const [allProducts, setAllProducts] = useState<any[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      if (recordId) {
        setRecordProduct(await fetchOne(`products/${recordId}`, 'product'));
      } else {
        const items = await fetchList('products?limit=100');
        setAllProducts(items);
        if (items.length > 0) setSelectedId(items[0].id);
      }
      setLoading(false);
    };
    loadData();
  }, [recordId]);

  if (!recordId && userRole === null) return <RoleLoading />;
  if (!recordId && userRole === 'associate') return <AccessDenied minRole="manager" />;

  if (loading) {
    return <div style={{ padding: '24px', fontFamily: "'Barlow', sans-serif" }}>Loading product specifications...</div>;
  }

  if (!recordId && allProducts.length === 0) {
    return <div style={{ padding: '40px', textAlign: 'center', fontFamily: "'Barlow', sans-serif", color: BRAND.text }}>No products found.</div>;
  }

  const product = recordId ? recordProduct : (allProducts.find(p => p.id === selectedId) || null);

  if (!product) {
    return <div style={{ padding: '24px', fontFamily: "'Barlow', sans-serif" }}>Could not load product details.</div>;
  }

  return (
    <>
      <style>{FONTS}</style>
      <div className="product-dashboard">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '16px' }}>
          <h2 className="h2" style={{ margin: 0 }}>Product Specifications</h2>
          {!recordId && allProducts.length > 0 && (
            <select
              value={selectedId || ''}
              onChange={(e) => setSelectedId(e.target.value)}
              style={{ padding: '8px 12px', border: `1px solid ${BRAND.border}`, fontFamily: "'Barlow', sans-serif", fontSize: '14px', outline: 'none' }}
            >
              {allProducts.map(p => <option key={p.id} value={p.id}>{p.materialName || p.sku || `Product ${(p.id || '').substring(0, 6)}`}</option>)}
            </select>
          )}
        </div>

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

