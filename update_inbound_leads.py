import os

path = 'src/front-components/enquiry-quick-reply.tsx'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# Let's inject state for `sourceFilter`
state_inject = """  const [converting, setConverting] = useState(false);
  const [sourceFilter, setSourceFilter] = useState<'WEBSITE' | 'OTHER'>('WEBSITE');"""

if "const [converting, setConverting] = useState(false);" in content:
    content = content.replace("const [converting, setConverting] = useState(false);", state_inject)
else:
    print("Failed to inject sourceFilter state")

# Update `loadEnquiries`
old_load = """  const loadEnquiries = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    // ONLY fetch website enquiries
    const data = await api(`enquiries?filter[source][eq]=WEBSITE&orderBy=createdAt,desc&limit=50`);
    const arr = Array.isArray(data) ? data : (data?.edges?.map((e: any) => e.node) || []);
    setEnquiries(arr);
    if (!silent) setLoading(false);
  }, []);"""

new_load = """  const loadEnquiries = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    let filterString = `filter[source][eq]=${sourceFilter}`;
    if (sourceFilter === 'OTHER') {
        filterString = `filter[source][neq]=WEBSITE`;
    }
    const data = await api(`enquiries?${filterString}&orderBy=createdAt,desc&limit=50`);
    const arr = Array.isArray(data) ? data : (data?.edges?.map((e: any) => e.node) || []);
    setEnquiries(arr);
    if (!silent) setLoading(false);
  }, [sourceFilter]);"""

if old_load in content:
    content = content.replace(old_load, new_load)
else:
    print("Failed to replace loadEnquiries")

# Update Conversion Logic to use the correct source
old_convert = """      source: "WEBSITE",
      status: "NEW","""

new_convert = """      source: selected.source || "WEBSITE",
      status: "NEW","""

if old_convert in content:
    content = content.replace(old_convert, new_convert)
else:
    print("Failed to update conversion source")

# Add the Filter Toggle UI and modernize the sidebar
old_sidebar_header = """        <div style={{ padding: '24px', borderBottom: `1px solid ${B.border}`, backgroundColor: B.sidebar, color: B.white }}>
          <h2 style={{ margin: 0, fontSize: '20px', fontFamily: "'Barlow Condensed', sans-serif", textTransform: 'uppercase' }}>Website Inbound Leads</h2>
          <p style={{ margin: '4px 0 0', fontSize: '12px', opacity: 0.8 }}>Live tracking of website form submissions.</p>
        </div>"""

new_sidebar_header = """        <div style={{ padding: '24px', borderBottom: `1px solid ${B.border}`, backgroundColor: B.sidebar, color: B.white }}>
          <h2 style={{ margin: 0, fontSize: '22px', fontFamily: "'Barlow Condensed', sans-serif", textTransform: 'uppercase', letterSpacing: '0.5px' }}>Inbound Leads</h2>
          
          <div style={{ display: 'flex', marginTop: '16px', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '6px', padding: '4px' }}>
            <button 
              onClick={() => setSourceFilter('WEBSITE')}
              style={{
                flex: 1, padding: '6px 0', border: 'none', borderRadius: '4px', fontSize: '13px', fontWeight: 600,
                backgroundColor: sourceFilter === 'WEBSITE' ? B.white : 'transparent',
                color: sourceFilter === 'WEBSITE' ? B.sidebar : 'rgba(255,255,255,0.7)',
                cursor: 'pointer', transition: 'all 0.2s'
              }}>
              Website
            </button>
            <button 
              onClick={() => setSourceFilter('OTHER')}
              style={{
                flex: 1, padding: '6px 0', border: 'none', borderRadius: '4px', fontSize: '13px', fontWeight: 600,
                backgroundColor: sourceFilter === 'OTHER' ? B.white : 'transparent',
                color: sourceFilter === 'OTHER' ? B.sidebar : 'rgba(255,255,255,0.7)',
                cursor: 'pointer', transition: 'all 0.2s'
              }}>
              Other Sources
            </button>
          </div>
        </div>"""

if old_sidebar_header in content:
    content = content.replace(old_sidebar_header, new_sidebar_header)
else:
    print("Failed to replace sidebar header")

# Add hover styles to the items
old_item = """                <div 
                  key={enq.id} 
                  onClick={() => setSelectedId(enq.id)}
                  style={{
                    padding: '16px 24px',
                    borderBottom: `1px solid ${B.border}`,
                    cursor: 'pointer',
                    backgroundColor: isActive ? '#F0F8FF' : 'transparent',
                    borderLeft: isActive ? `4px solid ${B.accent}` : '4px solid transparent',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <strong style={{ color: B.textDark, fontSize: '15px' }}>{enq.customerName || 'Anonymous'}</strong>
                    <span style={{ fontSize: '11px', color: B.text }}>{new Date(enq.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div style={{ fontSize: '13px', color: B.textMid, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {enq.message || 'No message provided.'}
                  </div>
                </div>"""

new_item = """                <div 
                  key={enq.id} 
                  onClick={() => setSelectedId(enq.id)}
                  onMouseEnter={(e) => { if (!isActive) e.currentTarget.style.backgroundColor = '#F9FAFB'; }}
                  onMouseLeave={(e) => { if (!isActive) e.currentTarget.style.backgroundColor = 'transparent'; }}
                  style={{
                    padding: '16px 24px',
                    borderBottom: `1px solid ${B.border}`,
                    cursor: 'pointer',
                    backgroundColor: isActive ? '#F0F8FF' : 'transparent',
                    borderLeft: isActive ? `4px solid ${B.accent}` : '4px solid transparent',
                    transition: 'all 0.2s ease-in-out',
                    transform: isActive ? 'translateX(2px)' : 'none'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', alignItems: 'center' }}>
                    <strong style={{ color: B.textDark, fontSize: '15px', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>{enq.customerName || 'Anonymous'}</strong>
                    <span style={{ fontSize: '10px', color: B.text, backgroundColor: B.bg, padding: '2px 6px', borderRadius: '4px', flexShrink: 0 }}>{new Date(enq.createdAt).toLocaleDateString()}</span>
                  </div>
                  {sourceFilter === 'OTHER' && (
                    <div style={{ fontSize: '10px', fontWeight: 600, color: B.accent, marginBottom: '4px', textTransform: 'uppercase' }}>{enq.source || 'UNKNOWN'}</div>
                  )}
                  <div style={{ fontSize: '13px', color: B.textMid, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {enq.message || 'No message provided.'}
                  </div>
                </div>"""

if old_item in content:
    content = content.replace(old_item, new_item)
else:
    print("Failed to replace sidebar item")

# Enhance Main Panel Design
old_main_panel = """      {/* Main Panel - Enquiry Details */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '32px', backgroundColor: B.bg, overflowY: 'auto' }}>
        {selected ? (
          <div style={{ maxWidth: '800px', width: '100%', margin: '0 auto', backgroundColor: B.white, borderRadius: '12px', border: `1px solid ${B.border}`, boxShadow: '0 2px 10px rgba(0,0,0,0.02)' }}>"""

new_main_panel = """      {/* Main Panel - Enquiry Details */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '32px', backgroundColor: B.bg, overflowY: 'auto', position: 'relative' }}>
        {selected ? (
          <div style={{ 
            maxWidth: '800px', width: '100%', margin: '0 auto', 
            backgroundColor: B.white, borderRadius: '12px', border: `1px solid ${B.border}`, 
            boxShadow: '0 8px 30px rgba(0,27,46,0.04)',
            animation: 'slideUp 0.3s ease-out',
          }}>
            <style>
              {`
                @keyframes slideUp {
                  from { opacity: 0; transform: translateY(10px); }
                  to { opacity: 1; transform: translateY(0); }
                }
              `}
            </style>"""

if old_main_panel in content:
    content = content.replace(old_main_panel, new_main_panel)
else:
    print("Failed to replace main panel")


with open(path, 'w', encoding='utf-8') as f:
    f.write(content)
print("Applied modern UI updates to inbound leads dashboard")
