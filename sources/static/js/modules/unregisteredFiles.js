export class UnregisteredFiles {
    constructor(app) {
        this.app = app;
    }

    async showUnregisteredFiles() {
        this.app.ui.clearMainContent();
        document.querySelector('.albums-section').style.display = 'block';
        document.getElementById("secao-titulo").innerHTML = '<h2>Arquivos Não Registrados</h2>';

        const albumsGrid = document.getElementById('albums-grid');
        albumsGrid.innerHTML = '<div class="loading"><div class="spinner"></div><p>Carregando arquivos...</p></div>';

        try {
            const response = await fetch(`/api/unregistered-files?undertaleFolder=${encodeURIComponent(this.app.settings.undertaleFolder || '')}&deltaruneFolder=${encodeURIComponent(this.app.settings.deltaruneFolder || '')}`);
            if (!response.ok) throw new Error('Erro na resposta do servidor');
            const unregisteredFiles = await response.json();
            this.renderUnregisteredFiles(unregisteredFiles);
        } catch (error) {
            console.error('Erro ao carregar arquivos não registrados:', error);
            albumsGrid.innerHTML = '<div class="error"><p>Erro ao carregar arquivos. Verifique as configurações de pastas.</p></div>';
        }
    }

    renderUnregisteredFiles(files) {
        const albumsGrid = document.getElementById('albums-grid');

        if (files.length === 0) {
            albumsGrid.innerHTML = '<div class="no-files"><p>Nenhum arquivo não registrado encontrado. Configure as pastas nas configurações.</p></div>';
            return;
        }

        albumsGrid.innerHTML = '';

        const filesContainer = document.createElement('div');
        filesContainer.className = 'files-container';
        filesContainer.style.cssText = 'display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 15px;';

        files.forEach(file => {
            const fileCard = document.createElement('div');
            fileCard.className = 'file-card';
            fileCard.style.cssText = `
                background: var(--card-bg);
                border-radius: 8px;
                padding: 15px;
                box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                display: flex;
                flex-direction: column;
                gap: 10px;
            `;

            fileCard.innerHTML = `
                <div style="display: flex; align-items: center; gap: 10px;">
                    <i data-lucide="music" style="color: var(--primary);"></i>
                    <div style="flex: 1;">
                        <h4 style="margin: 0; font-size: 14px; color: var(--text);">${file.name}</h4>
                        <p style="margin: 0; font-size: 12px; color: var(--text-secondary);">${file.folder}</p>
                    </div>
                </div>
                <div style="display: flex; gap: 5px;">
                    <button class="play-file-btn" data-path="${file.path}" style="flex: 1; padding: 8px; background: var(--primary); color: white; border: none; border-radius: 4px; cursor: pointer;">
                        <i data-lucide="play"></i> Reproduzir
                    </button>
                    <button class="add-to-playlist-btn" data-path="${file.path}" data-name="${file.name}" style="padding: 8px; background: var(--secondary); color: white; border: none; border-radius: 4px; cursor: pointer;">
                        <i data-lucide="plus"></i>
                    </button>
                </div>
            `;

            filesContainer.appendChild(fileCard);
        });

        albumsGrid.appendChild(filesContainer);

        document.querySelectorAll('.play-file-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const filePath = e.currentTarget.dataset.path;
                this.playUnregisteredFile(filePath);
            });
        });

        document.querySelectorAll('.add-to-playlist-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const filePath = e.currentTarget.dataset.path;
                const fileName = e.currentTarget.dataset.name;
                this.app.playlists.showPlaylistsMenu({ title: fileName, file: filePath }, { title: 'Arquivos Não Registrados' });
            });
        });

        lucide.createIcons();
    }

    playUnregisteredFile(filePath) {
        this.app.player.stopCurrentPlayback();

        const fileName = filePath.split(/[/\\]/).pop().replace(/\.[^/.]+$/, '');
        this.app.currentTrack = {
            title: fileName,
            file: filePath,
            duration: 0
        };
        this.app.currentAudioIndex = 0;
        this.app.audioQueue = [{ src: `/api/unregistered-music?path=${encodeURIComponent(filePath)}`, delay: 0 }];

        this.app.trackStartTime = Date.now();
        this.app.isPlaying = true;
        this.app.player.playNextInQueue();
        this.app.player.updatePlayerUI();
        this.app.player.updateMusic(this.app.currentTrack, { title: 'Arquivos Não Registrados' });
    }
}