import os
import glob

# 1. Replace URL in all front components
files = glob.glob('src/front-components/*.tsx') + glob.glob('src/utils/*.tsx')
count = 0
for f in files:
    with open(f, 'r', encoding='utf-8') as file:
        content = file.read()
    
    if 'https://api.twenty.com/rest' in content:
        content = content.replace('https://api.twenty.com/rest', 'https://minimines.twenty.com/rest')
        with open(f, 'w', encoding='utf-8') as file:
            file.write(content)
        count += 1
print(f'Replaced URL in {count} files.')

# 2. Add error trap to main-page.tsx
main_path = 'src/front-components/main-page.tsx'
with open(main_path, 'r', encoding='utf-8') as file:
    main_content = file.read()

# Add error throw in fetchTwenty
old_fetch = '''  try {
    const res = await fetch(url, options);
    const json = await res.json();
    
    if (method !== 'GET') return json;'''
new_fetch = '''  try {
    const res = await fetch(url, options);
    const text = await res.text();
    let json;
    try { json = JSON.parse(text); } catch(e) { throw new Error('Invalid JSON: ' + text.substring(0, 50)); }
    
    if (!res.ok) {
      throw new Error('API ' + res.status + ': ' + (json.message || JSON.stringify(json)));
    }
    
    if (method !== 'GET') return json;'''

if old_fetch in main_content:
    main_content = main_content.replace(old_fetch, new_fetch)

# Add error catching in catch block
old_catch = '''  } catch (error) {
    console.error('Fetch error:', error);
    return method === 'GET' ? [] : null;
  }'''
new_catch = '''  } catch (error: any) {
    console.error('Fetch error:', error);
    return method === 'GET' ? { _errorMsg: error.message || String(error) } : null;
  }'''

if old_catch in main_content:
    main_content = main_content.replace(old_catch, new_catch)

# Add errorMsg state
if 'const [loading, setLoading] = useState(true);' in main_content and 'const [errorMsg, setErrorMsg]' not in main_content:
    main_content = main_content.replace(
        'const [loading, setLoading] = useState(true);',
        'const [loading, setLoading] = useState(true);\n  const [errorMsg, setErrorMsg] = useState<string | null>(null);'
    )

# Add error check in loadData
old_load = '''      setData({ contracts, salesOrders, exportShipments, opportunities, leads });
      setLoading(false);'''
new_load = '''      const errObj = [contracts, salesOrders, exportShipments, opportunities, leads].find((x: any) => x && x._errorMsg);
      if (errObj) {
        setErrorMsg((errObj as any)._errorMsg);
      } else {
        setData({ contracts: contracts as any, salesOrders: salesOrders as any, exportShipments: exportShipments as any, opportunities: opportunities as any, leads: leads as any });
      }
      setLoading(false);'''

if old_load in main_content:
    main_content = main_content.replace(old_load, new_load)

# Render error message
old_render = '''  if (loading) {
    return <div style={{ padding: '40px', fontFamily: "'Barlow', sans-serif" }}>Loading secure CRM data...</div>;
  }'''
new_render = '''  if (loading) {
    return <div style={{ padding: '40px', fontFamily: "'Barlow', sans-serif" }}>Loading secure CRM data...</div>;
  }

  if (errorMsg) {
    return <div style={{ padding: '40px', fontFamily: "'Barlow', sans-serif", color: 'red' }}>
      <h1>Dashboard Error: Network/API Blocked</h1>
      <pre style={{ whiteSpace: 'pre-wrap' }}>{errorMsg}</pre>
    </div>;
  }'''

if old_render in main_content:
    main_content = main_content.replace(old_render, new_render)

# Update version
main_content = main_content.replace('[v3]', '[v4]')

with open(main_path, 'w', encoding='utf-8') as file:
    file.write(main_content)

print('Updated main-page.tsx error handling.')
