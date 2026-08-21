import os

path = 'src/front-components/leads-dashboard.tsx'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Add `subProfileId` state
state_injection = """  const [filterMemberId, setFilterMemberId] = useState('');
  const [subProfileId, setSubProfileId] = useState<string | null>(
    typeof window !== 'undefined' && window.localStorage ? window.localStorage.getItem('minimines_sub_profile_id') : null
  );"""

if "const [filterMemberId, setFilterMemberId] = useState('');" in content:
    content = content.replace("const [filterMemberId, setFilterMemberId] = useState('');", state_injection)
else:
    print("Could not inject state")

# 2. Update `visibleLeads` logic to use subProfileId for filtering
old_visible_leads = """    } else if (role === 'associate') {
      // Shared associate accounts need to see all leads (or use filters to sort them)
      baseLeads = leads;
    }"""
new_visible_leads = """    } else if (role === 'associate') {
      // Shared associate accounts use subProfileId to isolate their view
      if (subProfileId) {
        baseLeads = leads.filter(l => relationId(l, 'assignedAssociate') === subProfileId);
      } else {
        baseLeads = leads;
      }
    }"""
if old_visible_leads in content:
    content = content.replace(old_visible_leads, new_visible_leads)
else:
    print("Could not update visible leads logic")

# 3. Add the Sub-Profile overlay/header UI
old_title_block = """                <h1 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '28px', color: BRAND.primary, margin: 0, textTransform: 'uppercase' }}>
                  {title}
                </h1>"""

sub_profile_ui = """                <h1 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '28px', color: BRAND.primary, margin: 0, textTransform: 'uppercase' }}>
                  {title}
                </h1>
                
                {role === 'associate' && (
                  <div style={{ marginLeft: '16px', display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 12px', backgroundColor: '#F0F8FF', borderRadius: '6px', border: `1px solid ${BRAND.accent}` }}>
                    <span style={{ fontSize: '13px', fontWeight: 600, color: BRAND.primary }}>Who is using this account?</span>
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
                      style={{ padding: '4px 8px', borderRadius: '4px', border: `1px solid ${BRAND.border}`, fontSize: '13px', color: BRAND.primary, fontWeight: 600 }}
                    >
                      <option value="">-- Select your profile --</option>
                      {assignableMembers.map(m => (
                        <option key={m.id} value={m.id}>{getMemberName(m.id)}</option>
                      ))}
                    </select>
                  </div>
                )}"""

if old_title_block in content:
    content = content.replace(old_title_block, sub_profile_ui)
else:
    print("Could not inject sub-profile UI")

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)
print("Applied sub-profile selector to leads-dashboard.tsx")
