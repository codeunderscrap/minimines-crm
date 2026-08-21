import os

def apply_fix(filename, state_var, id_field_name, set_state_var, item_name):
    path = f'src/front-components/{filename}'
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()

    search_logic = f"""
  // Auto-filtering based on query parameters from Company Dashboard
  useEffect(() => {{
    const params = new URLSearchParams(window.location.search);
    const highlightId = params.get('id');
    
    if (highlightId && {state_var}.length > 0) {{
      {set_state_var}(new Set([highlightId]));
      setTimeout(() => {{
        const el = document.getElementById(`{item_name}-row-${{highlightId}}`);
        if (el) el.scrollIntoView({{ behavior: 'smooth', block: 'center' }});
      }}, 500);
    }}
  }}, [{state_var}]);
"""
    if 'URLSearchParams' not in content:
        content = content.replace('useEffect(() => { loadData(); }, []);', 'useEffect(() => { loadData(); }, []);\\n' + search_logic)
        
    key_str = f'key={{{item_name}.id}}'
    if f'id={{`{item_name}-row-${{{item_name}.id}}`}}' not in content:
        content = content.replace(key_str, f'{key_str} id={{`{item_name}-row-${{{item_name}.id}}`}}')

    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)

apply_fix('leads-dashboard.tsx', 'leads', 'lead', 'setSelectedLeadIds', 'lead')
apply_fix('contract-dashboard.tsx', 'contracts', 'contract', 'setSelectedContractIds', 'contract')
apply_fix('opportunity-dashboard.tsx', 'opportunities', 'opp', 'setSelectedOppIds', 'opp')
apply_fix('shipment-dashboard.tsx', 'shipments', 'shipment', 'setSelectedShipmentIds', 'shipment')
