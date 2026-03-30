export class Albums {
    constructor(app) {
        this.app = app;
    }

    async loadAlbums() {
        try {
            const response = await fetch('/api/albums');
            if (!response.ok) {
                throw new Error('Erro ao carregar álbuns');
            }
            const albums = await response.json();
            this.renderAlbums(albums);
        } catch (error) {
            console.error('Erro ao carregar álbuns:', error);
            this.loadAlbumsFallback();
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

    loadAlbumsFallback() {
        const albums = [
            {
                id: 'undertale-ost',
                title: 'Undertale Soundtrack',
                artist: 'Toby Fox',
                cover: '/static/images/undertale-cover.jpg',
                tracks: [
                    { id: '1', title: 'Once Upon a Time', duration: 75 },
                    { id: '2', title: 'Start Menu', duration: 52 },
                    { id: '3', title: 'Your Best Friend', duration: 171 },
                ]
            },
            {
                id: 'deltarune-chapter1',
                title: 'DELTARUNE Chapter 1',
                artist: 'Toby Fox',
                cover: '/static/images/deltarune-ch1-cover.jpg',
                tracks: [
                    { id: '1', title: 'ANOTHER HIM', duration: 135 },
                    { id: '2', title: 'The Legend', duration: 151 },
                    { id: '3', title: 'Rude Buster', duration: 105 },
                ]
            }
        ];
        this.renderAlbums(albums);
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

        const loading = document.createElement('div');
        loading.id = 'track-loading';
        loading.textContent = 'Carregando faixas...';
        trackList.appendChild(loading);

        const tracksWithDuration = await Promise.all(album.tracks.map(async (track) => {
            const duration = await this.app.player.getTrackDurationFromData(track, album);
            return { track, duration };
        }));

        trackList.innerHTML = '';

        for (let index = 0; index < tracksWithDuration.length; index++) {
            let displayIndex = album.title == "deltarune-ost-chapter4" ? index + 38 : index;
            const { track, duration } = tracksWithDuration[index];

            const trackItem = document.createElement('li');
            trackItem.className = 'track-item';
            trackItem.innerHTML = `
        <div class="track-left">
            <span class="track-number">${displayIndex + 1}</span>
            <div class="track-info">
                <div class="track-title">${track.title}</div>
                <div class="track-artist">${track.authors?.join(', ') || album.artist}</div>
            </div>
        </div>
        <div class="track-right">
            <span class="track-duration">${this.app.ui.formatTime(duration)}</span>
            <button class="add-to-playlist-btn" data-lucide="plus"></button>
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

        if (this.app.currentTrack) this.app.player.playingTrack(this.app.currentTrack.title);

        lucide.createIcons();
    }
}