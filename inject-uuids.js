const fs = require('fs');
const crypto = require('crypto');
const path = require('path');

const objectsDir = path.join(__dirname, 'src', 'objects');
const files = fs.readdirSync(objectsDir).filter(f => f.endsWith('.ts'));

files.forEach(file => {
  const filePath = path.join(objectsDir, file);
  let content = fs.readFileSync(filePath, 'utf8');

  // Inject universalIdentifier to defineObject
  if (!content.includes('universalIdentifier:')) {
    content = content.replace(
      /defineObject\(\{/,
      `defineObject({\n  universalIdentifier: '${crypto.randomUUID()}',`
    );

    // Inject universalIdentifier to defineField
    content = content.replace(/defineField\(\{/g, () => {
      return `defineField({ universalIdentifier: '${crypto.randomUUID()}',`;
    });

    fs.writeFileSync(filePath, content);
    console.log(`Injected UUIDs into ${file}`);
  }
});
