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
        } else if (file.endsWith('.jsx') || file.endsWith('.js') || file.endsWith('.html') || file.endsWith('.json')) {
            results.push(file);
        }
    });
    return results;
}

const files = [...walk('./client/src'), ...walk('./api/src')];

console.log('=== AUDITING COMMUNICATIONS, STRINGS & CONTENT ===');

// Check for phone numbers
const phones = new Map();
// Check for emails
const emails = new Map();
// Check for Turkish words
const turkishWords = [
    'sepet', 'siparis', 'ödeme', 'kargo', 'ürün', 'iade', 'fatura', 'hakkımızda',
    'iletişim', 'teslimat', 'müşteri', 'ayarlar', 'indirim', 'özellik', 'kampanya',
    'giriş', 'çıkış', 'güncelle', 'kaydet', 'sil', 'ekle', 'seçiniz', 'lütfen',
    'başarılı', 'başarısız', 'hata', 'beklemede', 'hazırlanıyor', 'kargolandı',
    'tamamlandı', 'iptal'
];
const turkishOccurrences = [];

// Check for old payment providers shown in UI
const oldProviders = ['iyzico', 'paytr', 'param'];
const providerOccurrences = [];

// Check for awkward Malay phrases
const awkwardPhrases = [
    'Yang berhormat',
    'tuan hamba',
    'hamba sahaya',
    'saudara kandung',
    'pembeli sayang',
    'wang pos'
];
const awkwardOccurrences = [];

const phoneRegex = /(?:\+?60|0)[1-9][0-9]-?[0-9]{7,8}/g;
const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;

for (const file of files) {
    if (file.includes('test') || file.includes('check_') || file.includes('audit_')) continue;
    const content = fs.readFileSync(file, 'utf8');
    const lines = content.split('\n');

    lines.forEach((line, idx) => {
        // Phones
        const matchedPhones = line.match(phoneRegex);
        if (matchedPhones) {
            matchedPhones.forEach(p => {
                if (!phones.has(p)) phones.set(p, []);
                phones.get(p).push(`${path.relative('.', file)}:${idx + 1}`);
            });
        }

        // Emails
        const matchedEmails = line.match(emailRegex);
        if (matchedEmails) {
            matchedEmails.forEach(e => {
                if (!emails.has(e)) emails.set(e, []);
                emails.get(e).push(`${path.relative('.', file)}:${idx + 1}`);
            });
        }

        // Turkish
        const lowerLine = line.toLowerCase();
        turkishWords.forEach(tw => {
            // Check word boundary or substring in non-comment/non-prisma
            const re = new RegExp(`\\b${tw}\\b`, 'i');
            if (re.test(line)) {
                // Ignore prisma model names or db column names if they are code
                if (!line.includes('prisma.') && !line.includes('model ') && !line.includes('db.prepare')) {
                    turkishOccurrences.push({ file: path.relative('.', file), line: idx + 1, word: tw, text: line.trim() });
                }
            }
        });

        // Awkward
        awkwardPhrases.forEach(ap => {
            if (line.includes(ap)) {
                awkwardOccurrences.push({ file: path.relative('.', file), line: idx + 1, phrase: ap, text: line.trim() });
            }
        });
    });
}

console.log('\n--- PHONE NUMBERS FOUND IN CODEBASE ---');
for (const [phone, locations] of phones.entries()) {
    console.log(`Phone: ${phone} (in ${locations.length} places, e.g. ${locations[0]})`);
}

console.log('\n--- EMAILS FOUND IN CODEBASE ---');
for (const [email, locations] of emails.entries()) {
    console.log(`Email: ${email} (in ${locations.length} places, e.g. ${locations[0]})`);
}

console.log('\n--- AWKWARD PHRASES FOUND ---');
awkwardOccurrences.forEach(o => console.log(`[${o.file}:${o.line}] "${o.phrase}": ${o.text}`));

console.log('\n--- TURKISH WORDS IN NON-DB CODE --- (Sample top 25)');
turkishOccurrences.slice(0, 25).forEach(o => console.log(`[${o.file}:${o.line}] "${o.word}": ${o.text}`));
