export class Playlists {
    constructor(app) {
        this.app = app;
    }

    get playlists() {
        return this.app.playlistsList;
    }

    set playlists(value) {
        this.app.playlistsList = value;
    }

    // ========================
    // LISTAGEM
    // ========================
    async showPlaylists() {
        this.app.ui.clearMainContent();

        const section = document.querySelector('.albums-section');
        const title = document.getElementById('secao-titulo');
        const grid = document.getElementById('albums-grid');

        section.style.display = 'block';
        title.textContent = 'Suas Playlists';
        grid.innerHTML = '';

        if (this.playlists.length === 0) {
            grid.appendChild(this.createEmptyMessage('Nenhuma playlist criada ainda.'));
            return;
        }

        const container = document.createElement('div');
        container.className = 'playlists-container';

        this.playlists.forEach(playlist => {
            container.appendChild(this.createPlaylistCard(playlist));
        });

        grid.appendChild(container);
    }

    createPlaylistCard(playlist) {
        const card = document.createElement('div');
        card.className = 'album-card';

        const cover = document.createElement('div');
        cover.className = 'playlist-cover';
        cover.textContent = '🎵';

        const title = document.createElement('h3');
        title.className = 'album-title';
        title.textContent = playlist.name;

        const count = document.createElement('p');
        count.className = 'album-artist';
        count.textContent = `${playlist.tracks.length} faixa(s)`;

        card.append(cover, title, count);

        card.addEventListener('click', () => this.showPlaylistDetail(playlist));

        return card;
    }

    // ========================
    // DETALHE
    // ========================
    showPlaylistDetail(playlist) {
        this.app.ui.clearMainContent();

        const view = document.getElementById('playlist-view');
        const cover = document.getElementById('playlist-cover');
        const title = document.getElementById('playlist-title');
        const description = document.getElementById('playlist-description');
        const trackList = document.getElementById('track-list');

        view.style.display = 'block';

        cover.textContent = '🎵';
        title.textContent = playlist.name;
        description.textContent =
            `${playlist.tracks.length} faixa(s) • Criada em ${
                new Date(playlist.createdAt).toLocaleDateString('pt-BR')
            }`;

        trackList.innerHTML = '';

        if (playlist.tracks.length === 0) {
            trackList.appendChild(this.createEmptyMessage('Nenhuma faixa adicionada.'));
            return;
        }

        playlist.tracks.forEach((track, index) => {
            trackList.appendChild(this.createTrackItem(track, index, playlist));
        });

        lucide.createIcons();
    }

    createTrackItem(track, index, playlist) {
        const li = document.createElement('li');
        li.className = 'track-item';

        const left = document.createElement('div');
        left.className = 'track-left';

        const number = document.createElement('span');
        number.className = 'track-number';
        number.textContent = index + 1;

        const info = document.createElement('div');
        info.className = 'track-info';

        const title = document.createElement('div');
        title.className = 'track-title';
        title.textContent = track.title;

        const artist = document.createElement('div');
        artist.className = 'track-artist';
        artist.textContent = track.album.artist;

        info.append(title, artist);
        left.append(number, info);

        const right = document.createElement('div');
        right.className = 'track-right';

        const duration = document.createElement('span');
        duration.className = 'track-duration';
        duration.textContent = this.app.ui.formatTime(track.duration);

        const removeBtn = document.createElement('button');
        removeBtn.className = 'icon-btn';
        removeBtn.setAttribute('data-lucide', 'x');

        removeBtn.addEventListener('click', async (e) => {
            e.stopPropagation();
            await this.removePlaylistTrack(playlist.id, index);
        });

        right.append(duration, removeBtn);
        li.append(left, right);

        li.addEventListener('click', () => {
            this.app.player.playTrack(track, track.album);
        });

        return li;
    }

    // ========================
    // MODAL
    // ========================
    showCreatePlaylistModal() {
        const modal = document.getElementById('playlist-modal');
        const nameInput = document.getElementById('playlist-name');
        const descInput = document.getElementById('playlist-description');

        nameInput.value = '';
        descInput.value = '';

        modal.style.display = 'flex';
        setTimeout(() => nameInput.focus(), 50);
    }

    closePlaylistModal() {
        document.getElementById('playlist-modal').style.display = 'none';
    }

    async submitPlaylistForm() {
        const nameInput = document.getElementById('playlist-name');
        const descInput = document.getElementById('playlist-description');

        const name = nameInput.value.trim();
        const description = descInput.value.trim();

        if (!name) {
            this.app.ui.toast?.('Nome da playlist é obrigatório');
            nameInput.focus();
            return;
        }

        await this.createPlaylist(name, description);
        this.closePlaylistModal();
    }

    // ========================
    // API
    // ========================
    async loadPlaylistsFromAPI() {
        try {
            const res = await fetch('/api/playlists');
            if (!res.ok) throw new Error();

            this.playlists = await res.json();
            this.renderSidebar();
        } catch {
            this.app.ui.toast?.('Erro ao carregar playlists');
        }
    }

    async createPlaylist(name, description = '') {
        try {
            const res = await fetch('/api/playlists', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, description })
            });

            if (!res.ok) throw new Error();

            const newPlaylist = await res.json();
            this.playlists = [...this.playlists, newPlaylist];

            this.renderSidebar();
        } catch {
            this.app.ui.toast?.('Erro ao criar playlist');
        }
    }

    async deletePlaylist(id) {
        if (!confirm('Tem certeza que deseja deletar?')) return;

        try {
            const res = await fetch(`/api/playlists/${id}`, {
                method: 'DELETE'
            });

            if (!res.ok) throw new Error();

            this.playlists = this.playlists.filter(p => p.id !== id);

            this.renderSidebar();
            this.app.albums.loadAlbums();
        } catch {
            this.app.ui.toast?.('Erro ao deletar playlist');
        }
    }

    async removePlaylistTrack(id, index) {
        try {
            const res = await fetch(`/api/playlists/${id}/tracks/${index}`, {
                method: 'DELETE'
            });

            if (!res.ok) throw new Error();

            const updated = [...this.playlists];
            const pIndex = updated.findIndex(p => p.id === id);

            updated[pIndex].tracks.splice(index, 1);
            this.playlists = updated;

            this.showPlaylistDetail(updated[pIndex]);
        } catch {
            this.app.ui.toast?.('Erro ao remover faixa');
        }
    }

    // ========================
    // SIDEBAR
    // ========================
    renderSidebar() {
        const list = document.querySelector('.playlist-list');
        list.innerHTML = '';

        this.playlists.forEach(p => {
            const li = document.createElement('li');
            const link = document.createElement('a');

            link.href = '#';
            link.textContent = p.name;

            link.addEventListener('click', (e) => {
                e.preventDefault();
                this.showPlaylistDetail(p);
            });

            li.appendChild(link);
            list.appendChild(li);
        });
    }

    // ========================
    // HELPERS
    // ========================
    createEmptyMessage(text) {
        const p = document.createElement('p');
        p.className = 'empty-message';
        p.textContent = text;
        return p;
    }
}