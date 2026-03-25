export class Search {
    constructor(app) {
        this.app = app;
    }

    debouncedSearch(query) {
        clearTimeout(this.app.searchTimeout);
        this.app.searchTimeout = setTimeout(() => {
            this.searchTracks(query);
        }, 300);
    }

    searchTracks(query) {
        if (!query.trim()) {
            this.app.albums.loadAlbums();
            return;
        }
        this.searchTracksAPI(query);
    }

    performSearch() {
        const query = document.getElementById('search-input').value.trim();
        if (!query) return;

        this.app.ui.clearMainContent();
        document.querySelector('.albums-section').style.display = 'block';
        document.getElementById("secao-titulo").innerHTML = '<h3>Resultados da Busca</h3>';

        const albumsGrid = document.getElementById('albums-grid');
        albumsGrid.innerHTML = '<div class="loading"><div class="spinner"></div><p>Buscando...</p></div>';

        this.searchTracksAPI(query);
    }

    async searchTracksAPI(query) {
        try {
            const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
            if (!response.ok) {
                throw new Error('Erro na busca');
            }
            const results = await response.json();
            this.displaySearchResults(results, query);
        } catch (error) {
            console.error('Erro na busca:', error);
            this.displaySearchError();
        }
    }

    displaySearchResults(results, query) {
        const albumsGrid = document.getElementById('albums-grid');

        if (results.length === 0) {
            albumsGrid.innerHTML = `<div class="no-results"><p>Nenhuma música encontrada para "${query}"</p></div>`;
            return;
        }

        albumsGrid.innerHTML = '';

        const trackList = document.createElement('ul');
        trackList.className = 'search-results-list';

        results.forEach(result => {
            const trackItem = document.createElement('li');
            trackItem.className = 'search-track-item';
            trackItem.innerHTML = `
                <img src="${result.album.cover}" alt="${result.album.title}" class="search-track-cover" onerror="this.src='/static/images/icon.ico'">
                <div class="search-track-info">
                    <div class="search-track-title">${this.highlightQuery(result.track.title, query)}</div>
                    <div class="search-track-artist">${result.album.artist} - ${result.album.title}</div>
                </div>
                <span class="search-track-duration">${this.app.ui.formatTime(result.track.duration)}</span>
            `;
            trackItem.addEventListener('click', () => {
                this.app.player.playTrack(result.track, result.album);
            });
            trackList.appendChild(trackItem);
        });

        albumsGrid.appendChild(trackList);
    }

    highlightQuery(text, query) {
        if (!query) return text;
        const regex = new RegExp(`(${query})`, 'gi');
        return text.replace(regex, '<mark>$1</mark>');
    }

    displaySearchError() {
        const albumsGrid = document.getElementById('albums-grid');
        albumsGrid.innerHTML = '<div class="error"><p>Erro ao buscar músicas. Tente novamente.</p></div>';
    }
}