export class Playlists {
    constructor(app) {
        this.app = app;
    }

    async showPlaylists() {
        this.app.ui.clearMainContent();
        document.querySelector('.albums-section').style.display = 'block';
        document.getElementById("secao-titulo").innerHTML = '<h2>Suas Playlists</h2>';

        const playlistsGrid = document.getElementById('albums-grid');
        playlistsGrid.innerHTML = '';

        if (this.app.playlists.length === 0) {
            playlistsGrid.innerHTML += '<p style="color: var(--subtext); margin-top: 20px;">Nenhuma playlist criada ainda.</p>';
            return;
        }

        const playlistsContainer = document.createElement('div');
        playlistsContainer.style.css = 'playlists-container';
        playlistsContainer.style.display = 'grid';
        playlistsContainer.style.gridTemplateColumns = 'repeat(auto-fill, minmax(200px, 1fr))';
        playlistsContainer.style.gap = '20px';

        this.app.playlists.forEach(playlist => {
            const card = document.createElement('div');
            card.className = 'album-card';
            card.innerHTML = `
                <div style="background: linear-gradient(135deg, var(--primary), var(--primary-hover)); width: 100%; height: 150px; border-radius: 6px; display: flex; align-items: center; justify-content: center; margin-bottom: 10px;">
                    <span style="font-size: 48px;">🎵</span>
                </div>
                <h3 class="album-title">${playlist.name}</h3>
                <p class="album-artist">${playlist.tracks.length} faixa(s)</p>
            `;
            card.addEventListener('click', () => this.showPlaylistDetail(playlist));
            playlistsContainer.appendChild(card);
        });

        playlistsGrid.appendChild(playlistsContainer);
    }

    showPlaylistDetail(playlist) {
        this.app.currentPlaylist = playlist;
        this.app.ui.clearMainContent();
        document.getElementById('playlist-view').style.display = 'block';

        document.getElementById('playlist-cover').style.background = 'linear-gradient(135deg, var(--primary), var(--primary-hover))';
        document.getElementById('playlist-cover').innerHTML = '<span style="font-size: 64px;">🎵</span>';
        document.getElementById('playlist-title').textContent = playlist.name;
        document.getElementById('playlist-description').textContent = `${playlist.tracks.length} faixa(s) • Criada em ${new Date(playlist.createdAt).toLocaleDateString('pt-BR')}`;

        const trackList = document.getElementById('track-list');
        trackList.innerHTML = '';

        if (playlist.tracks.length === 0) {
            trackList.innerHTML = '<p style="color: var(--subtext); padding: 20px;">Nenhuma faixa adicionada.</p>';
            return;
        }

        playlist.tracks.forEach((track, index) => {
            const trackItem = document.createElement('li');
            trackItem.className = 'track-item';
            trackItem.innerHTML = `
                <div style="display: flex; align-items: center; gap: 12px; flex: 1;">
                    <span class="track-number">${index + 1}</span>
                    <div class="track-info">
                        <div class="track-title">${track.title}</div>
                        <div class="track-artist">${track.album.artist}</div>
                    </div>
                </div>
                <div style="display: flex; align-items: center; gap: 12px;">
                    <span class="track-duration">${this.app.ui.formatTime(track.duration)}</span>
                    <button style="background: none; border: none; color: var(--subtext); cursor: pointer; padding: 5px; font-size: 16px; display: flex; align-items: center; justify-content: center;" data-lucide="x"></button>
                </div>
            `;
            trackItem.addEventListener('click', () => {
                this.app.player.playTrack(track, track.album);
            });
            trackItem.querySelector('button').addEventListener('click', async (e) => {
                e.stopPropagation();
                await this.removePlaylistTrack(playlist.id, index);
            });
            trackList.appendChild(trackItem);
        });

        lucide.createIcons();
    }

    showCreatePlaylistModal() {
        const modal = document.getElementById('playlist-modal');
        const nameInput = document.getElementById('playlist-name');
        const descriptionInput = document.getElementById('playlist-description');

        nameInput.value = '';
        descriptionInput.value = '';

        modal.style.display = 'flex';

        setTimeout(() => nameInput.focus(), 100);
    }

    closePlaylistModal() {
        const modal = document.getElementById('playlist-modal');
        modal.style.display = 'none';
    }

    async submitPlaylistForm() {
        const nameInput = document.getElementById('playlist-name');
        const descriptionInput = document.getElementById('playlist-description');

        const name = nameInput.value.trim();
        const description = descriptionInput.value.trim();

        if (!name) {
            alert('Nome da playlist é obrigatório!');
            nameInput.focus();
            return;
        }

        await this.createPlaylist(name, description);
        this.closePlaylistModal();
    }

    async loadPlaylistsFromAPI() {
        try {
            const response = await fetch('/api/playlists');
            if (!response.ok) throw new Error('Erro ao carregar playlists');
            this.app.playlists = await response.json();
            this.renderPlaylistsList();
        } catch (error) {
            console.error('Erro ao carregar playlists:', error);
        }
    }

    renderPlaylistsList() {
        const playlistListEl = document.querySelector('.playlist-list');
        playlistListEl.innerHTML = '';

        this.app.playlists.forEach(playlist => {
            const li = document.createElement('li');
            li.innerHTML = `<a href="#" data-playlist-id="${playlist.id}">${playlist.name}</a>`;
            li.querySelector('a').addEventListener('click', (e) => {
                e.preventDefault();
                this.showPlaylistDetail(playlist);
            });
            playlistListEl.appendChild(li);
        });
    }

    async createPlaylist(name, description = '') {
        try {
            const response = await fetch('/api/playlists', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, description })
            });

            if (!response.ok) throw new Error('Erro ao criar playlist');
            const newPlaylist = await response.json();
            this.app.playlists.push(newPlaylist);
            this.renderPlaylistsList();
        } catch (error) {
            console.error('Erro ao criar playlist:', error);
            alert('Erro ao criar playlist');
        }
    }

    async deletePlaylist(playlistId) {
        if (!confirm('Tem certeza que deseja deletar esta playlist?')) return;

        try {
            const response = await fetch(`/api/playlists/${playlistId}`, {
                method: 'DELETE'
            });

            if (!response.ok) throw new Error('Erro ao deletar playlist');
            this.app.playlists = this.app.playlists.filter(p => p.id !== playlistId);
            this.renderPlaylistsList();
            document.querySelector('.albums-section').style.display = 'block';
            document.getElementById('playlist-view').style.display = 'none';
            this.app.albums.loadAlbums();
        } catch (error) {
            console.error('Erro ao deletar playlist:', error);
            alert('Erro ao deletar playlist');
        }
    }

    async addTrackToPlaylist(track, album, playlistId) {
        try {
            const response = await fetch(`/api/playlists/${playlistId}/tracks`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ track, album })
            });

            if (!response.ok) throw new Error('Erro ao adicionar faixa');
            const playlistIndex = this.app.playlists.findIndex(p => p.id === playlistId);
            if (playlistIndex !== -1) {
                this.app.playlists[playlistIndex].tracks.push(await response.json());
            }
            alert('Faixa adicionada à playlist!');
        } catch (error) {
            console.error('Erro ao adicionar faixa:', error);
            alert('Erro ao adicionar faixa à playlist');
        }
    }

    async removePlaylistTrack(playlistId, trackIndex) {
        try {
            const response = await fetch(`/api/playlists/${playlistId}/tracks/${trackIndex}`, {
                method: 'DELETE'
            });

            if (!response.ok) throw new Error('Erro ao remover faixa');
            const playlistIndex = this.app.playlists.findIndex(p => p.id === playlistId);
            if (playlistIndex !== -1) {
                this.app.playlists[playlistIndex].tracks.splice(trackIndex, 1);
                this.showPlaylistDetail(this.app.playlists[playlistIndex]);
            }
        } catch (error) {
            console.error('Erro ao remover faixa:', error);
            alert('Erro ao remover faixa');
        }
    }

    showPlaylistsMenu(track, album) {
        if (this.app.playlists.length === 0) {
            alert('Crie uma playlist primeiro!');
            return;
        }

        const menu = document.createElement('div');
        menu.style.position = 'fixed';
        menu.style.background = 'var(--card)';
        menu.style.border = '1px solid var(--hover)';
        menu.style.borderRadius = 'var(--radius)';
        menu.style.padding = '10px 0';
        menu.style.zIndex = '1000';
        menu.style.minWidth = '200px';
        menu.style.boxShadow = '0 4px 20px rgba(0,0,0,0.3)';

        this.app.playlists.forEach(playlist => {
            const option = document.createElement('button');
            option.style.width = '100%';
            option.style.padding = '12px 16px';
            option.style.background = 'none';
            option.style.border = 'none';
            option.style.color = 'var(--text)';
            option.style.cursor = 'pointer';
            option.style.textAlign = 'left';
            option.style.transition = 'var(--transition)';
            option.innerHTML = `📋 ${playlist.name}`;

            option.addEventListener('mouseover', () => {
                option.style.background = 'var(--hover)';
            });
            option.addEventListener('mouseout', () => {
                option.style.background = 'none';
            });

            option.addEventListener('click', () => {
                this.addTrackToPlaylist(track, album, playlist.id);
                menu.remove();
            });

            menu.appendChild(option);
        });

        document.body.appendChild(menu);

        const event = window.event;
        menu.style.top = (event.clientY) + 'px';
        menu.style.left = (event.clientX) + 'px';

        setTimeout(() => {
            document.addEventListener('click', function removeMenu(e) {
                if (!menu.contains(e.target)) {
                    menu.remove();
                    document.removeEventListener('click', removeMenu);
                }
            });
        }, 0);
    }
}