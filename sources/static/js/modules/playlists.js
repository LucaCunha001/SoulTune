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
        count.textContent = `${playlist.tracks.length} faixa${playlist.tracks.length > 1 ? 's' : ''}`;

        card.append(cover, title, count);

        card.addEventListener('click', () => this.showPlaylistDetail(playlist));

        return card;
    }

    showPlaylistDetail(playlist) {
        this.app.ui.clearMainContent();

        const view = document.getElementById('playlist-view');
        const cover = document.getElementById('playlist-cover');
        const title = document.getElementById('playlist-title');
        const description = document.getElementById('playlist-description');
        const trackList = document.getElementById('track-list');

        view.style.display = 'block';

        cover.src = "/static/images/spr_napstablook_d_headphone.png";
        cover.style.height = "180px";
        cover.style.objectFit = "cover";
        title.textContent = playlist.name;
        description.textContent =
            `${playlist.tracks.length} faixa${playlist.tracks.length > 1 ? 's' : ''} • Criada em ${
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

        this.app.player.playingTrack(this.app.currentTrack);
    }

    showPlaylistsMenu(track, album) {
        const modal = document.createElement('div');
        modal.className = 'playlist-select-modal';

        const content = document.createElement('div');
        content.className = 'playlist-select-content';

        const title = document.createElement('h3');
        title.textContent = 'Adicionar à playlist';

        const list = document.createElement('div');
        list.className = 'playlist-select-list';

        if (this.playlists.length === 0) {
            list.appendChild(this.createEmptyMessage('Nenhuma playlist disponível.'));
        } else {
            this.playlists.forEach(playlist => {
                const item = document.createElement('button');
                item.className = 'playlist-select-item';
                item.textContent = playlist.name;

                item.addEventListener('click', async () => {
                    await this.addTrackToPlaylist(playlist.id, track, album);
                    document.body.removeChild(modal);
                });

                list.appendChild(item);
            });
        }

        const close = document.createElement('button');
        close.className = 'playlist-select-close';
        close.textContent = 'Cancelar';

        close.addEventListener('click', () => {
            document.body.removeChild(modal);
        });

        content.append(title, list, close);
        modal.appendChild(content);
        document.body.appendChild(modal);
    }

    async addTrackToPlaylist(playlistId, track, album) {
        try {
            const res = await fetch(`/api/playlists/${playlistId}/tracks`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    track,
                    album
                })
            });

            if (!res.ok) throw new Error();

            const updatedPlaylist = await res.json();

            const updated = [...this.playlists];
            const index = updated.findIndex(p => p.id === playlistId);
            updated[index] = updatedPlaylist;

            this.playlists = updated;

            this.app.ui.toast?.('Música adicionada à playlist');
        } catch {
            this.app.ui.toast?.('Erro ao adicionar música');
        }
    }

    createTrackItem(track, index, playlist) {
        const li = document.createElement('li');
        li.className = 'track-item';
        li.draggable = true;
        li.dataset.trackIndex = index;
        li.dataset.playlistId = playlist.id;

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
        artist.textContent = track.authors?.join(', ') || 'Toby Fox';

        info.append(title, artist);
        left.append(number, info);

        const right = document.createElement('div');
        right.className = 'track-right';

        const duration = document.createElement('span');
        duration.className = 'track-duration';
        duration.textContent = this.app.ui.formatTime(track.duration);

        const removeBtn = document.createElement('button');
        removeBtn.className = 'icon-btn';
        const lucideIcon = document.createElement('i');
        lucideIcon.setAttribute('data-lucide', 'x');
        removeBtn.appendChild(lucideIcon);

        removeBtn.addEventListener('click', async (e) => {
            e.stopPropagation();
            await this.removePlaylistTrack(playlist.id, index);
        });

        right.append(duration, removeBtn);
        li.append(left, right);

        li.addEventListener('click', async () => {
            const albums = await this.app.albums.getAlbuns();
            const album = albums.find(a => a.id === track.album)
            this.app.player.playTrack(track, album);
        });

        li.addEventListener('dragstart', (e) => this.handleDragStart(e, playlist));
        li.addEventListener('dragover', (e) => this.handleDragOver(e));
        li.addEventListener('dragenter', (e) => this.handleDragEnter(e));
        li.addEventListener('dragleave', (e) => this.handleDragLeave(e));
        li.addEventListener('drop', (e) => this.handleDrop(e, playlist));
        li.addEventListener('dragend', (e) => this.handleDragEnd(e));

        return li;
    }

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


    createEmptyMessage(text) {
        const p = document.createElement('p');
        p.className = 'empty-message';
        p.textContent = text;
        return p;
    }

    handleDragStart(e, playlist) {
        const index = parseInt(e.target.dataset.trackIndex);
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/html', e.currentTarget.innerHTML);
        e.dataTransfer.setData('sourceIndex', index);
        e.currentTarget.classList.add('dragging');
    }

    handleDragOver(e) {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        return false;
    }

    handleDragEnter(e) {
        if (e.target.classList.contains('track-item')) {
            e.target.classList.add('drag-over');
        }
    }

    handleDragLeave(e) {
        if (e.target.classList.contains('track-item')) {
            e.target.classList.remove('drag-over');
        }
    }

    async handleDrop(e, playlist) {
        e.preventDefault();
        e.stopPropagation();

        if (!e.target.classList.contains('track-item')) return;

        const sourceIndex = parseInt(e.dataTransfer.getData('sourceIndex'));
        const targetIndex = parseInt(e.target.dataset.trackIndex);

        if (sourceIndex === targetIndex) return;

        document.querySelectorAll('.track-item').forEach(item => {
            item.classList.remove('drag-over');
        });

        const updated = [...this.playlists];
        const pIndex = updated.findIndex(p => p.id === playlist.id);
        const track = updated[pIndex].tracks[sourceIndex];

        updated[pIndex].tracks.splice(sourceIndex, 1);
        updated[pIndex].tracks.splice(targetIndex, 0, track);
        this.playlists = updated;

        await this.updatePlaylistOrder(playlist.id, updated[pIndex].tracks);

        this.showPlaylistDetail(updated[pIndex]);

        return false;
    }

    handleDragEnd(e) {
        document.querySelectorAll('.track-item').forEach(item => {
            item.classList.remove('dragging', 'drag-over');
        });
    }

    async updatePlaylistOrder(playlistId, tracks) {
        try {
            const res = await fetch(`/api/playlists/${playlistId}/reorder`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ tracks })
            });

            if (!res.ok) throw new Error();
        } catch {
            this.app.ui.toast?.('Erro ao reordenar playlist');
        }
    }
}