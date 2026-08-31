const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const targets = [
    {
        html: path.resolve(__dirname, 'assets', 'resume.html'),
        pdf: path.resolve(__dirname, 'assets', 'resume.pdf'),
        name: 'Executive Resume'
    },
    {
        html: path.resolve(__dirname, 'assets', 'resume-ats.html'),
        pdf: path.resolve(__dirname, 'assets', 'resume-ats.pdf'),
        name: 'ATS-Friendly Resume'
    }
];

for (const target of targets) {
    console.log(`\nGenerating ${target.name} PDF from: ${target.html}`);
    console.log(`Target destination: ${target.pdf}`);

    if (!fs.existsSync(target.html)) {
        console.error(`Error: ${target.html} does not exist.`);
        process.exit(1);
    }

    try {
        const cmd = `google-chrome --headless=new --disable-gpu --no-sandbox --no-pdf-header-footer --print-to-pdf="${target.pdf}" "file://${target.html}"`;
        execSync(cmd, { stdio: 'inherit' });


        const stats = fs.statSync(target.pdf);
        console.log(`✅ Success! ${target.name} PDF generated (${(stats.size / 1024).toFixed(1)} KB).`);
        console.log(`Saved at: ${target.pdf}`);
    } catch (error) {
        console.error(`Failed to generate ${target.name} PDF:`, error.message);
        process.exit(1);
    }
}

