export class Player {
    constructor(app) {
        this.app = app;
    }

    updateMusic(track, album) {
        const now = Math.floor(Date.now() / 1000);

        if (window.api) {
            window.api.updateMusic(
                track.title,
                album,
                now,
                now + Math.floor(track.duration)
            );
        }

        if ('mediaSession' in navigator) {
            navigator.mediaSession.metadata = new MediaMetadata({
                title: track.title,
                artist: album?.artist || '',
                artwork: [{ src: album?.cover || 'static/images/icon.ico', sizes: '512x512', type: 'image/jpg' }]
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

        audio.onended = null;
        audio.ontimeupdate = null;
        audio.onloadedmetadata = null;

        audio.onloadedmetadata = () => {
            if (this.app.currentTrack && this.app.currentTrack.duration === 0) {
                this.app.currentTrack.duration = audio.duration;
            }

            this.app.audioQueue[this.app.currentAudioIndex].duration = audio.duration;

            if (this.app.delayTimeout) {
                clearTimeout(this.app.delayTimeout);
                this.app.delayTimeout = null;
            }

            if (this.app.audioQueue.length > 1 && this.app.currentAudioIndex + 1 < this.app.audioQueue.length) {
                const nextDelay = this.app.audioQueue[this.app.currentAudioIndex + 1].delay || 0;
                const startTime = (audio.duration + nextDelay) * 1000;

                const nextFile = this.app.audioQueue[this.app.currentAudioIndex + 1];
                const nextFileName = nextFile?.fileName || nextFile?.src?.split('/').pop()?.split('?')[0] || 'desconhecido';

                if (startTime >= 0) {
                    console.log(`[DEBUG] Agendando próximo arquivo "${nextFileName}" em ${startTime.toFixed(0)}ms (duração: ${audio.duration.toFixed(2)}s, delay: ${nextDelay}s)`);
                    this.app.delayTimeout = setTimeout(() => {
                        this.app.currentAudioIndex++;
                        this.playNextInQueue();
                    }, startTime);
                } else {
                    console.warn(`[WARN] startTime negativo (${startTime}ms) para transição do arquivo "${this.app.audioQueue[this.app.currentAudioIndex].fileName || this.app.audioQueue[this.app.currentAudioIndex].src}" para "${nextFileName}". Iniciando imediatamente.`);
                    this.app.currentAudioIndex++;
                    this.playNextInQueue();
                }
            }
        };

        audio.onended = () => {
            const currentFileName = this.app.audioQueue[this.app.currentAudioIndex]?.fileName || this.app.audioQueue[this.app.currentAudioIndex]?.src?.split('/').pop().split('?')[0] || 'desconhecido';
            console.log(`[DEBUG] Arquivo "${currentFileName}" terminou. Índice atual: ${this.app.currentAudioIndex}/${this.app.audioQueue.length - 1}`);

            if (!this.app.currentPlaylist || this.app.currentPlaylist.title === 'Arquivos Não Registrados') {
                console.log('[DEBUG] Arquivo não registrado terminou. Parando reprodução.');
                this.app.isPlaying = false;
                this.updatePlayerUI();
                this.updateMusic(this.app.currentTrack, { title: 'Arquivos Não Registrados' });
            } else {
                if (this.app.currentAudioIndex + 1 >= this.app.audioQueue.length) {
                    console.log('[DEBUG] Último arquivo da track terminou. Avançando para próxima track.');
                    this.nextTrack();
                } else {
                    console.log('[DEBUG] Arquivo terminou. A próxima parte deve ser iniciada pelo timeout agendado.');
                }
            }
        };

        audio.ontimeupdate = () => this.updateProgress();
    }

    async playTrack(track, album) {
        console.log(`[DEBUG] Iniciando reprodução da track: "${track.title}" (${track.files ? track.files.files.length : 1} arquivo(s))`);

        this.stopCurrentPlayback();

        this.app.currentTrack = { ...track, album };
        this.app.currentAudioIndex = 0;
        this.app.audioQueue = [];

        this.app.trackStartTime = Date.now();

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
                delay: track.files.delays[i] || 0,
                fileName
            }));
            console.log(`[DEBUG] Track com múltiplos arquivos preparada. Delays: [${track.files.delays.join(', ')}]`);
        }

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

        this.updateMusic(track, album);
        const panel = document.getElementById('right-panel');
        panel.classList.add('visible');
    }

    playNextInQueue() {
        if (this.app.currentAudioIndex >= this.app.audioQueue.length) {
            console.log('[DEBUG] Fim da fila de áudio. Avançando para próxima track.');
            this.nextTrack();
            return;
        }

        if (this.app.delayTimeout) {
            clearTimeout(this.app.delayTimeout);
            this.app.delayTimeout = null;
        }

        const { src, delay, fileName } = this.app.audioQueue[this.app.currentAudioIndex];
        console.log(`[DEBUG] Reproduzindo arquivo ${this.app.currentAudioIndex + 1}/${this.app.audioQueue.length}: ${fileName || src} (delay: ${delay || 0})`);

        const audio = new Audio(src);
        audio.playbackRate = this.app.currentTrack.pitch || 1;
        audio.preservesPitch = false;
        this.app.currentAudio = audio;
        this.setupAudioEvents(audio);

        audio.play();
    }

    stopCurrentPlayback() {
        if (this.app.currentAudio) {
            this.app.currentAudio.pause();
            this.app.currentAudio = null;
        }

        if (this.app.delayTimeout) {
            clearTimeout(this.app.delayTimeout);
            this.app.delayTimeout = null;
        }

        this.app.lyricsIndex = 0;
    }

    togglePlayPause() {
        if (!this.app.currentAudio) return;

        if (this.app.isPlaying) {
            this.app.currentAudio.pause();
            if (this.app.delayTimeout) clearTimeout(this.app.delayTimeout);
        } else {
            this.app.currentAudio.play();
        }

        this.app.isPlaying = !this.app.isPlaying;
        this.updatePlayerUI();
        navigator.mediaSession.playbackState = this.app.isPlaying ? "playing" : "paused";
    }

    nextTrack() {
        if (!this.app.currentPlaylist || !this.app.currentTrack) return;

        if (this.app.currentPlaylist.title === 'Arquivos Não Registrados') return;

        const i = this.app.currentPlaylist.tracks.findIndex(t => t.id === this.app.currentTrack.id);
        const isLastTrack = i === this.app.currentPlaylist.tracks.length - 1;

        if (isLastTrack) {
            if (this.app.currentAudio) {
                this.app.currentAudio.pause();
                this.app.isPlaying = false;
                this.updatePlayerUI();
            }
            return;
        }

        const next = i + 1;
        this.playTrack(this.app.currentPlaylist.tracks[next], this.app.currentPlaylist);
    }

    previousTrack() {
        if (!this.app.currentPlaylist || !this.app.currentTrack) return;

        if (this.app.currentPlaylist.title === 'Arquivos Não Registrados') return;

        const i = this.app.currentPlaylist.tracks.findIndex(t => t.id === this.app.currentTrack.id);
        const prev = i > 0 ? i - 1 : this.app.currentPlaylist.tracks.length - 1;

        this.playTrack(this.app.currentPlaylist.tracks[prev], this.app.currentPlaylist);
    }

    updateProgress() {
        if (!this.app.currentAudio || !this.app.currentTrack) return;

        const currentTime = this.app.currentAudio.currentTime;
        const audioDuration = this.app.currentAudio.duration || this.app.currentTrack.duration || 1;
        const trackDuration = this.app.currentTrack.duration || 1;

        let totalProgress = 0;
        let totalCurrentTime = 0;

        if (this.app.audioQueue.length > 1) {
            totalCurrentTime = 0;
            for (let i = 0; i < this.app.currentAudioIndex; i++) {
                const fileDuration = this.app.audioQueue[i].duration || 0;
                const nextDelay = this.app.audioQueue[i + 1]?.delay || 0;
                totalCurrentTime += fileDuration + nextDelay;
            }
            totalCurrentTime += currentTime;
            totalProgress = (totalCurrentTime / trackDuration) * 100;
        } else {
            totalProgress = (currentTime / audioDuration) * 100;
            totalCurrentTime = currentTime;
        }

        document.getElementById('progress-bar').value = totalProgress;
        document.getElementById('current-time').textContent = this.app.ui.formatTime(totalCurrentTime);
        document.getElementById('total-time').textContent = this.app.ui.formatTime(trackDuration);

        if (this.app.lyricsLines.length > 0 && this.app.lyricsIndex < this.app.lyricsLines.length) {
            while (this.app.lyricsIndex < this.app.lyricsLines.length && currentTime >= this.app.lyricsCumulTimes[this.app.lyricsIndex]) {
                const visibleIndex = this.app.visibleLyricsIndices.indexOf(this.app.lyricsIndex);
                if (visibleIndex !== -1) {
                    this.app.lyrics.displayLyricsLine(visibleIndex);
                }
                this.app.lyricsIndex++;
            }
        }
    }

    seekTo(value) {
        if (!this.app.currentAudio || !this.app.currentTrack) return;

        const trackDuration = this.app.currentTrack.duration || 1;
        const seekTime = (value / 100) * trackDuration;

        if (this.app.audioQueue.length > 1) {
            let cumulativeTime = 0;
            let targetFileIndex = 0;

            for (let i = 0; i < this.app.audioQueue.length; i++) {
                const fileDuration = this.app.audioQueue[i].duration || 0;
                const nextDelay = this.app.audioQueue[i + 1]?.delay || 0;

                const segmentEnd = cumulativeTime + fileDuration + Math.max(0, nextDelay);

                if (seekTime < segmentEnd) {
                    targetFileIndex = i;
                    break;
                }

                cumulativeTime += fileDuration + nextDelay;
            }

            const timeInFile = seekTime - cumulativeTime;

            if (targetFileIndex !== this.app.currentAudioIndex) {
                this.stopCurrentPlayback();
                this.app.currentAudioIndex = targetFileIndex;
                this.playNextInQueue();

                setTimeout(() => {
                    if (this.app.currentAudio) {
                        this.app.currentAudio.currentTime = Math.max(0, timeInFile);
                    }
                }, 100);
            } else {
                this.app.currentAudio.currentTime = Math.max(0, timeInFile);
            }
        } else {
            this.app.currentAudio.currentTime = seekTime;
        }
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
        playPauseBtn.innerHTML = this.app.isPlaying ? '<i data-lucide="pause"></i>' : '<i data-lucide="play"></i>';

        if (this.app.currentTrack) {
            document.getElementById('current-track-title').textContent = this.app.currentTrack.title;
            document.getElementById('current-track-artist').textContent = this.app.currentTrack.album?.artist || "Toby Fox...?";
            document.getElementById('current-track-cover').src = this.app.currentTrack.album?.cover || "static/images/icon.ico";
        }

        lucide.createIcons();
    }
}