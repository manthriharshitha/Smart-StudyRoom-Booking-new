const fs = require('fs');
const path = require('path');

const apiUrl = process.env.API_URL || process.env.VITE_API_URL || 'http://localhost:4000/api';
const envFile = path.join(__dirname, '..', 'src', 'environments', 'environment.prod.ts');

const content = `export const environment = {
  production: true,
  apiUrl: '${apiUrl}'
};
`;

fs.writeFileSync(envFile, content, { encoding: 'utf8' });
console.log('[set-env] Wrote', envFile, 'with apiUrl=', apiUrl);
