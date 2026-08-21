import os
import re

path = 'src/front-components/leads-dashboard.tsx'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Add state
old_state = "const [filterMemberId, setFilterMemberId] = useState('');"
new_state = """const [filterMemberId, setFilterMemberId] = useState('');
  const [subProfileId, setSubProfileId] = useState<string | null>(
    typeof window !== 'undefined' && window.localStorage ? window.localStorage.getItem('minimines_sub_profile_id') : null
  );"""

if old_state in content:
    content = content.replace(old_state, new_state)
else:
    print("Could not find state declaration block")

# 2. Update visibleLeads logic
old_visible_leads = """    } else if (role === 'associate') {
      // Show associates their specific dashboard with their assigned leads only
      baseLeads = leads.filter(l => relationId(l, 'assignedAssociate') === currentUserId);
    } // HOD sees all by default"""

new_visible_leads = """    } else if (role === 'associate') {
      // Shared associate accounts use subProfileId to isolate their view
      if (subProfileId) {
        baseLeads = leads.filter(l => relationId(l, 'assignedAssociate') === subProfileId);
      } else {
        baseLeads = leads;
      }
    } // HOD sees all by default"""

if old_visible_leads in content:
    content = content.replace(old_visible_leads, new_visible_leads)
else:
    print("Could not find visibleLeads block")

# 3. Update dependency array
old_deps = "}, [role, currentUserId, leads, filterAssigned, filterMemberId]);"
new_deps = "}, [role, currentUserId, leads, filterAssigned, filterMemberId, subProfileId]);"

if old_deps in content:
    content = content.replace(old_deps, new_deps)
else:
    print("Could not find deps array")

# 4. Add UI dropdown to filters bar
# Find where the filters are rendered:
old_filters = """            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <span style={{ fontSize: '14px', fontWeight: 600, color: BRAND.textMid }}>Filters:</span>
              
              <select 
                value={filterAssigned}"""

new_filters = """            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <span style={{ fontSize: '14px', fontWeight: 600, color: BRAND.textMid }}>Filters:</span>
              
              {role === 'associate' && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '4px 8px', backgroundColor: '#F0F8FF', borderRadius: '4px', border: `1px solid ${BRAND.accent}` }}>
                  <span style={{ fontSize: '13px', fontWeight: 600, color: BRAND.primary }}>Viewing as:</span>
                  <select
                    value={subProfileId || ''}
                    onChange={(e) => {
                      const val = e.target.value;
                      setSubProfileId(val || null);
                      if (typeof window !== 'undefined' && window.localStorage) {
                        if (val) window.localStorage.setItem('minimines_sub_profile_id', val);
                        else window.localStorage.removeItem('minimines_sub_profile_id');
                      }
                    }}
                    style={{ padding: '2px 6px', borderRadius: '4px', border: `1px solid ${BRAND.border}`, fontSize: '12px', color: BRAND.primary, fontWeight: 600, background: 'transparent' }}
                  >
                    <option value="">-- All --</option>
                    {assignableMembers.map(m => (
                      <option key={m.id} value={m.id}>{getMemberName(m.id)}</option>
                    ))}
                  </select>
                </div>
              )}

              <select 
                value={filterAssigned}"""

if old_filters in content:
    content = content.replace(old_filters, new_filters)
else:
    print("Could not find filters block")

# 5. Fix welcome greeting logic
# The greeting used getMemberName(currentUserId). Let's make it smarter if subProfileId is set.
old_greeting = "Welcome, {getMemberName(currentUserId) || 'Team Member'}"
new_greeting = "Welcome, {role === 'associate' && subProfileId ? getMemberName(subProfileId) : (getMemberName(currentUserId) || 'Team Member')}"
if old_greeting in content:
    content = content.replace(old_greeting, new_greeting)
else:
    print("Could not find welcome greeting")


with open(path, 'w', encoding='utf-8') as f:
    f.write(content)

print("Applied sleek sub-profile UI to leads dashboard")
