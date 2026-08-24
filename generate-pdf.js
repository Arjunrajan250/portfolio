const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const resumeHtmlPath = path.resolve(__dirname, 'assets', 'resume.html');
const resumePdfPath = path.resolve(__dirname, 'assets', 'resume.pdf');

console.log('Generating Resume PDF from:', resumeHtmlPath);
console.log('Target PDF destination:', resumePdfPath);

if (!fs.existsSync(resumeHtmlPath)) {
    console.error('Error: assets/resume.html does not exist.');
    process.exit(1);
}

try {
    const cmd = `google-chrome --headless=new --disable-gpu --no-sandbox --print-to-pdf="${resumePdfPath}" "file://${resumeHtmlPath}"`;
    execSync(cmd, { stdio: 'inherit' });
    
    const stats = fs.statSync(resumePdfPath);
    console.log(`\n✅ Success! PDF successfully generated (${(stats.size / 1024).toFixed(1)} KB).`);
    console.log(`Saved at: ${resumePdfPath}`);
} catch (error) {
    console.error('Failed to generate PDF:', error.message);
    process.exit(1);
}
