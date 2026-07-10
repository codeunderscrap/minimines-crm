const { spawn } = require('child_process');

const p = spawn('yarn.cmd', ['twenty', 'dev:add', 'object', 'Demo'], { shell: true });

p.stdout.on('data', (data) => {
  const str = data.toString();
  console.log('OUT:', str);
  if (str.includes('Enter a name singular')) {
    p.stdin.write('Demo\n');
  } else if (str.includes('Enter a name plural')) {
    p.stdin.write('Demos\n');
  } else if (str.includes('Enter a label singular')) {
    p.stdin.write('Demo\n');
  } else if (str.includes('Enter a label plural')) {
    p.stdin.write('Demos\n');
  } else if (str.includes('Enter a description')) {
    p.stdin.write('Demo description\n');
  } else if (str.includes('Select an icon')) {
    p.stdin.write('\n'); // Select first icon
  }
});

p.stderr.on('data', (data) => {
  console.error('ERR:', data.toString());
});

p.on('close', (code) => {
  console.log(`Process exited with code ${code}`);
});
