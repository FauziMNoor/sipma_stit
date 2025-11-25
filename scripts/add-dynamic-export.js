const fs = require('fs');
const path = require('path');

// Recursively find all route.ts files in src/app/api
function findRouteFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      findRouteFiles(filePath, fileList);
    } else if (file === 'route.ts') {
      fileList.push(filePath);
    }
  });
  
  return fileList;
}

const apiDir = path.join(process.cwd(), 'src', 'app', 'api');
const apiRoutes = findRouteFiles(apiDir);

console.log(`Found ${apiRoutes.length} API route files`);

const dynamicExports = `// Force dynamic rendering to prevent build-time data collection
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

`;

let updatedCount = 0;

apiRoutes.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  
  // Skip if already has dynamic export
  if (content.includes("export const dynamic = 'force-dynamic'")) {
    console.log(`  [SKIP] ${path.relative(process.cwd(), file)} - already has dynamic export`);
    return;
  }
  
  // Add after imports, before first export function
  const lines = content.split('\n');
  let insertIndex = 0;
  
  // Find last import line
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].trim().startsWith('import ')) {
      insertIndex = i + 1;
    } else if (lines[i].trim().startsWith('export ')) {
      break;
    }
  }
  
  // Insert dynamic exports after last import
  lines.splice(insertIndex, 0, '', dynamicExports.trim(), '');
  
  const newContent = lines.join('\n');
  fs.writeFileSync(file, newContent, 'utf8');
  
  updatedCount++;
  console.log(`  [UPDATE] ${path.relative(process.cwd(), file)}`);
});

console.log(`\n✅ Updated ${updatedCount} files`);
console.log(`✅ Skipped ${apiRoutes.length - updatedCount} files (already had dynamic export)`);
