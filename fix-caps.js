const fs = require('fs');
const path = require('path');

const objectsDir = path.join(__dirname, 'src', 'objects');
const files = fs.readdirSync(objectsDir);

files.forEach(file => {
  if (!file.endsWith('.ts')) return;
  const filePath = path.join(objectsDir, file);
  let content = fs.readFileSync(filePath, 'utf8');

  // Regex to lowercase the first letter of nameSingular and namePlural
  content = content.replace(/nameSingular:\s*'([A-Z])([^']*)'/, (match, p1, p2) => {
    return `nameSingular: '${p1.toLowerCase()}${p2}'`;
  });

  content = content.replace(/namePlural:\s*'([A-Z])([^']*)'/, (match, p1, p2) => {
    return `namePlural: '${p1.toLowerCase()}${p2}'`;
  });

  fs.writeFileSync(filePath, content);
  console.log(`Lowercased names in ${file}`);
});
