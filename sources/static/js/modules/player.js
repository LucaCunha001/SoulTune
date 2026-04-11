export class Player {
    constructor(app) {
        this.app = app;
        this.durationCache = new Map();
        this.shuffleMode = 'none'; // 'none', 'context' (current album/playlist), 'all' (all albums)
        this.shuffledIndices = [];
        this.shuffledIndex = 0;
        this.autoRunMode = false;
        this.loadShuffleSettings();
        this.loadAutoRunSettings();
    }

    loadShuffleSettings() {
        const saved = localStorage.getItem('shuffleMode');
        if (saved) {
            this.shuffleMode = saved;
        }
    }

    saveShuffleSettings() {
        localStorage.setItem('shuffleMode', this.shuffleMode);
    }

    loadAutoRunSettings() {
        const saved = localStorage.getItem('autoRunMode');
        if (saved) {
            this.autoRunMode = saved === "true";
        }
    }

    saveAutoRunSettings() {
        localStorage.setItem('autoRunMode', this.autoRunMode);
    }

    playingTrack(track) {
        if (!track?.title) return;
        
        document.querySelectorAll(".track-item").forEach((element) => {
            const title = element.querySelector(".track-title").innerHTML;
            if (title == track.title) {
                element.classList.add("playing");
            } else {
                element.classList.remove("playing");
            }
        });
    }

    async updateRPC() {
        const now = Math.floor(Date.now() / 1000);
        const { globalTime, total } = await this.getCurrentProgress();
        if (window.api) {

            const startTimestamp = now - Math.floor(globalTime);
            const endTimestamp = startTimestamp + Math.floor(total);

            window.api.updateMusic(
                this.app.currentTrack,
                startTimestamp,
                endTimestamp
            );
        }
    }

    updateMusic(track, album) {
        if ('mediaSession' in navigator) {
            navigator.mediaSession.metadata = new MediaMetadata({
                title: track.title,
                artist: album?.artist || '',
                artwork: [{ src: album?.cover || 'static/images/icon.ico', sizes: '512x512', type: 'image/jpg' }],
                album: album?.title
            });

            navigator.mediaSession.playbackState = this.app.isPlaying ? "playing" : "paused";

            const actions = {
                play: () => this.togglePlayPause(),
                pause: () => this.togglePlayPause(),
                nexttrack: () => this.nextTrack(),
                previoustrack: () => this.previousTrack()
            };

            for (const [action, handler] of Object.entries(actions)) {
                try { navigator.mediaSession.setActionHandler(action, handler); }
                catch (e) { }
            }
        }
    }

    setupAudioEvents(audio) {
        if (!audio) return;

        audio.onloadedmetadata = () => {
            const segment = this.app.timeline[this.app.currentAudioIndex];

            if (segment) {
                segment.end = segment.start + audio.duration;

                const next = this.app.timeline[this.app.currentAudioIndex + 1];
                if (next) {
                    next.start = segment.end + segment.delay;
                }
            }

            if (this.app.currentTrack.duration === 0) {
                const last = this.app.timeline[this.app.timeline.length - 1];
                if (last?.end) this.app.currentTrack.duration = last.end;
            }
        };

        audio.ontimeupdate = () => {
            this.updateProgress();

            const i = this.app.currentAudioIndex;
            const segment = this.app.timeline[i];
            const next = this.app.timeline[i + 1];

            if (!segment || segment.end === null) return;

            const globalTime = segment.start + audio.currentTime;

            if (next && globalTime >= next.start) {
                this.app.currentAudioIndex++;
                this.playNextInQueue();
            }
        };

        audio.onended = () => {
            this.app.currentAudioIndex++;
            this.playNextInQueue();
        };
    }

    async playTrack(track, album) {
        this.stopCurrentPlayback();
        this.stopVideo();

        this.app.currentTrack = { ...track, album };
        this.app.currentAudioIndex = 0;
        this.app.audioQueue = [];
        this.app.timeline = [];

        if (this.shuffleMode !== 'none' && this.shuffledIndices.length === 0) {
            this.initializeShuffle();
        }

        if (track.file) {
            this.app.audioQueue = [{
                src: `/api/music/${album.id}/${track.id}`,
                delay: 0,
                fileName: track.file
            }];
        }

        else if (track.files) {
            this.app.audioQueue = track.files.files.map((fileName, i) => ({
                src: `/api/music/${album.id}/${track.id}?part=${i}`,
                delay: track.files.delays?.[i] || 0,
                fileName
            }));
        }

        await this.prepareQueue();

        let timeCursor = 0;

        this.app.timeline = this.app.audioQueue.map((file, i) => {
            const seg = {
                index: i,
                start: timeCursor,
                end: timeCursor + (file.duration || 0),
                delay: file.delay || 0
            };

            timeCursor += (file.duration || 0) + (file.delay || 0);

            return seg;
        });

        this.app.isPlaying = true;
        this.playNextInQueue();
        this.updatePlayerUI();

        if (track.lyrics) {
            this.app.lyricsLines = track.lyrics.linhas || [];
            this.app.lyricsCumulTimes = [0];
            const times = track.lyrics.tempos || [];
            for (let i = 0; i < times.length; i++) {
                this.app.lyricsCumulTimes.push(this.app.lyricsCumulTimes[i] + times[i]);
            }
            this.app.lyricsIndex = 0;
            this.app.lyrics.showLyricsPanel();
        } else {
            this.app.lyrics.hideLyricsPanel();
        }
        this.playingTrack(track);
        this.updateMusic(track, album);
        await this.updateRPC();
        this.app.ui.updateSoundUI();

        if (track.video) {
            this.showVideo(track.video);
        }

        document.getElementById('right-panel').classList.add('visible');
    }

    playNextInQueue() {
        if (this.app.currentAudioIndex >= this.app.audioQueue.length) {

            switch (this.app.loopMode) {
                case 'track':
                    this.app.currentAudioIndex = 0;
                    break;

                case 'queue':
                    this.app.currentAudioIndex = 0;
                    if (this.shuffleMode !== 'none') {
                        this.initializeShuffle();
                    }
                    break;

                case 'none':
                default:
                    if (this.autoRunMode) this.nextTrack();
                    return;
            }
        }

        if (this.app.currentAudioIndex < 0 || this.app.audioQueue.length === 0) {
            return;
        }

        if (this.app.currentAudio) {
            this.app.currentAudio.pause();
        }

        const { src } = this.app.audioQueue[this.app.currentAudioIndex];

        const audio = new Audio(src);
        audio.playbackRate = this.app.currentTrack.pitch || 1;
        audio.preservesPitch = false;
        audio.muted = !!this.app.isMuted;

        this.app.currentAudio = audio;

        this.setupAudioEvents(audio);

        audio.play();
        this.initVolume();
        if (['track', 'queue'].includes(this.app.loopMode)) {
            this.updateRPC();
        }
    }

    toggleLoopMode() {
        const modes = ['none', 'track', 'queue'];
        const currentIndex = modes.indexOf(this.app.loopMode);

        this.app.loopMode = modes[(currentIndex + 1) % modes.length];

        this.app.ui.updateLoopUI();
    }

    toggleShuffleMode() {
        if (!this.app.currentPlaylist && !this.app.albums?.allAlbums?.length) {
            return;
        }

        if (this.app.currentPlaylist) {
            const modes = ['none', 'context'];
            const currentIndex = modes.indexOf(this.shuffleMode);
            this.shuffleMode = modes[(currentIndex + 1) % modes.length];
        } else {
            const modes = ['none', 'context', 'all'];
            const currentIndex = modes.indexOf(this.shuffleMode);
            this.shuffleMode = modes[(currentIndex + 1) % modes.length];
        }

        this.saveShuffleSettings();
        this.initializeShuffle();
        this.app.ui.updateShuffleUI();
    }

    initializeShuffle() {
        if (this.shuffleMode === 'none') {
            this.shuffledIndices = [];
            this.shuffledIndex = 0;
            return;
        }

        let tracks = [];
        
        if (this.app.currentPlaylist) {
            tracks = this.app.currentPlaylist.tracks || [];
        } else if (this.app.currentTrack?.album) {
            if (this.shuffleMode === 'context') {
                tracks = this.app.currentTrack.album.tracks || [];
            } else if (this.shuffleMode === 'all' && this.app.albums?.allAlbums) {
                tracks = [];
                for (const album of this.app.albums.allAlbums) {
                    tracks.push(...(album.tracks || []));
                }
            }
        }

        this.shuffledIndices = Array.from({ length: tracks.length }, (_, i) => i);
        this.shuffleArray(this.shuffledIndices);

        const currentTrackId = this.app.currentTrack?.id;
        const currentIdx = tracks.findIndex(t => t.id === currentTrackId);
        
        if (currentIdx !== -1) {
            const pos = this.shuffledIndices.indexOf(currentIdx);
            if (pos !== -1) {
                [this.shuffledIndices[0], this.shuffledIndices[pos]] = [this.shuffledIndices[pos], this.shuffledIndices[0]];
            }
        }

        this.shuffledIndex = 0;
    }

    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    getNextTrackIndex() {
        if (this.shuffleMode === 'none') {
            if (!this.app.currentPlaylist && !this.app.currentTrack?.album) {
                return -1;
            }

            const trackList = this.app.currentPlaylist?.tracks || this.app.currentTrack?.album?.tracks || [];
            const currentIdx = trackList.findIndex(t => t.id === this.app.currentTrack?.id);
            return currentIdx + 1 < trackList.length ? currentIdx + 1 : -1;
        } else {
            this.shuffledIndex++;
            if (this.shuffledIndex < this.shuffledIndices.length) {
                return this.shuffledIndices[this.shuffledIndex];
            }
            return -1;
        }
    }

    stopCurrentPlayback() {
        if (this.app.currentAudio) {
            this.app.currentAudio.pause();
            this.app.currentAudio = null;
        }
    }

    togglePlayPause() {
        if (!this.app.currentAudio) return;

        const video = document.getElementById('easter-egg-video');
        const overlay = document.getElementById('video-overlay');

        if (this.app.isPlaying) {
            this.app.currentAudio.pause();
            if (video && overlay && overlay.style.display === 'flex') {
                video.pause();
            }
        } else {
            this.app.currentAudio.play();
            if (video && overlay && overlay.style.display === 'flex') {
                video.play();
            }
        }

        this.app.isPlaying = !this.app.isPlaying;
        this.updatePlayerUI();
    }

    toggleMute() {
        this.app.isMuted = !this.app.isMuted;

        if (this.app.currentAudio) {
            this.app.currentAudio.muted = this.app.isMuted;
        }

        this.updatePlayerUI();
    }

    toggleAutoRun() {
        this.autoRunMode = !this.autoRunMode;
        this.saveAutoRunSettings();
    }

    async getCurrentProgress() {
        if (!this.app.currentAudio) return { progress: 0, globalTime: 0, total: 0 };

        const currentTime = this.app.currentAudio.currentTime;
        const rate = this.app.currentTrack.pitch || 1;

        let total, progress, globalTime;

        if (!this.isMultiFileTrack()) {
            if (isNaN(this.app.currentAudio.duration) || this.app.currentAudio.duration === Infinity) {
                total = await this.getAudioDuration(this.app.audioQueue[0].src);
            } else {
                total = this.app.currentAudio.duration;
            }

            progress = (currentTime / total) * 100;
            globalTime = currentTime / rate;
            total = total / rate;
        } else {
            const segment = this.app.timeline[this.app.currentAudioIndex];
            if (!segment) return { progress: 0, globalTime: 0, total: 0 };

            globalTime = (segment.start + currentTime) / rate;
            total = await this.getTrackDuration();
            progress = (globalTime / total) * 100;
        }

        return { progress, globalTime, total };
    }

    async updateProgress() {
        if (!this.app.currentAudio) return;

        const { progress, globalTime, total } = await this.getCurrentProgress();

        document.getElementById('progress-bar').value = progress;
        document.getElementById('current-time').textContent = this.app.ui.formatTime(globalTime);
        document.getElementById('total-time').textContent = this.app.ui.formatTime(total);

        this.updateLyricsPosition(globalTime);
    }

    updateLyricsPosition(globalTime) {
        if (!this.app.lyricsCumulTimes || this.app.lyricsCumulTimes.length === 0) return;

        let newIndex = 0;

        for (let i = 0; i < this.app.lyricsCumulTimes.length; i++) {
            if (globalTime >= this.app.lyricsCumulTimes[i]) {
                newIndex = i;
            } else {
                break;
            }
        }

        if (newIndex === this.app.lyricsIndex) return;

        this.app.lyricsIndex = newIndex;

        let renderedIndex = newIndex;
        if (Array.isArray(this.app.lyricsLines) && this.app.lyricsLines.length > 0) {
            const mapped = this.app.lyricsLines.indexOf(newIndex);
            if (mapped !== -1) renderedIndex = mapped;
        }

        if (renderedIndex >= 0) {
            this.app.lyrics.displayLyricsLine(renderedIndex);
        }
    }

    async seekTo(value) {
        if (!this.app.currentAudio) return;

        if (!this.isMultiFileTrack()) {
            const duration = this.app.currentAudio.duration || 1;
            this.app.currentAudio.currentTime = (value / 100) * duration;
            return;
        }

        const total = await this.getTrackDuration();
        const target = (value / 100) * total;

        const index = this.app.timeline.findIndex(seg =>
            target >= seg.start && target < (seg.end ?? Infinity)
        );

        if (index === -1) return;

        const seg = this.app.timeline[index];
        const timeInFile = target - seg.start;

        this.stopCurrentPlayback();
        this.app.currentAudioIndex = index;
        this.playNextInQueue();
        await this.updateRPC();

        setTimeout(() => {
            if (this.app.currentAudio) {
                this.app.currentAudio.currentTime = Math.max(0, timeInFile);
            }
        }, 50);
    }

    nextTrack() {
        if (!this.app.currentPlaylist && !this.app.currentTrack?.album) return;

        const trackList = this.app.currentPlaylist?.tracks || this.app.currentTrack?.album?.tracks || [];
        const album = this.app.currentPlaylist || this.app.currentTrack?.album;

        if (!trackList || !album) return;

        let nextIdx;
        if (this.shuffleMode === 'none') {
            const i = trackList.findIndex(t => t.id === this.app.currentTrack.id);
            nextIdx = i + 1;
        } else {
            nextIdx = this.getNextTrackIndex();
        }

        if (nextIdx >= trackList.length || nextIdx < 0) {
            this.stopCurrentPlayback();
            this.app.isPlaying = false;
            this.updatePlayerUI();
            return;
        }

        this.playTrack(trackList[nextIdx], album);
    }

    previousTrack() {
        if (!this.app.currentPlaylist && !this.app.currentTrack?.album) return;

        const trackList = this.app.currentPlaylist?.tracks || this.app.currentTrack?.album?.tracks || [];
        const album = this.app.currentPlaylist || this.app.currentTrack?.album;

        if (!trackList || !album) return;

        let prevIdx;
        if (this.shuffleMode === 'none') {
            const i = trackList.findIndex(t => t.id === this.app.currentTrack.id);
            prevIdx = i > 0 ? i - 1 : trackList.length - 1;
        } else {
            prevIdx = this.shuffledIndices[Math.max(0, this.shuffledIndex - 1)];
            this.shuffledIndex = Math.max(0, this.shuffledIndex - 1);
        }

        this.playTrack(trackList[prevIdx], album);
    }

    setVolume(value) {
        const vol = value / 100;
        if (this.app.currentAudio) this.app.currentAudio.volume = vol;
        localStorage.setItem('volume', vol);
    }

    initVolume() {
        const vol = parseFloat(localStorage.getItem('volume')) || 0.8;
        this.setVolume(vol * 100);
        document.getElementById('volume-bar').value = vol * 100;
    }

    updatePlayerUI() {
        const playPauseBtn = document.getElementById('play-pause-btn');
        playPauseBtn.innerHTML = this.app.isPlaying
            ? '<i data-lucide="pause"></i>'
            : '<i data-lucide="play"></i>';

        if (this.app.currentTrack) {
            document.getElementById('current-track-title').textContent = this.app.currentTrack.title;
            document.getElementById('current-track-artist').textContent =
                this.app.currentTrack.album?.artist || "Toby Fox...?";

            document.getElementById('current-track-cover').src =
                this.app.currentTrack.album?.cover || "../static/images/icon.ico";
        }

        lucide.createIcons();
    }

    async getTrackDurationFromData(track, album) {
        const rate = track.pitch || 1;
        if (track.file) {
            const duration = await this.getAudioDuration(
                `/api/music/${album.id}/${track.id}`
            );
            return duration / rate;
        }

        if (track.files?.files) {
            let total = 0;

            for (let i = 0; i < track.files.files.length; i++) {
                let duration = 0;

                if (track.files.durations?.[i]) {
                    duration = track.files.durations[i];
                } else {
                    duration = await this.getAudioDuration(
                        `/api/music/${album.id}/${track.id}?part=${i}`
                    );
                }

                total += duration;

                if (i < track.files.files.length - 1) {
                    total += track.files.delays?.[i] || 0;
                }
            }

            return total / rate;
        }

        return 1;
    }

    async getTrackDuration() {
        return await this.getTrackDurationFromData(this.app.currentTrack, this.app.currentTrack.album);
    }

    isMultiFileTrack() {
        return this.app.audioQueue.length > 1;
    }

    async prepareQueue() {
        const promises = this.app.audioQueue.map(async (file) => {
            if (!file.duration) {
                file.duration = await this.getAudioDuration(file.src);
            }
        });
        await Promise.all(promises);
    }

    getAudioDuration(src) {
        if (this.durationCache.has(src)) {
            return Promise.resolve(this.durationCache.get(src));
        }

        return new Promise((resolve) => {
            const audio = new Audio();
            audio.src = src;
            audio.preload = 'metadata';
            audio.crossOrigin = 'anonymous';

            const timeout = setTimeout(() => {
                this.durationCache.set(src, 0);
                resolve(0);
            }, 5000);

            audio.onloadedmetadata = () => {
                clearTimeout(timeout);
                const duration = audio.duration;
                this.durationCache.set(src, duration);
                resolve(duration);
            };

            audio.onerror = () => {
                clearTimeout(timeout);
                this.durationCache.set(src, 0);
                resolve(0);
            };
        });
    }

    showVideo(videoPath) {
        const overlay = document.getElementById('video-overlay');
        const video = document.getElementById('easter-egg-video');
        
        if (!overlay || !video) return;
        
        const videoUrl = `/api/music/${this.app.currentTrack.album.id}/${this.app.currentTrack.id}?video=true`;
        video.src = videoUrl;
        overlay.style.display = 'flex';
        
        if (this.app.currentAudio) {
            setTimeout(() => {
                video.currentTime = this.app.currentAudio.currentTime;
                video.play();
            }, 100);
        }
    }

    stopVideo() {
        const overlay = document.getElementById('video-overlay');
        const video = document.getElementById('easter-egg-video');
        
        if (!overlay || !video) return;

        video.pause();
        video.src = '';
        overlay.style.display = 'none';
    }

    setupPlaybackSync() {
        const video = document.getElementById('easter-egg-video');
        const closeBtn = document.getElementById('close-video-btn');

        if (!video || !closeBtn) return;

        closeBtn.addEventListener('click', () => {
            this.stopVideo();
        });

        video.addEventListener('play', () => {
            if (this.app.currentAudio && !this.app.isPlaying) {
                this.app.currentAudio.play();
                this.app.isPlaying = true;
            }
        });

        video.addEventListener('pause', () => {
            if (this.app.currentAudio && this.app.isPlaying) {
                this.app.currentAudio.pause();
                this.app.isPlaying = false;
            }
        });

        video.addEventListener('timeupdate', () => {
            if (this.app.currentAudio && Math.abs(video.currentTime - this.app.currentAudio.currentTime) > 0.5) {
                this.app.currentAudio.currentTime = video.currentTime;
            }
        });
    }
}