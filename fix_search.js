const fs = require('fs');
let code = fs.readFileSync('js/search.js', 'utf8');

// The file contains literal double-backslash single-quote sequences.
// We must replace all cases of \\' with \'
code = code.replace(/\\\\'/g, "\\'");

fs.writeFileSync('js/search.js', code);

try {
  require('child_process').execSync('node -c js/search.js');
  console.log('SYNTAX CHECK PASSED!');
} catch(e) {
  console.error('SYNTAX CHECK FAILED:');
}
