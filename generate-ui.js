const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const objects = [
  {
    name: 'contract',
    label: 'Contract',
    objectId: '651890c3-6208-429c-8e72-3e99adeb480e'
  },
  {
    name: 'sales-order',
    objectName: 'salesOrder',
    label: 'Sales Order',
    objectId: '6eb74c1e-bb61-4a12-ba76-849c9db2c3d0'
  },
  {
    name: 'export-shipment',
    objectName: 'exportShipment',
    label: 'Export Shipment',
    objectId: '04acd819-f079-4dde-b36d-1eb14b47167d'
  },
  {
    name: 'lme-tracker',
    objectName: 'lmeTracker',
    label: 'LME Tracker',
    objectId: '03987302-22c9-4308-a280-e16738c722af'
  }
];

const demoObjectId = 'b93b6468-40b4-4555-9541-d59a854c46da';

function replaceUUIDs(content) {
  // Replace all UUIDs in the content with fresh ones (except the objectId which we'll handle manually)
  const uuidRegex = /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/g;
  let matches = content.match(uuidRegex) || [];
  let replacements = {};
  
  matches.forEach(m => {
    if (m === demoObjectId) return; // Keep object ID so we can replace it explicitly
    // keep applicationUniversalIdentifier if present
    if (m === 'b4c9e8d1-72f3-4a1d-9e6b-3c5d8a2f1b4c') return;
    // keep field metadata ids from demo? No, we need fresh ones or it's fine, it will generate random UUIDs for view fields.
    if (!replacements[m]) {
      replacements[m] = crypto.randomUUID();
    }
  });

  for (const [oldId, newId] of Object.entries(replacements)) {
    content = content.split(oldId).join(newId);
  }
  return content;
}

// Read templates
const navTemplate = fs.readFileSync(path.join(__dirname, 'src', 'navigation-menu-items', 'demo.ts'), 'utf8');
const allViewTemplate = fs.readFileSync(path.join(__dirname, 'src', 'views', 'all-demo.ts'), 'utf8');
const fieldsViewTemplate = fs.readFileSync(path.join(__dirname, 'src', 'views', 'demo-record-page-fields.ts'), 'utf8');
const pageLayoutTemplate = fs.readFileSync(path.join(__dirname, 'src', 'page-layouts', 'demo-record-page-layout.ts'), 'utf8');

// Generate for each object
objects.forEach((obj, idx) => {
  const objName = obj.objectName || obj.name;
  
  // 1. Navigation Menu Item
  let navContent = replaceUUIDs(navTemplate);
  navContent = navContent.split(demoObjectId).join(obj.objectId);
  navContent = navContent.split("'demo'").join(`'${objName}'`);
  navContent = navContent.split('position: 0').join(`position: ${idx + 1}`);
  fs.writeFileSync(path.join(__dirname, 'src', 'navigation-menu-items', `${obj.name}.ts`), navContent);

  // 2. all-[name] view
  let allViewContent = replaceUUIDs(allViewTemplate);
  allViewContent = allViewContent.split(demoObjectId).join(obj.objectId);
  allViewContent = allViewContent.split("'all-demo'").join(`'all-${obj.name}'`);
  
  // IMPORTANT: For all-view, we MUST use the correct labelIdentifierFieldMetadataUniversalIdentifier of the object
  // But wait, the demo view fields just use generateDefaultFieldUniversalIdentifier, or a hardcoded one.
  // Actually, we can just clear the fields array in the all-view so it's empty, and Twenty will fall back to defaults, 
  // OR we can leave the random UUID for the fieldMetadata (which might error if it doesn't exist).
  // It's safer to clear the fields array: `fields: []`
  allViewContent = allViewContent.replace(/fields:\s*\[[\s\S]*?\],/, 'fields: [],');
  fs.writeFileSync(path.join(__dirname, 'src', 'views', `all-${obj.name}.ts`), allViewContent);

  // 3. record-page-fields view
  let fieldsViewContent = replaceUUIDs(fieldsViewTemplate);
  fieldsViewContent = fieldsViewContent.split(demoObjectId).join(obj.objectId);
  fieldsViewContent = fieldsViewContent.split("'demo-record-page-fields'").join(`'${obj.name}-record-page-fields'`);
  // Same here, clear the fields array so we don't reference invalid fieldMetadataUniversalIdentifiers
  fieldsViewContent = fieldsViewContent.replace(/fields:\s*\[[\s\S]*?\],/, 'fields: [],');
  
  // Wait, we need to extract the new View UUID so we can link it in the page layout!
  // The universalIdentifier is the first UUID in the file (after replacing).
  const viewIdMatch = fieldsViewContent.match(/universalIdentifier:\s*'([^']+)'/);
  const newFieldsViewId = viewIdMatch ? viewIdMatch[1] : crypto.randomUUID();
  fs.writeFileSync(path.join(__dirname, 'src', 'views', `${obj.name}-record-page-fields.ts`), fieldsViewContent);

  // 4. page-layout
  let layoutContent = replaceUUIDs(pageLayoutTemplate);
  layoutContent = layoutContent.split(demoObjectId).join(obj.objectId);
  layoutContent = layoutContent.split("'Default Demos Layout'").join(`'Default ${obj.label}s Layout'`);
  // Link the fields view
  // The template has: viewUniversalIdentifier: 'bcf5b650-7dad-4438-a78f-21a006d8028c'
  // But we ran replaceUUIDs, so it got replaced by something else. Let's replace whatever it became with newFieldsViewId.
  layoutContent = layoutContent.replace(/viewUniversalIdentifier:\s*'[^']+'/, `viewUniversalIdentifier: '${newFieldsViewId}'`);
  fs.writeFileSync(path.join(__dirname, 'src', 'page-layouts', `${obj.name}-record-page-layout.ts`), layoutContent);

  console.log(`Generated UI files for ${obj.name}`);
});

