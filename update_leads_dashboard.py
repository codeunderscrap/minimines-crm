import os

path = 'src/front-components/leads-dashboard.tsx'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Update assignableMembers to not filter out current user, so associates can select their name
content = content.replace(
"""  const assignableMembers = useMemo(() => {
    if (role === 'associate') return [];
    return members.filter((m: any) => m.id !== currentUserId);
  }, [role, members, currentUserId]);""",
"""  const assignableMembers = useMemo(() => {
    return members; // Show all users so the shared associate account can select anyone
  }, [members]);"""
)

# 2. Update canAssign to always be true
content = content.replace("const canAssign = role !== 'associate';", "const canAssign = true;")

# 3. Add filters for "Assigned" / "Unassigned" and "Associate Name"
# We will inject a filter bar above the list. Let's find a good spot.
# After `</a>\n                </div>\n              )}`
# and before `{/* Lead List Header */}`

filter_ui = """
              {/* Added Filter Bar for Leads */}
              <div style={{ display: 'flex', gap: '10px', marginBottom: '16px' }}>
                <select 
                  onChange={(e) => {
                    const val = e.target.value;
                    const url = new URL(window.location.href);
                    if (val) url.searchParams.set('filterAssigned', val);
                    else url.searchParams.delete('filterAssigned');
                    window.history.pushState({}, '', url);
                  }}
                  style={{ padding: '8px 12px', borderRadius: '4px', border: `1px solid ${BRAND.border}`, fontSize: '13px' }}
                >
                  <option value="">-- All Leads --</option>
                  <option value="unassigned">Unassigned Leads</option>
                  <option value="assigned">Assigned Leads</option>
                </select>

                <select 
                  onChange={(e) => {
                    const val = e.target.value;
                    const url = new URL(window.location.href);
                    if (val) url.searchParams.set('filterMemberId', val);
                    else url.searchParams.delete('filterMemberId');
                    window.history.pushState({}, '', url);
                  }}
                  style={{ padding: '8px 12px', borderRadius: '4px', border: `1px solid ${BRAND.border}`, fontSize: '13px' }}
                >
                  <option value="">-- Filter by Associate --</option>
                  {members.map(m => (
                    <option key={m.id} value={m.id}>{m.name?.firstName || m.name || m.emails?.[0]?.primaryEmail}</option>
                  ))}
                </select>
              </div>
"""

# Now we need to actually apply these filters to `visibleLeads`
filter_logic = """
  const visibleLeads = useMemo(() => {
    const params = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '');
    const filterAssigned = params.get('filterAssigned');
    const filterMemberId = params.get('filterMemberId');

    return leads.filter(l => {
      let keep = true;
      if (filterAssigned === 'unassigned') {
        keep = keep && !l.assignedAssociateId && !l.assignedManagerPrimaryId;
      } else if (filterAssigned === 'assigned') {
        keep = keep && !!(l.assignedAssociateId || l.assignedManagerPrimaryId);
      }
      
      if (filterMemberId) {
        keep = keep && (l.assignedAssociateId === filterMemberId || l.assignedManagerPrimaryId === filterMemberId);
      }
      
      return keep;
    });
  }, [leads, typeof window !== 'undefined' ? window.location.search : '']);
"""

# Replace existing visibleLeads (which is `const visibleLeads = leads;` if it exists, or inject it)
if 'const visibleLeads = leads;' in content:
    content = content.replace('const visibleLeads = leads;', filter_logic)
elif 'const visibleLeads =' not in content:
    content = content.replace('return (', filter_logic + '\n  return (', 1)

# Inject the UI
content = content.replace('            <div style={{ backgroundColor: BRAND.primary', filter_ui + '\n            <div style={{ backgroundColor: BRAND.primary')

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)
