const fs = require('fs');
const path = require('path');

function walk(dir) {
    let results = [];
    if (!fs.existsSync(dir)) return results;
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) {
            if (!file.includes('node_modules') && !file.includes('.git') && !file.includes('dist') && !file.includes('generated')) {
                results = results.concat(walk(file));
            }
        } else {
            results.push(file);
        }
    });
    return results;
}

const clientFiles = walk('./client/src');
const apiFiles = walk('./api/src');

// 1. Collect all API endpoints called in client
const clientApiEndpoints = new Set();
const clientEndpointDetails = [];

for (const file of clientFiles) {
    if (!file.endsWith('.jsx') && !file.endsWith('.js')) continue;
    const content = fs.readFileSync(file, 'utf8');
    const regex = /(?:api\.(?:get|post|put|patch|delete)|fetch)\s*\(\s*[`'"](?:\$\{API\}|\$\{getApiUrl\(\)\})?(\/api\/v1\/[^`'"?]+)/g;
    let match;
    while ((match = regex.exec(content)) !== null) {
        clientApiEndpoints.add(match[1]);
        clientEndpointDetails.push({ file: path.relative('.', file), endpoint: match[1] });
    }
}

// 2. Collect all backend endpoints
// Look in api/src/routes/*.js and api/src/app.js
const routeFiles = fs.readdirSync('./api/src/routes').filter(f => f.endsWith('.js'));
const backendEndpoints = [];

for (const rf of routeFiles) {
    const fullPath = path.join('./api/src/routes', rf);
    const content = fs.readFileSync(fullPath, 'utf8');
    // find prefix in app.js
    let prefix = '';
    if (rf === 'adminRoutes.js') prefix = '/api/v1/admin';
    else if (rf === 'orderRoutes.js') prefix = '/api/v1/orders';
    else if (rf === 'productRoutes.js') prefix = '/api/v1/products';
    else if (rf === 'categoryRoutes.js') prefix = '/api/v1/categories';
    else if (rf === 'brandRoutes.js') prefix = '/api/v1/brands';
    else if (rf === 'paymentRoutes.js') prefix = '/api/v1/payment';
    else if (rf === 'pointsRoutes.js') prefix = '/api/v1/points';
    else if (rf === 'subscriptionRoutes.js') prefix = '/api/v1/subscriptions';
    else if (rf === 'settingsRoutes.js') prefix = '/api/v1/settings';
    else if (rf === 'uploadRoutes.js') prefix = '/api/v1/upload';
    else if (rf === 'notificationRoutes.js') prefix = '/api/v1/notifications';
    else if (rf === 'seoRoutes.js') prefix = '/api/v1/seo';
    else if (rf === 'enterpriseRoutes.js') prefix = '/api/v1/enterprise';
    else if (rf === 'returnRoutes.js') prefix = '/api/v1/returns';
    else if (rf === 'easyParcelCallback.js') prefix = '/api/v1/easyparcel';

    const rMatches = [...content.matchAll(/(?:router|app)\.(get|post|put|patch|delete)\s*\(\s*['"]([^'"]+)['"]/g)];
    rMatches.forEach(m => {
        let sub = m[2];
        if (sub === '/') sub = '';
        backendEndpoints.push({
            method: m[1].toUpperCase(),
            endpoint: prefix + sub,
            file: rf
        });
    });
}

// Check which clientApiEndpoints do NOT match any backend endpoint
console.log('=== CLIENT ENDPOINTS NOT FOUND IN BACKEND ===');
const missingEndpoints = [];
for (const endpoint of clientApiEndpoints) {
    // Check if endpoint matches directly or with param (e.g. /:id)
    const found = backendEndpoints.some(be => {
        const beParts = be.endpoint.split('/');
        const ceParts = endpoint.split('/');
        if (beParts.length !== ceParts.length) return false;
        return beParts.every((part, i) => part.startsWith(':') || part === ceParts[i]);
    });
    if (!found) {
        missingEndpoints.push(endpoint);
        const callers = clientEndpointDetails.filter(d => d.endpoint === endpoint).map(d => d.file);
        console.log(`❌ Missing: ${endpoint} (called in: ${[...new Set(callers)].join(', ')})`);
    }
}
