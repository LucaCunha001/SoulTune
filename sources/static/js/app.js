import { Player } from './modules/player.js';
import { Albums } from './modules/albums.js';
import { Playlists } from './modules/playlists.js';
import { Search } from './modules/search.js';
import { Settings } from './modules/settings.js';
import { UnregisteredFiles } from './modules/unregisteredFiles.js';
import { Lyrics } from './modules/lyrics.js';
import { UI } from './modules/ui.js';

class SoulTune {
    constructor() {
        this.audioQueue = [];
        this.currentAudioIndex = 0;
        this.currentAudio = null;
        this.delayTimeout = null;

        this.trackStartTime = null;

        this.currentTrack = null;
        this.currentPlaylist = null;
        this.isPlaying = false;

        this.playlistsList = [];
        this.searchTimeout = null;

        this.lyricsLines = [];
        this.lyricsCumulTimes = [];
        this.lyricsIndex = 0;
        this.visibleLyricsIndices = [];

        this.settings = {
            discordRpc: false,
            undertaleFolder: '',
            deltaruneFolder: '',
            autoStart: false,
            uiTheme: 0
        };

        this.player = new Player(this);
        this.albums = new Albums(this);
        this.playlists = new Playlists(this);
        this.search = new Search(this);
        this.settingsManager = new Settings(this);
        this.unregisteredFiles = new UnregisteredFiles(this);
        this.lyrics = new Lyrics(this);
        this.ui = new UI(this);

        this.init();
    }

    init() {
        this.ui.setupScrollListener();
        this.ui.setupEventListeners();
        this.ui.setupModalListeners();
        this.settingsManager.loadSettings();
        this.settingsManager.setupSettingsListeners();
        this.albums.loadAlbums();
        this.playlists.loadPlaylistsFromAPI();
        this.player.setupAudioEvents();
        this.player.initVolume();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new SoulTune();
    lucide.createIcons();
});