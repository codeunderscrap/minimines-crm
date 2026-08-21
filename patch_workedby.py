import os

path_dashboard = 'src/front-components/leads-dashboard.tsx'
with open(path_dashboard, 'r', encoding='utf-8') as f:
    content_d = f.read()

# Add fetchGraphQL and LeadWorkedbyEnum state
s_states = """  const [successMsg, setSuccessMsg] = useState<React.ReactNode>(null);"""
new_states = """  const [successMsg, setSuccessMsg] = useState<React.ReactNode>(null);
  const [workedbyOptions, setWorkedbyOptions] = useState<string[]>([]);

  const fetchGraphQL = async (query: string) => {
    try {
      const res = await fetch('https://minimines.twenty.com/graphql', {
        method: 'POST',
        headers: API_HEADERS,
        body: JSON.stringify({ query })
      });
      const json = await res.json();
      return json?.data;
    } catch {
      return null;
    }
  };"""
content_d = content_d.replace(s_states, new_states)

# Load options in loadData
s_loaddata = """      const [members, leadsData] = await Promise.all(["""
new_loaddata = """      const schemaQuery = `{ __type(name: "LeadWorkedbyEnum") { enumValues { name } } }`;
      const [members, leadsData, schema] = await Promise.all([
        fetchApi('workspaceMembers?limit=100'),
        fetchApi('leads?limit=1000'),
        fetchGraphQL(schemaQuery)
      ]);
      const opts = schema?.__type?.enumValues?.map((e: any) => e.name) || [];
      if (opts.length > 0) setWorkedbyOptions(opts);
"""
content_d = content_d.replace("      const [members, leadsData] = await Promise.all([\n        fetchApi('workspaceMembers?limit=100'),\n        fetchApi('leads?limit=1000'),\n      ]);", new_loaddata)

# Remove uniqueWorkedByNames
content_d = content_d.replace("const uniqueWorkedByNames = Array.from(new Set(leads.map(l => l.workedBy).filter(Boolean)));", "")

# Remove datalist
s_datalist = """        <datalist id="worked-by-list">
          {uniqueWorkedByNames.map((n: any) => <option key={n} value={n} />)}
        </datalist>"""
content_d = content_d.replace(s_datalist, "")

# Fix handleUpdateWorkedBy to use lowercase 'workedby'
s_handleupdate = "await fetchApi(`leads/${id}`, 'PATCH', { workedBy: val });"
content_d = content_d.replace(s_handleupdate, "await fetchApi(`leads/${id}`, 'PATCH', { workedby: val });")

# Replace input with select
s_input = """                    <input
                      list="worked-by-list"
                      defaultValue={lead.workedBy || ''}
                      onBlur={(e) => handleUpdateWorkedBy(lead.id, e.target.value)}
                      placeholder="Type name..."
                      style={{ padding: '6px', borderRadius: '4px', border: `1px solid ${BRAND.border}`, width: '100px', fontSize: '12px' }}
                    />"""

new_select = """                    <select
                      value={lead.workedby || ''}
                      onChange={(e) => handleUpdateWorkedBy(lead.id, e.target.value)}
                      style={{ padding: '4px', borderRadius: '4px', border: `1px solid ${BRAND.border}`, width: '110px', fontSize: '11px', backgroundColor: '#fff' }}
                    >
                      <option value="">- Select -</option>
                      {workedbyOptions.map(opt => <option key={opt} value={opt}>{opt.replace(/_/g, ' ')}</option>)}
                    </select>"""
content_d = content_d.replace(s_input, new_select)

with open(path_dashboard, 'w', encoding='utf-8') as f:
    f.write(content_d)


path_analytics = 'src/front-components/intern-analytics.tsx'
with open(path_analytics, 'r', encoding='utf-8') as f:
    content_a = f.read()

# Replace loadData
old_loaddata_a = """  useEffect(() => {
    const loadData = async () => {
      const leads = await fetchApi('leads?limit=1000');

      // Extract unique associate names from the 'workedBy' field
      const uniqueNames = Array.from(new Set(
        (Array.isArray(leads) ? leads : [])
          .map((l: any) => l.workedBy)
          .filter((name: string) => typeof name === 'string' && name.trim().length > 0)
      )) as string[];

      const data = uniqueNames.map(name => {
        const assignedLeads = leads.filter((l: any) => l.workedBy === name);"""

new_loaddata_a = """  useEffect(() => {
    const loadData = async () => {
      const schemaQuery = `{ __type(name: "LeadWorkedbyEnum") { enumValues { name } } }`;
      
      const fetchGraphQL = async (query: string) => {
        try {
          const res = await fetch('https://minimines.twenty.com/graphql', {
            method: 'POST',
            headers: { Authorization: API_KEY, 'Content-Type': 'application/json' },
            body: JSON.stringify({ query })
          });
          const json = await res.json();
          return json?.data;
        } catch {
          return null;
        }
      };

      const [leads, schema] = await Promise.all([
        fetchApi('leads?limit=1000'),
        fetchGraphQL(schemaQuery)
      ]);

      let uniqueNames = schema?.__type?.enumValues?.map((e: any) => e.name) || [];
      if (uniqueNames.length === 0) {
        // Fallback if enum fails
        uniqueNames = Array.from(new Set(
          (Array.isArray(leads) ? leads : [])
            .map((l: any) => l.workedby)
            .filter((name: string) => typeof name === 'string' && name.trim().length > 0)
        )) as string[];
      }

      const data = uniqueNames.map((name: string) => {
        const assignedLeads = leads.filter((l: any) => l.workedby === name);"""

content_a = content_a.replace(old_loaddata_a, new_loaddata_a)

with open(path_analytics, 'w', encoding='utf-8') as f:
    f.write(content_a)

print("Patched both files for lowercase 'workedby' and dynamic enum select")
