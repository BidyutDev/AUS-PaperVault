const fs = require('fs');
const path = require('path');

const cssDir = path.join(__dirname, 'src');

const replacements = [
  // Lavender accent: rgba(175, 179, 247, X) -> rgba(var(--color-vault-lavender-rgb), X)
  { regex: /rgba\(\s*175\s*,\s*179\s*,\s*247\s*,\s*([0-9.]+)\s*\)/g, replace: 'rgba(var(--color-vault-lavender-rgb), $1)' },
  
  // Danger red: rgba(248, 113, 113, X) -> rgba(var(--color-vault-danger-rgb), X)
  { regex: /rgba\(\s*248\s*,\s*113\s*,\s*113\s*,\s*([0-9.]+)\s*\)/g, replace: 'rgba(var(--color-vault-danger-rgb), $1)' },

  // Dark background: rgba(23, 26, 33, X) -> rgba(var(--color-vault-dark-rgb), X)
  { regex: /rgba\(\s*23\s*,\s*26\s*,\s*33\s*,\s*([0-9.]+)\s*\)/g, replace: 'rgba(var(--color-vault-dark-rgb), $1)' },

  // Card background: rgba(28, 32, 41, X) -> rgba(var(--color-vault-card-rgb), X)
  { regex: /rgba\(\s*28\s*,\s*32\s*,\s*41\s*,\s*([0-9.]+)\s*\)/g, replace: 'rgba(var(--color-vault-card-rgb), $1)' },

  // Darker background: rgba(13, 15, 20, X) -> rgba(var(--color-vault-darker-rgb), X)
  { regex: /rgba\(\s*13\s*,\s*15\s*,\s*20\s*,\s*([0-9.]+)\s*\)/g, replace: 'rgba(var(--color-vault-darker-rgb), $1)' },

  // White base (for borders/highlights): rgba(255, 255, 255, X) -> rgba(var(--color-vault-white-rgb), $1)
  { regex: /rgba\(\s*255\s*,\s*255\s*,\s*255\s*,\s*([0-9.]+)\s*\)/g, replace: 'rgba(var(--color-vault-white-rgb), $1)' },

  // Black base (for shadows/overlays): rgba(0, 0, 0, X) -> rgba(var(--color-vault-black-rgb), $1)
  { regex: /rgba\(\s*0\s*,\s*0\s*,\s*0\s*,\s*([0-9.]+)\s*\)/g, replace: 'rgba(var(--color-vault-black-rgb), $1)' },
  
  // Also common dark card color: rgba(22, 26, 34, X) -> rgba(var(--color-vault-card-alt-rgb), $1)
  { regex: /rgba\(\s*22\s*,\s*26\s*,\s*34\s*,\s*([0-9.]+)\s*\)/g, replace: 'rgba(var(--color-vault-card-alt-rgb), $1)' },
  
  // Very dark bg: rgba(18, 21, 28, X)
  { regex: /rgba\(\s*18\s*,\s*21\s*,\s*28\s*,\s*([0-9.]+)\s*\)/g, replace: 'rgba(var(--color-vault-overlay-rgb), $1)' }
];

function processDirectory(dir) {
  const files = fs.readdirSync(dir);
  
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      processDirectory(fullPath);
    } else if (fullPath.endsWith('.css')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let modified = false;
      
      for (const { regex, replace } of replacements) {
        if (regex.test(content)) {
          content = content.replace(regex, replace);
          modified = true;
        }
      }
      
      if (modified) {
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log(`Updated: ${fullPath}`);
      }
    }
  }
}

processDirectory(cssDir);
console.log("Done!");
