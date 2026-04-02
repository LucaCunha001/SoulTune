export class UI {
    constructor(app) {
        this.app = app;
    }

    setupScrollListener() {
        const mainContent = document.querySelector('.main-content');
        const header = document.querySelector('.playlist-header');

        if (!mainContent || !header) return;

        mainContent.addEventListener('scroll', () => {
            const rect = header.getBoundingClientRect();

            if (rect.bottom < 0) {
                this.showAlbumInfoInSidePanel();
            } else {
                this.hideAlbumInfoFromSidePanel();
            }
        });
    }

    showAlbumInfoInSidePanel() {
        const panel = document.getElementById('right-panel');
        const content = document.getElementById('album-content');

        if (panel.dataset.mode === 'album') return;

        const header = document.querySelector('.playlist-header');

        content.innerHTML = header.outerHTML;
        const playlistHeader = content.querySelector(".playlist-header");
        playlistHeader.style.flexDirection = "column";

        panel.dataset.mode = 'album';
        panel.classList.add('active');
        content.classList.add('active');

        document.querySelector(".app").classList.add("right-panel-open");
    }

    hideAlbumInfoFromSidePanel() {
        const panel = document.getElementById('right-panel');
        
        const content = document.getElementById('album-content');
        content.classList.remove('active');
        if (panel.dataset.mode !== 'album') return;

        panel.dataset.mode = '';
        if (!document.querySelector("#lyrics-content.active")) {
            panel.classList.remove('active');
            document.querySelector(".app").classList.remove("right-panel-open");
        }
    }

    setupEventListeners() {
        document.addEventListener('keydown', (e) => {
            const tag = e.target.tagName.toLowerCase();

            if (tag === 'input' || tag === 'textarea') return;
            switch (e.key) {
                case " ":
                case "k":
                case "K":
                    e.preventDefault();
                    this.app.player.togglePlayPause();
                    break;
                
                case "m":
                case "M":
                    this.app.player.toggleMute();
                    break;
            }
        });

        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                this.navigateToPage(e.target.dataset.page);
            });
        });

        document.getElementById('search-input').addEventListener('input', (e) => {
            this.app.search.debouncedSearch(e.target.value);
        });

        document.getElementById('search-btn').addEventListener('click', () => {
            this.app.search.performSearch();
        });

        document.getElementById('play-pause-btn').addEventListener('click', () => {
            this.app.player.togglePlayPause();
        });

        document.getElementById('next-btn').addEventListener('click', () => {
            this.app.player.nextTrack();
        });

        document.getElementById('prev-btn').addEventListener('click', () => {
            this.app.player.previousTrack();
        });

        document.getElementById('loop-btn').addEventListener('click', () => {
            this.app.player.toggleLoopMode();
            this.updateLoopUI();
        });

        document.getElementById('shuffle-btn').addEventListener('click', () => {
            this.app.player.toggleShuffleMode();
        });

        document.getElementById('progress-bar').addEventListener('input', (e) => {
            this.app.player.seekTo(e.target.value);
        });

        document.getElementById('mute-btn').addEventListener('click', (e) => {
            this.app.player.toggleMute();
            this.updateSoundUI();
        });

        document.getElementById('volume-bar').addEventListener('input', (e) => {
            this.app.player.setVolume(e.target.value);
            this.updateSoundUI();
        });

        document.querySelector('.create-playlist-btn').addEventListener('click', () => {
            this.app.playlists.showCreatePlaylistModal();
        });

        this.updateLoopUI();
        this.updateSoundUI();
        this.updateShuffleUI();
    }

    updateLoopUI() {
        const loopBtn = document.getElementById('loop-btn');

        loopBtn.classList.remove('active');

        if (this.app.loopMode !== 'none') {
            loopBtn.classList.add('active');
        }
        let icon = "";

        switch (this.app.loopMode) {
            case 'track':
                icon = 'repeat-1';
                loopBtn.classList.add('active');
                break;

            case 'queue':
                icon = 'repeat';
                loopBtn.classList.add('active');
                break;

            case 'none':
            default:
                icon = 'repeat';
                break;
        }

        loopBtn.innerHTML = `<i data-lucide="${icon}"></i>`;

        lucide.createIcons();
    }

    updateSoundUI() {
        const muteBtn = document.getElementById('mute-btn');
        const isMuted = this.app.currentAudio ? this.app.currentAudio.muted : !!this.app.isMuted;
        
        let volumeIcon = "-x";
        const volume = this.app.currentAudio ? this.app.currentAudio.volume : document.getElementById("volume-bar").value / 100;
        if (volume === 0) {
            volumeIcon = "-x"
        } else if (volume <= 0.33) {
            volumeIcon = "";
        } else if (volume <= 0.66) {
            volumeIcon = "-1";
        } else {
            volumeIcon = "-2";
        }
        
        muteBtn.innerHTML = `<i data-lucide="volume${isMuted ? '-off' : volumeIcon}"></i>`

        lucide.createIcons();
    }

    updateShuffleUI() {
        const shuffleBtn = document.getElementById('shuffle-btn');
        if (!shuffleBtn) return;

        shuffleBtn.classList.remove('active', 'shuffle-all');

        if (this.app.player.shuffleMode !== 'none') {
            shuffleBtn.classList.add('active');
            if (this.app.player.shuffleMode === 'all') {
                shuffleBtn.classList.add('shuffle-all');
            }
        }

        lucide.createIcons();
    }

    setupModalListeners() {
        const modal = document.getElementById('playlist-modal');
        const closeBtn = document.getElementById('modal-close');
        const cancelBtn = document.getElementById('btn-cancel');
        const form = document.getElementById('playlist-form');

        closeBtn.addEventListener('click', () => {
            this.app.playlists.closePlaylistModal();
        });

        cancelBtn.addEventListener('click', () => {
            this.app.playlists.closePlaylistModal();
        });

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.app.playlists.submitPlaylistForm();
        });

        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.app.playlists.closePlaylistModal();
            }
        });
    }

    clearMainContent() {
        document.querySelector('.albums-section').style.display = 'none';
        document.getElementById('playlist-view').style.display = 'none';
        document.getElementById('settings-view').style.display = 'none';
    }

    navigateToPage(page) {
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
        });
        document.querySelector(`[data-page="${page}"]`).classList.add('active');

        this.clearMainContent();

        switch (page) {
            case 'home':
                document.querySelector('.albums-section').style.display = 'block';
                this.app.albums.loadAlbums();
                break;
            case 'playlists':
                this.app.playlists.showPlaylists();
                break;
            case 'unregistered':
                this.app.unregisteredFiles.showUnregisteredFiles();
                break;
            case 'settings':
                this.app.settingsManager.showSettings();
                break;
        }
    }

    formatTime(duration) {
        const minutes = Math.floor(duration / 60);
        const seconds = Math.floor(duration) % 60;

        const formattedSeconds = String(seconds).padStart(2, '0');

        return `${minutes}:${formattedSeconds}`;
    }
}