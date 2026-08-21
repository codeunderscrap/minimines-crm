import os
import re

path = 'src/front-components/leads-dashboard.tsx'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Update `visibleLeads` to incorporate query parameters for filtering
old_visible_leads = """  const visibleLeads = useMemo(() => {
    if (role === 'hod') return leads;
    if (role === 'manager') {
      return leads.filter(l =>
        relationId(l, 'assignedManagerPrimary') === currentUserId ||
        relationId(l, 'assignedManagerSecondary') === currentUserId
      );
    }
    return leads.filter(l => relationId(l, 'assignedAssociate') === currentUserId);
  }, [role, currentUserId, leads]);"""

new_visible_leads = """  const visibleLeads = useMemo(() => {
    const params = new URLSearchParams(typeof window !== 'undefined' && window.location ? window.location.search : '');
    const filterAssigned = params.get('filterAssigned');
    const filterMemberId = params.get('filterMemberId');

    let baseLeads = leads;
    if (role === 'manager') {
      baseLeads = leads.filter(l =>
        relationId(l, 'assignedManagerPrimary') === currentUserId ||
        relationId(l, 'assignedManagerSecondary') === currentUserId
      );
    } else if (role === 'associate') {
      baseLeads = leads.filter(l => relationId(l, 'assignedAssociate') === currentUserId);
    } // HOD sees all by default

    // Now apply filters
    return baseLeads.filter(l => {
      let keep = true;
      if (filterAssigned === 'unassigned') {
        keep = keep && !relationId(l, 'assignedAssociate') && !relationId(l, 'assignedManagerPrimary');
      } else if (filterAssigned === 'assigned') {
        keep = keep && !!(relationId(l, 'assignedAssociate') || relationId(l, 'assignedManagerPrimary'));
      }
      
      if (filterMemberId) {
        keep = keep && (relationId(l, 'assignedAssociate') === filterMemberId || relationId(l, 'assignedManagerPrimary') === filterMemberId);
      }
      
      return keep;
    });
  }, [role, currentUserId, leads, typeof window !== 'undefined' && window.location ? window.location.search : '']);"""

if old_visible_leads in content:
    content = content.replace(old_visible_leads, new_visible_leads)
else:
    print("Could not find old_visible_leads.")

# 2. Inject the Filter UI
filter_ui = """          {/* Added Filter Bar */}
          <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', alignItems: 'center' }}>
            <span style={{ fontSize: '14px', fontWeight: 600, color: BRAND.textDark }}>Filters:</span>
            <select 
              value={typeof window !== 'undefined' && window.location ? new URLSearchParams(window.location.search).get('filterAssigned') || '' : ''}
              onChange={(e) => {
                const val = e.target.value;
                if (typeof window !== 'undefined' && window.location) {
                  const url = new URL(window.location.href);
                  if (val) url.searchParams.set('filterAssigned', val);
                  else url.searchParams.delete('filterAssigned');
                  window.history.pushState({}, '', url);
                  window.dispatchEvent(new Event('popstate'));
                }
              }}
              style={{ padding: '8px 12px', borderRadius: '4px', border: `1px solid ${BRAND.border}`, fontSize: '13px' }}
            >
              <option value="">-- All Leads --</option>
              <option value="unassigned">Unassigned Leads</option>
              <option value="assigned">Assigned Leads</option>
            </select>

            <select 
              value={typeof window !== 'undefined' && window.location ? new URLSearchParams(window.location.search).get('filterMemberId') || '' : ''}
              onChange={(e) => {
                const val = e.target.value;
                if (typeof window !== 'undefined' && window.location) {
                  const url = new URL(window.location.href);
                  if (val) url.searchParams.set('filterMemberId', val);
                  else url.searchParams.delete('filterMemberId');
                  window.history.pushState({}, '', url);
                  window.dispatchEvent(new Event('popstate'));
                }
              }}
              style={{ padding: '8px 12px', borderRadius: '4px', border: `1px solid ${BRAND.border}`, fontSize: '13px', minWidth: '180px' }}
            >
              <option value="">-- Filter by Associate --</option>
              {assignableMembers.map(m => (
                <option key={m.id} value={m.id}>{getMemberName(m.id)}</option>
              ))}
            </select>
          </div>

"""

anchor = "          <div style={{ backgroundColor: BRAND.white, border: `1px solid ${BRAND.border}`, borderRadius: '8px', overflow: 'hidden', boxShadow: '0 4px 12px rgba(0, 27, 46, 0.04)' }}>"
if anchor in content:
    content = content.replace(anchor, filter_ui + anchor)
else:
    print("Could not find UI anchor.")

# 3. Add an effect to re-render on pushState
# We need `popstate` listener for the custom routing above to trigger a re-render
popstate_hook = """
  // Auto-filtering based on query parameters from Company Dashboard
  useEffect(() => {
    const handlePopState = () => {
      // Force re-render to catch updated URLParams in visibleLeads
      setSearchQuery(typeof window !== 'undefined' ? window.location.search : '');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);
"""

# Let's inject a state for searchQuery to force re-renders
state_inject = "  const [searchQuery, setSearchQuery] = useState('');"
if "const [isUpdating, setIsUpdating] = useState(false);" in content:
    content = content.replace("const [isUpdating, setIsUpdating] = useState(false);", "const [isUpdating, setIsUpdating] = useState(false);\n" + state_inject)
    
if "// Auto-filtering based on query parameters from Company Dashboard" in content:
    content = content.replace("// Auto-filtering based on query parameters from Company Dashboard", popstate_hook + "\n  // Auto-filtering based on query parameters from Company Dashboard")

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)

print("Injected leads filter successfully.")
