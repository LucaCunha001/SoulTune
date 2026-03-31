require('dotenv').config();
const { execSync } = require('child_process');

const env = { ...process.env, GH_TOKEN: process.env.GH_TOKEN };
execSync('electron-builder --publish always', { stdio: 'inherit', env });
