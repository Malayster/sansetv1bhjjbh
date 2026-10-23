const fs = require('fs');
const path = require('path');
const babel = require('@babel/parser');
const traverse = require('@babel/traverse').default;

function walk(dir) {
    let results = [];
    if (!fs.existsSync(dir)) return results;
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) {
            if (!file.includes('node_modules') && !file.includes('.git') && !file.includes('dist')) {
                results = results.concat(walk(file));
            }
        } else if (file.endsWith('.jsx') || file.endsWith('.js')) {
            results.push(file);
        }
    });
    return results;
}

const files = walk('./client/src');
console.log(`Checking ${files.length} client files for undeclared global variables...`);

const KNOWN_GLOBALS = new Set([
    'window', 'document', 'navigator', 'localStorage', 'sessionStorage', 'console',
    'fetch', 'setTimeout', 'clearTimeout', 'setInterval', 'clearInterval', 'alert',
    'confirm', 'prompt', 'location', 'history', 'URL', 'URLSearchParams', 'FormData',
    'Blob', 'File', 'FileReader', 'Image', 'Audio', 'Date', 'Math', 'JSON', 'Number',
    'String', 'Boolean', 'Array', 'Object', 'RegExp', 'Error', 'Promise', 'Map',
    'Set', 'WeakMap', 'WeakSet', 'Symbol', 'Proxy', 'Reflect', 'parseInt', 'parseFloat',
    'isNaN', 'isFinite', 'encodeURI', 'encodeURIComponent', 'decodeURI', 'decodeURIComponent',
    'crypto', 'btoa', 'atob', 'requestAnimationFrame', 'cancelAnimationFrame', 'Event',
    'CustomEvent', 'ResizeObserver', 'IntersectionObserver', 'MutationObserver',
    'HTMLElement', 'Element', 'Node', 'process', 'globalThis', 'import', 'undefined'
]);

const undeclaredReport = [];

for (const f of files) {
    const code = fs.readFileSync(f, 'utf8');
    try {
        const ast = babel.parse(code, {
            sourceType: 'module',
            plugins: ['jsx']
        });

        traverse(ast, {
            Program(progPath) {
                const globalScope = progPath.scope;
                progPath.traverse({
                    ReferencedIdentifier(identPath) {
                        const name = identPath.node.name;
                        if (KNOWN_GLOBALS.has(name)) return;
                        if (name.startsWith('React')) return;
                        // check if binding exists in any parent scope
                        if (!identPath.scope.hasBinding(name)) {
                            // ignore JSX member expressions like Foo.Bar where Foo is bound
                            undeclaredReport.push({
                                file: path.relative('.', f),
                                line: identPath.node.loc?.start?.line,
                                name
                            });
                        }
                    }
                });
            }
        });
    } catch (e) {
        // syntax error in parse
        console.error(`Parse error in ${f}:`, e.message);
    }
}

console.log(`\nFound ${undeclaredReport.length} undeclared variable references:`);
undeclaredReport.forEach(u => console.log(`[${u.file}:${u.line}] Undeclared: '${u.name}'`));
