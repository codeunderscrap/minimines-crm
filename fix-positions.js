const fs = require('fs');
const path = require('path');

const objectsDir = path.join(__dirname, 'src', 'objects');
const files = fs.readdirSync(objectsDir);

files.forEach(file => {
  if (!file.endsWith('.ts')) return;
  const filePath = path.join(objectsDir, file);
  let content = fs.readFileSync(filePath, 'utf8');

  // We want to add `position: index, ` to each option object if it doesn't exist
  // We can just regex replace the options array.
  
  // A quick trick: just replace `{ label: ` with `{ position: 0, label: ` manually since we only have a few options, but we need incrementing positions.
  
  // Let's use a replacer function for options arrays
  content = content.replace(/options:\s*\[([\s\S]*?)\]/g, (match, optionsStr) => {
    let position = 0;
    const newOptionsStr = optionsStr.replace(/\{\s*label:/g, () => {
      return `{ position: ${position++}, label:`;
    });
    return `options: [${newOptionsStr}]`;
  });

  fs.writeFileSync(filePath, content);
  console.log(`Added positions to ${file}`);
});
