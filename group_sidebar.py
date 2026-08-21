import os
import re

BUSINESS_DEV_UUID = "e4a2d8b5-31a9-467b-83c9-04d166cfa92a"
LOGISTICS_UUID = "f1b3e9c6-42b0-578c-94da-15e277dfb03b"

folder_template = """import {{ defineNavigationMenuItem, NavigationMenuItemType }} from 'twenty-sdk/define';

export default defineNavigationMenuItem({{
  universalIdentifier: '{uuid}',
  name: '{name}',
  icon: '{icon}',
  position: {position},
  type: NavigationMenuItemType.FOLDER,
}});
"""

# 1. Create Folders
os.makedirs('src/navigation-menu-items', exist_ok=True)
with open('src/navigation-menu-items/business-development-folder.navigation-menu-item.ts', 'w', encoding='utf-8') as f:
    f.write(folder_template.format(
        uuid=BUSINESS_DEV_UUID,
        name="Business Development",
        icon="IconBriefcase",
        position=10
    ))

with open('src/navigation-menu-items/logistics-folder.navigation-menu-item.ts', 'w', encoding='utf-8') as f:
    f.write(folder_template.format(
        uuid=LOGISTICS_UUID,
        name="Logistics",
        icon="IconTruck",
        position=20
    ))

print("Created folder definitions.")

# 2. Update existing items
biz_dev_files = [
    "leads-dashboard.navigation-menu-item.ts",
    "opportunity-dashboard.navigation-menu-item.ts",
    "quotation-dashboard.navigation-menu-item.ts",
    "contract-dashboard.navigation-menu-item.ts",
    "company-dashboard.navigation-menu-item.ts",
    "enquiry-dashboard.navigation-menu-item.ts",
    "lead-analytics.navigation-menu-item.ts",
    "intern-analytics.navigation-menu-item.ts"
]

logistics_files = [
    "sales-order-dashboard.navigation-menu-item.ts",
    "shipment-dashboard.navigation-menu-item.ts",
    "export-document-tracker.navigation-menu-item.ts",
    "lme-tracker.ts",  # Wait, standard objects don't usually have navigation menu items if they are native, but if they are custom, they might.
    # Ah, the list I grabbed earlier had 'lme-tracker.ts' but maybe not as a navigation item. Let's stick to .navigation-menu-item.ts files.
]

# Let's dynamically map based on file names
nav_dir = 'src/navigation-menu-items'
for filename in os.listdir(nav_dir):
    if not filename.endswith('.navigation-menu-item.ts'): continue
    if filename in ["business-development-folder.navigation-menu-item.ts", "logistics-folder.navigation-menu-item.ts"]:
        continue
    
    # Assign folder
    folder_uuid = None
    if any(k in filename for k in ['lead', 'opportunity', 'quotation', 'contract', 'company', 'enquiry', 'intern']):
        folder_uuid = BUSINESS_DEV_UUID
    elif any(k in filename for k in ['sales-order', 'shipment', 'export-document', 'product']):
        folder_uuid = LOGISTICS_UUID
    
    if not folder_uuid: continue

    filepath = os.path.join(nav_dir, filename)
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    if "folderUniversalIdentifier" not in content:
        # Find type: NavigationMenuItemType.PAGE_LAYOUT, or similar
        # Add folderUniversalIdentifier right after type or position
        match = re.search(r"type:\s*NavigationMenuItemType\.[A-Z_]+,", content)
        if match:
            insertion = f"\n  folderUniversalIdentifier: '{folder_uuid}',"
            content = content[:match.end()] + insertion + content[match.end():]
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f"Updated {filename} with folder {folder_uuid}")
        else:
            print(f"Could not find type definition in {filename}")

