export class Albums {
    constructor(app) {
        this.app = app;
    }

    async getAlbuns() {
        const response = await fetch('/api/albums');
        if (!response.ok) {
            throw new Error('Erro ao carregar álbuns');
        }
        const albums = await response.json();
        return albums;
    }

    async loadAlbums() {
        try {
            const albums = await this.getAlbuns();
            this.renderAlbums(albums);
        } catch (error) {
            console.error('Erro ao carregar álbuns:', error);
        }
    }

    renderAlbums(albums) {
        const albumsGrid = document.getElementById('albums-grid');
        document.getElementById("secao-titulo").innerHTML = '<h2>Álbuns</h2>';
        document.querySelector('.albums-section').style.display = 'block';
        document.getElementById('playlist-view').style.display = 'none';
        albumsGrid.innerHTML = "";

        albums.forEach(album => {
            const albumCard = document.createElement('div');
            albumCard.className = 'album-card';
            albumCard.innerHTML = `
                <img src="${album.cover}" alt="${album.title}" class="album-cover" onerror="this.src='/static/images/icon.ico'">
                <h3 class="album-title">${album.title}</h3>
                <p class="album-artist">${album.artist}</p>
            `;
            albumCard.addEventListener('click', () => {
                this.showAlbum(album);
            });
            albumsGrid.appendChild(albumCard);
        });
    }

    async showAlbum(album) {
        this.app.currentPlaylist = album;
        this.app.ui.clearMainContent();
        document.getElementById('playlist-view').style.display = 'block';

        document.getElementById('playlist-cover').src = album.cover;
        document.getElementById('playlist-title').textContent = album.title;
        document.getElementById('playlist-description').textContent = `${album.artist} • ${album.tracks.length} músicas`;

        const trackList = document.getElementById('track-list');
        trackList.innerHTML = '';

        for (let i = 0; i < 8; i++) {
            const skeleton = document.createElement('li');
            skeleton.className = 'track-item skeleton';
            skeleton.innerHTML = `
                <div class="track-left">
                    <span class="track-number skeleton-box"></span>
                    <div class="track-info">
                        <div class="track-title skeleton-box"></div>
                        <div class="track-artist skeleton-box"></div>
                    </div>
                </div>
                <div class="track-right">
                    <span class="track-duration skeleton-box"></span>
                </div>
            `;
            trackList.appendChild(skeleton);
        }

        const tracksWithDuration = await Promise.all(album.tracks.map(async (track) => {
            const duration = await this.app.player.getTrackDurationFromData(track, album);
            return { track, duration };
        }));

        trackList.innerHTML = '';

        for (let index = 0; index < tracksWithDuration.length; index++) {
            let displayIndex = index + 1;
            displayIndex = displayIndex.toString().padStart(album.id === "undertale-ost" ? 3 : 2, '0');
            const { track, duration } = tracksWithDuration[index];

            const trackItem = document.createElement('li');
            trackItem.className = 'track-item';
            trackItem.innerHTML = `
        <div class="track-left">
            <span class="track-number">${displayIndex}</span>
            <div class="track-info">
                <div class="track-title">${track.title}</div>
                <div class="track-artist">${track.authors?.join(', ') || album.artist}</div>
            </div>
        </div>
        <div class="track-right">
            <span class="track-duration">${this.app.ui.formatTime(duration)}</span>
            <button class="add-to-playlist-btn"><i data-lucide="plus"></i></button>
        </div>
    `;

            trackItem.addEventListener('click', (e) => {
                this.app.player.playTrack(track, album);
            });

            trackItem.querySelector('.add-to-playlist-btn').addEventListener('click', (e) => {
                e.stopPropagation();
                this.app.playlists.showPlaylistsMenu(track, album);
            });

            trackList.appendChild(trackItem);
        }

        if (this.app.currentTrack?.album == album) {
            this.app.player.playingTrack(this.app.currentTrack);
        }

        lucide.createIcons();
    }
}