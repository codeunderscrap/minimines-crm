import os

path = 'src/front-components/leads-dashboard.tsx'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. State change
content = content.replace(
    "const [filterMemberId, setFilterMemberId] = useState('');",
    "const [filterWorkedBy, setFilterWorkedBy] = useState('');"
)

# 2. Logic change
s_keep = """      if (filterMemberId) {
        keep = keep && (relationId(l, 'assignedAssociate') === filterMemberId || relationId(l, 'assignedManagerPrimary') === filterMemberId);
      }"""
new_keep = """      if (filterWorkedBy) {
        keep = keep && l.workedby === filterWorkedBy;
      }"""
content = content.replace(s_keep, new_keep)

# 3. Dependencies
content = content.replace("filterMemberId]);", "filterWorkedBy]);")

# 4. Remove {role !== 'associate' && ( condition for the filter and replace dropdown
s_select = """              {role !== 'associate' && (
                <select 
                  value={filterMemberId}
                  onChange={(e) => setFilterMemberId(e.target.value)}
                  style={{ padding: '8px 12px', borderRadius: '4px', border: `1px solid ${BRAND.border}`, fontSize: '13px', minWidth: '180px' }}
                >
                  <option value="">-- Filter by Associate --</option>
                  {assignableMembers.map(m => (
                    <option key={m.id} value={m.id}>{getMemberName(m.id)}</option>
                  ))}
                </select>
              )}"""
new_select = """              <select 
                value={filterWorkedBy}
                onChange={(e) => setFilterWorkedBy(e.target.value)}
                style={{ padding: '8px 12px', borderRadius: '4px', border: `1px solid ${BRAND.border}`, fontSize: '13px', minWidth: '180px' }}
              >
                <option value="">-- Filter by Associate --</option>
                {workedbyOptions.map(opt => (
                  <option key={opt} value={opt}>{opt.replace(/_/g, ' ')}</option>
                ))}
              </select>"""
content = content.replace(s_select, new_select)

# 5. Inject hardcoded options if missing from GraphQL
s_loaddata = """      const opts = schema?.__type?.enumValues?.map((e: any) => e.name) || [];
      if (opts.length > 0) setWorkedbyOptions(opts);"""
new_loaddata = """      let opts = schema?.__type?.enumValues?.map((e: any) => e.name) || [];
      
      const defaultOpts = ['ABDUL_KHALID', 'RAKESH', 'KUMAR', 'PRASHANTH'];
      if (opts.length === 0) opts = defaultOpts;
      else {
        defaultOpts.forEach(d => {
          if (!opts.includes(d)) opts.push(d);
        });
      }
      setWorkedbyOptions(opts);"""
content = content.replace(s_loaddata, new_loaddata)

# 6. Lock the inline workedby select for associates
s_inline_select = """                    <select
                      value={lead.workedby || ''}
                      onChange={(e) => handleUpdateWorkedBy(lead.id, e.target.value)}
                      style={{ padding: '4px', borderRadius: '4px', border: `1px solid ${BRAND.border}`, width: '110px', fontSize: '11px', backgroundColor: '#fff' }}
                    >"""
new_inline_select = """                    <select
                      value={lead.workedby || ''}
                      onChange={(e) => handleUpdateWorkedBy(lead.id, e.target.value)}
                      disabled={isUpdating || (role === 'associate' && !!lead.workedby)}
                      style={{ 
                        padding: '4px', borderRadius: '4px', border: `1px solid ${BRAND.border}`, width: '110px', fontSize: '11px', backgroundColor: '#fff',
                        opacity: (role === 'associate' && !!lead.workedby) ? 0.6 : 1,
                        cursor: (role === 'associate' && !!lead.workedby) ? 'not-allowed' : 'pointer'
                      }}
                    >"""
content = content.replace(s_inline_select, new_inline_select)


with open(path, 'w', encoding='utf-8') as f:
    f.write(content)

print("Patched leads dashboard filter and locks")
