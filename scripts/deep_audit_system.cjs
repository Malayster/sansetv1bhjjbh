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

console.log('=== 1. AUDIT ROUTE & NAVIGATION LINKS (CLIENT) ===');
const appJsx = fs.readFileSync('./client/src/App.jsx', 'utf8');
const routeMatches = [...appJsx.matchAll(/<Route\s+path=["']([^"']+)["']/g)].map(m => m[1]);
console.log('Registered Routes in App.jsx:', routeMatches);

const linkMatches = [];
for (const file of clientFiles) {
    if (!file.endsWith('.jsx') && !file.endsWith('.js')) continue;
    const content = fs.readFileSync(file, 'utf8');
    const toMatches = [...content.matchAll(/to=["']([^"']+)["']/g)];
    const navMatches = [...content.matchAll(/navigate\(["']([^"']+)["']/g)];
    const hrefMatches = [...content.matchAll(/href=["'](\/[^"'#?]*)["']/g)];
    
    [...toMatches, ...navMatches, ...hrefMatches].forEach(m => {
        const p = m[1].split('?')[0];
        if (p.startsWith('/') && !p.startsWith('//') && !p.startsWith('/api') && !p.startsWith('/cdn')) {
            linkMatches.push({ file: path.relative('.', file), path: p });
        }
    });
}

const brokenLinks = [];
for (const item of linkMatches) {
    // Check if path matches any registered route
    const exactOrParamMatch = routeMatches.some(r => {
        if (r === item.path) return true;
        if (r.includes(':')) {
            const rParts = r.split('/');
            const pParts = item.path.split('/');
            if (rParts.length !== pParts.length) return false;
            return rParts.every((part, i) => part.startsWith(':') || part === pParts[i]);
        }
        return false;
    });
    if (!exactOrParamMatch && item.path !== '*' && item.path !== '/') {
        brokenLinks.push(item);
    }
}
console.log('Found potentially broken/unmatched client links:', brokenLinks);

console.log('\n=== 2. AUDIT API ENDPOINT CALLS (CLIENT vs BACKEND) ===');
const apiCalls = [];
for (const file of clientFiles) {
    if (!file.endsWith('.jsx') && !file.endsWith('.js')) continue;
    const content = fs.readFileSync(file, 'utf8');
    // api.get, api.post, fetch, etc.
    const calls = [...content.matchAll(/(?:api\.(?:get|post|put|patch|delete)|fetch)\s*\(\s*[`'"](\/api\/v1\/[^`'"?]+)/g)];
    calls.forEach(c => {
        apiCalls.push({ file: path.relative('.', file), endpoint: c[1] });
    });
}

// Backend routes from api/src/routes and api/src/app.js
const backendFiles = walk('./api/src/routes');
backendFiles.push('./api/src/app.js');
const registeredEndpoints = [];
for (const file of backendFiles) {
    const content = fs.readFileSync(file, 'utf8');
    const matches = [...content.matchAll(/(?:router|app)\.(get|post|put|patch|delete)\s*\(\s*['"]([^'"]+)['"]/g)];
    const prefix = file.includes('adminRoutes') ? '/api/v1/admin' : 
                   file.includes('orderRoutes') ? '/api/v1/orders' : 
                   file.includes('productRoutes') ? '/api/v1/products' : 
                   file.includes('categoryRoutes') ? '/api/v1/categories' : 
                   file.includes('brandRoutes') ? '/api/v1/brands' : 
                   file.includes('paymentRoutes') ? '/api/v1/payment' : 
                   file.includes('pointsRoutes') ? '/api/v1/points' : 
                   file.includes('subscriptionRoutes') ? '/api/v1/subscriptions' : 
                   file.includes('settingsRoutes') ? '/api/v1/settings' : 
                   file.includes('uploadRoutes') ? '/api/v1/upload' : 
                   file.includes('notificationRoutes') ? '/api/v1/notifications' : 
                   file.includes('seoRoutes') ? '/api/v1/seo' : 
                   file.includes('enterpriseRoutes') ? '/api/v1/enterprise' : '';
    matches.forEach(m => {
        registeredEndpoints.push({ file: path.relative('.', file), method: m[1], route: prefix + (m[2] === '/' ? '' : m[2]) });
    });
}

console.log('Total client API call sites found:', apiCalls.length);
console.log('Registered backend endpoints found:', registeredEndpoints.length);

console.log('\n=== 3. AUDIT POTENTIAL AWKWARD / JANGGAL / UNRELATED TEXTS ===');
// Search for keywords that indicate awkward translation, leftover Turkish, weird honorifics, placeholder text
const awkwardPatterns = [
    /Yang berhormat/gi,
    /hazırlanıyor/gi,
    /beklemede/gi,
    /kargolandı/gi,
    /teslim edildi/gi,
    /iptal edildi/gi,
    /sepet/gi,
    /sipariş/gi,
    /ödeme/gi,
    /ürün/gi,
    /fatura/gi,
    /iade/gi,
    /Lorem ipsum/gi,
    /foo/gi,
    /bar/gi,
    /test\.com/gi,
    /example\.com/gi,
    /dummy/gi,
    /untitled/gi,
    /todo/gi,
    /FIXME/gi,
    /pembeli sayang/gi,
    /tuan hamba/gi,
    /saudara kandung/gi
];

const foundAwkward = [];
for (const file of [...clientFiles, ...apiFiles]) {
    if (file.includes('test') || file.includes('.json')) continue;
    const content = fs.readFileSync(file, 'utf8');
    const lines = content.split('\n');
    lines.forEach((line, idx) => {
        awkwardPatterns.forEach(pattern => {
            if (pattern.test(line)) {
                foundAwkward.push({ file: path.relative('.', file), line: idx + 1, text: line.trim() });
            }
        });
    });
}
console.log('Found awkward / test / weird occurrences:', foundAwkward.length);
foundAwkward.slice(0, 30).forEach(a => console.log(`[${a.file}:${a.line}] ${a.text}`));
