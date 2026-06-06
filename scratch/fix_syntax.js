const fs = require('fs');
let content = fs.readFileSync('src/components/TastePay.tsx', 'utf-8');

// Fix the mangled translation strings
content = content.replace(/t\('\{t\('([^']+)'\)\}'\)/g, "t('$1')");
content = content.replace(/t\('\{t\('([^']+)'\)\} \+ '\)/g, "t('$1') + ");

fs.writeFileSync('src/components/TastePay.tsx', content, 'utf-8');
console.log('Fixed syntax errors');
