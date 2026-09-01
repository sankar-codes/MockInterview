import fs from 'fs';

// Remove firebase from package.json
let pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
delete pkg.dependencies['firebase'];
fs.writeFileSync('package.json', JSON.stringify(pkg, null, 2));

console.log('Removed firebase from package.json');
