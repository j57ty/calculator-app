const fs = require('fs');
const path = require('path');

const distDir = path.join(__dirname, 'dist');
const indexPath = path.join(distDir, 'index.html');
const noJekyllPath = path.join(distDir, '.nojekyll');
const notFoundPath = path.join(distDir, '404.html');

// 1. Create .nojekyll so GitHub Pages doesn't ignore _expo folder
fs.writeFileSync(noJekyllPath, '');
console.log('✅ Created dist/.nojekyll');

// 2. Fix absolute paths to relative paths in index.html for GitHub Pages subpath
if (fs.existsSync(indexPath)) {
  let html = fs.readFileSync(indexPath, 'utf8');
  html = html.replace(/href="\/favicon\.ico"/g, 'href="./favicon.ico"');
  html = html.replace(/src="\/_expo\//g, 'src="./_expo/');
  fs.writeFileSync(indexPath, html);
  console.log('✅ Updated index.html with relative asset paths');

  // 3. Create 404.html as a copy of index.html for SPA routing
  fs.writeFileSync(notFoundPath, html);
  console.log('✅ Created dist/404.html for SPA routing');
} else {
  console.error('❌ dist/index.html not found! Run build first.');
  process.exit(1);
}

console.log('🎉 Preparation for GitHub Pages complete!');
