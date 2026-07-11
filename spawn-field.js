const { spawn } = require('child_process');
const fs = require('fs');

const p = spawn('yarn.cmd', ['twenty', 'dev:add', 'field', 'Demo'], { shell: true });

p.stdout.on('data', (data) => {
  const str = data.toString();
  console.log('OUT:', str);
  if (str.includes('Select a field type')) {
    // Select type is usually down a bit, let's type 'select' maybe?
    p.stdin.write('select\n');
  } else if (str.includes('Enter a name for your field')) {
    p.stdin.write('mySelect\n');
  } else if (str.includes('Enter a label for your field')) {
    p.stdin.write('My Select\n');
  } else if (str.includes('Enter a description')) {
    p.stdin.write('Test select\n');
  } else if (str.includes('Select an icon')) {
    p.stdin.write('\n');
  } else if (str.includes('Add an option?')) {
    // To add the first option
    p.stdin.write('Y\n');
  } else if (str.includes('Enter option label')) {
    p.stdin.write('Option A\n');
  } else if (str.includes('Enter option value')) {
    p.stdin.write('OPT_A\n');
  } else if (str.includes('Select option color')) {
    p.stdin.write('\n'); // Pick first color
  } else if (str.includes('Add another option?')) {
    // Stop after 1 option
    p.stdin.write('n\n');
  }
});

p.stderr.on('data', (data) => {
  console.error('ERR:', data.toString());
});

p.on('close', (code) => {
  console.log(`Process exited with code ${code}`);
  console.log(fs.readFileSync('./src/objects/demo.ts', 'utf8'));
});
