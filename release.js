require('dotenv').config();
require('child_process').execSync('electron-builder --publish always', { stdio: 'inherit' });
