const fs = require('fs');
const path = require('path');

const objectsDir = path.join(__dirname, 'src', 'objects');
const files = fs.readdirSync(objectsDir);

files.forEach(file => {
  if (!file.endsWith('.ts')) return;
  const filePath = path.join(objectsDir, file);
  let content = fs.readFileSync(filePath, 'utf8');

  // Replace { position: N, label: '...' } with { position: N, color: 'green', label: '...' }
  content = content.replace(/\{\s*position:\s*(\d+),\s*label:/g, "{ position: $1, color: 'green', label:");

  fs.writeFileSync(filePath, content);
  console.log(`Added color to ${file}`);
});
