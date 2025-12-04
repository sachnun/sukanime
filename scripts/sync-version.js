const fs = require('fs');
const path = require('path');

// Read version from package.json
const packageJson = JSON.parse(fs.readFileSync(path.join(__dirname, '../package.json'), 'utf8'));
const version = packageJson.version;

// Convert version to versionCode (e.g., "1.2.3" -> 10203)
const versionParts = version.split('.');
const versionCode = parseInt(versionParts[0]) * 10000 + 
                    parseInt(versionParts[1] || 0) * 100 + 
                    parseInt(versionParts[2] || 0);

console.log(`Version: ${version}`);
console.log(`Version Code: ${versionCode}`);

// Update android/app/build.gradle
const buildGradlePath = path.join(__dirname, '../android/app/build.gradle');
let buildGradle = fs.readFileSync(buildGradlePath, 'utf8');

buildGradle = buildGradle.replace(/versionCode \d+/, `versionCode ${versionCode}`);
buildGradle = buildGradle.replace(/versionName "[^"]*"/, `versionName "${version}"`);

fs.writeFileSync(buildGradlePath, buildGradle);
console.log('Updated android/app/build.gradle');

// Create version.json for update checking
const versionInfo = {
  version: version,
  versionCode: versionCode,
  releaseDate: new Date().toISOString().split('T')[0],
  downloadUrl: `https://github.com/sachnun/sukanime/releases/download/v${version}/sukanime-v${version}.apk`,
  releaseNotes: `https://github.com/sachnun/sukanime/releases/tag/v${version}`
};

fs.writeFileSync(
  path.join(__dirname, '../public/version.json'),
  JSON.stringify(versionInfo, null, 2)
);
console.log('Created public/version.json');
