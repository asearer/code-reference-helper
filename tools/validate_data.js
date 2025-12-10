const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const dirs = fs.readdirSync(rootDir).filter(f => f.endsWith('-reference-helper') && fs.statSync(path.join(rootDir, f)).isDirectory());

const requiredFields = ['category', 'example', 'purpose', 'docs', 'tips'];
// 'element' OR 'command' is required.

let hasError = false;

console.log('Starting data validation...');

dirs.forEach(dir => {
    const dirPath = path.join(rootDir, dir);
    const files = fs.readdirSync(dirPath).filter(f => f.endsWith('-commands.json'));

    files.forEach(file => {
        const filePath = path.join(dirPath, file);
        console.log(`Validating ${file}...`);

        try {
            const content = fs.readFileSync(filePath, 'utf-8');
            const data = JSON.parse(content);

            if (!Array.isArray(data)) {
                console.error(`❌ [${file}] Root must be an array.`);
                hasError = true;
                return;
            }

            data.forEach((item, index) => {
                const identifier = item.element || item.command || item.property;
                if (!identifier) {
                    console.error(`❌ [${file} index ${index}] Missing 'element', 'command', or 'property'.`);
                    hasError = true;
                }

                requiredFields.forEach(field => {
                    if (!item[field]) {
                        console.error(`❌ [${file} item "${identifier}"] Missing field: ${field}`);
                        hasError = true;
                    }
                });
            });

        } catch (e) {
            console.error(`❌ [${file}] Failed to parse JSON: ${e.message}`);
            hasError = true;
        }
    });
});

if (hasError) {
    console.error('\n❌ Validation Failed.');
    process.exit(1);
} else {
    console.log('\n✅ All data files are valid.');
    process.exit(0);
}
