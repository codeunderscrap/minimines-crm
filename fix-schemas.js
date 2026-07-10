const fs = require('fs');
const crypto = require('crypto');
const path = require('path');

const objectsDir = path.join(__dirname, 'src', 'objects');
const files = fs.readdirSync(objectsDir).filter(f => !f.includes('demo'));

files.forEach(file => {
  const filePath = path.join(objectsDir, file);
  let content = fs.readFileSync(filePath, 'utf8');

  // Strip defineField( and trailing )
  content = content.replace(/defineField\(\{/g, '{');
  // the closing parenthesis of defineField({ ... }) is harder with regex, but since we know it ends with })
  content = content.replace(/\}\)/g, '}');

  // We need to inject labelIdentifierFieldMetadataUniversalIdentifier.
  // We'll extract the UUID of the 'name' field and insert it.
  const nameUuidMatch = content.match(/universalIdentifier:\s*'([^']+)',\s*name:\s*'name'/);
  
  if (nameUuidMatch && !content.includes('labelIdentifierFieldMetadataUniversalIdentifier')) {
    const nameUuid = nameUuidMatch[1];
    content = content.replace(
      /description:\s*'[^']+',/,
      `$& \n  labelIdentifierFieldMetadataUniversalIdentifier: '${nameUuid}',`
    );
  }

  // Also Twenty expects 'icon' field
  if (!content.includes("icon: 'IconBox'")) {
    content = content.replace(
      /description:\s*'[^']+',/,
      `$& \n  icon: 'IconBox',`
    );
  }

  fs.writeFileSync(filePath, content);
  console.log(`Fixed ${file}`);
});
