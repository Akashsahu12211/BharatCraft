const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const dirs = [
  'C:/Users/abhis/OneDrive/Desktop/BharatCart/pages',
  'C:/Users/abhis/OneDrive/Desktop/BharatCart/js'
];

let fixedFiles = 0;

for (const dir of dirs) {
  if (!fs.existsSync(dir)) continue;
  const files = fs.readdirSync(dir).filter(f => f.endsWith('.js'));
  
  for (const f of files) {
    const fp = path.join(dir, f);
    let code = fs.readFileSync(fp, 'utf8');
    
    // Unescape backticks and string interpolation brackets globally
    let originalCode = code;
    code = code.replace(/\\`/g, '`');
    code = code.replace(/\\\$\{/g, '${');
    
    if (code !== originalCode) {
      fs.writeFileSync(fp, code);
      console.log(`Repaired syntax escapes in: ${dir}/${f}`);
      fixedFiles++;
    }
  }
}

console.log(`Successfully repaired escapes in ${fixedFiles} files!`);

// Re-verify syntax globally
console.log('Validating Runtime Node Syntax...');
for (const dir of dirs) {
  if (!fs.existsSync(dir)) continue;
  const files = fs.readdirSync(dir).filter(f => f.endsWith('.js'));
  
  for (const f of files) {
    try {
      execSync(`node -c "${path.join(dir, f)}"`);
    } catch (e) {
      console.error(`ERROR STILL EXISTS IN: ${dir}/${f}`);
    }
  }
}
console.log('Validation Sweep Complete!');
