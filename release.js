require('dotenv').config();
const { spawnSync } = require('child_process');

const GH_TOKEN = process.env.GH_TOKEN?.trim();

if (!GH_TOKEN) {
    console.error('Erro: GH_TOKEN não está definido');
    process.exit(1);
}

delete process.env.GITHUB_TOKEN; // evita conflito

const result = spawnSync(
    'npx',
    ['electron-builder', '--publish', 'always'],
    {
        stdio: 'inherit',
        shell: true,
        env: {
            ...process.env,
            GH_TOKEN
        }
    }
);

process.exit(result.status);