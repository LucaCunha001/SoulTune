const state = {
    albumName: '',
    audioQueue: [],
    timeline: [],
    markers: [],
    currentAudioIndex: 0,
    currentAudio: null,
    isPlaying: false
};

function el(tag, props = {}) {
    const e = document.createElement(tag);
    if (props.class) e.className = props.class;
    if (props.text) e.textContent = props.text;
    if (props.html) e.innerHTML = props.html;
    return e;
}

function renderAll() {
    renderList();
    renderMarkers();
}

async function getAudioDuration(src) {
    return new Promise(resolve => {
        const audio = new Audio();
        audio.src = src;
        audio.preload = 'metadata';

        audio.onloadedmetadata = () => resolve(audio.duration || 0);
        audio.onerror = () => resolve(0);
    });
}

async function prepareQueue() {
    for (const file of state.audioQueue) {
        if (!file.duration) {
            file.duration = await getAudioDuration(file.src);
        }
    }
}

function buildTimeline() {
    let timeCursor = 0;

    state.timeline = state.audioQueue.map((file, i) => {
        const seg = {
            index: i,
            start: timeCursor,
            end: timeCursor + file.duration,
            delay: file.delay || 0
        };

        timeCursor += file.duration + seg.delay;
        return seg;
    });
}

async function loadAlbums() {
    const res = await fetch('/api/albums');
    const albums = await res.json();

    const select = document.getElementById('album-select');
    select.innerHTML = '';

    albums.forEach(album => {
        const opt = el('option', { text: album.title });
        opt.value = album.id;
        select.appendChild(opt);
    });

    select.onchange = loadTracks;
    loadTracks();
}

async function loadTracks() {
    const albumId = document.getElementById('album-select').value;
    const res = await fetch(`/api/album/${albumId}`);
    const album = await res.json();

    const select = document.getElementById('track-select');
    select.innerHTML = '';

    album.tracks.forEach(track => {
        const opt = el('option', { text: track.title });
        opt.value = track.id;
        select.appendChild(opt);
    });
}

async function loadFromAPI() {
    const album = document.getElementById("album-select").value;
    const track = document.getElementById("track-select").value;

    state.albumName = album;

    const res = await fetch(`/api/track-dev?album=${album}&track=${track}`);
    const data = await res.json();

    state.trackId = track;

    if (data.files.files.length === 1) {
        state.audioQueue = [{
            src: `/api/music/${album}/${track}`,
            name: data.files.files[0],
            delay: 0,
            duration: 0
        }];
    } else {
        state.audioQueue = data.files.files.map((name, i) => ({
            src: `/api/music/${album}/${track}?part=${i}`,
            name,
            delay: data.files.delays?.[i] || 0,
            duration: 0
        }));
    }

    if (data.lyrics?.linhas && data.lyrics?.tempos) {
        countLyrics(data.lyrics);
    } else {
        state.markers = [];
    }

    await prepareQueue();
    buildTimeline();

    renderAll();
}

function play() {
    if (state.currentAudio && !state.currentAudio.ended) {
        state.currentAudio.play();
        state.isPlaying = true;
        return;
    }
    playCurrent();
}

function playCurrent() {
    if (state.currentAudioIndex >= state.audioQueue.length) return;

    state.currentAudio?.pause();

    const file = state.audioQueue[state.currentAudioIndex];
    const audio = new Audio(file.src);

    state.currentAudio = audio;
    state.isPlaying = true;

    audio.ontimeupdate = () => {
        updateLoop();

        const segment = state.timeline[state.currentAudioIndex];
        const next = state.timeline[state.currentAudioIndex + 1];

        if (!segment) return;

        const globalTime = segment.start + audio.currentTime;

        if (next && globalTime >= next.start) {
            state.currentAudioIndex++;
            playCurrent();
        }
    };

    audio.onended = () => {
        state.currentAudioIndex++;
        playCurrent();
    };

    audio.play().catch(() => {
        console.error('Erro ao tocar:', file.src);
    });
}

function pause() {
    state.currentAudio?.pause();
    state.isPlaying = false;
}

function reset() {
    state.currentAudio?.pause();
    state.currentAudio = null;
    state.currentAudioIndex = 0;
}

function seek(s) {
    if (state.currentAudio) {
        state.currentAudio.currentTime += s;
    }
}

function getGlobalTime() {
    if (!state.currentAudio) return 0;

    const segment = state.timeline[state.currentAudioIndex];
    if (!segment) return 0;

    return segment.start + state.currentAudio.currentTime;
}

function updateLoop() {
    const time = getGlobalTime();
    document.getElementById('time').innerText = time.toFixed(2);
    updateCurrentLyric(time);
}

function renderList() {
    const container = document.getElementById('files');
    container.innerHTML = '';

    state.audioQueue.forEach(f => {
        const row = el('div');

        const name = el('span', { text: f.name });

        const input = el('input');
        input.type = 'number';
        input.step = '0.1';
        input.value = f.delay;

        input.oninput = () => {
            f.delay = parseFloat(input.value) || 0;
            buildTimeline();
        };

        row.append(name, input);
        container.appendChild(row);
    });
}

function countLyrics(lyrics) {
    let acc = 0;

    state.markers = lyrics.linhas.map((text, i) => {
        const marker = { text, time: acc };
        acc += lyrics.tempos[i] || 0;
        return marker;
    });
}

function addLyric() {
    state.markers.push({
        time: getGlobalTime(),
        text: ''
    });
    renderMarkers();
}

function addLyricManual() {
    state.markers.push({ time: 0, text: '' });
    renderMarkers();
}

function renderMarkers() {
    const container = document.getElementById('markers');
    container.innerHTML = '';

    state.markers
        .sort((a, b) => a.time - b.time)
        .forEach((m, index) => {

            const row = el('div');

            const time = el('input');
            time.type = 'number';
            time.step = '0.1';
            time.value = m.time;

            const text = el('input');
            text.value = m.text;

            const del = el('button', { text: 'X' });

            time.onchange = () => {
                m.time = parseFloat(time.value) || 0;
                renderMarkers();
            };

            text.oninput = () => {
                m.text = text.value;
            };

            del.onclick = () => {
                state.markers.splice(index, 1);
                renderMarkers();
            };

            row.append(time, text, del);
            container.appendChild(row);
        });
}

function updateCurrentLyric(time) {
    let index = -1;

    state.markers.forEach((m, i) => {
        if (time >= m.time) index = i;
    });

    const rows = document.querySelectorAll('#markers div');

    rows.forEach((el, i) => {
        el.classList.toggle('active', i === index);
    });

    const current = document.getElementById("current-lyric");

    current.innerText = index >= 0 ? state.markers[index].text : '';
}

function exportJSON() {
    const sorted = [...state.markers].sort((a, b) => a.time - b.time);

    const tempos = [];

    for (let i = 0; i < sorted.length - 1; i++) {
        const delta = sorted[i + 1].time - sorted[i].time;
        tempos.push(Number(delta.toFixed(2)));
    }

    const data = {
        files: {
            files: state.audioQueue.map(f => f.name),
            delays: state.audioQueue.map(f => f.delay)
        },
        lyrics: {
            linhas: sorted.map(m => m.text),
            tempos
        }
    };

    document.getElementById('json-editor').value =
        JSON.stringify(data, null, 2);
}

async function applyJSON() {
    const textarea = document.getElementById('json-editor');
    let parsed;

    try {
        parsed = JSON.parse(textarea.value);
    } catch {
        alert('JSON inválido');
        return;
    }

    if (!parsed.files || !parsed.lyrics) {
        alert('Estrutura inválida');
        return;
    }

    if (parsed.lyrics.tempos.length !== parsed.lyrics.linhas.length - 1) {
        alert('Tempos deve ser linhas - 1');
        return;
    }

    const album = state.albumName;

    if (parsed.files.files.length === 1) {
        state.audioQueue = [{
            src: `/api/music/${album}/${track}`,
            name: parsed.files.files[0],
            delay: 0,
            duration: 0
        }];
    } else {
        state.audioQueue = parsed.files.files.map((name, i) => ({
            src: `/api/music/${album}/${track}?part=${i}`,
            name,
            delay: parsed.files.delays?.[i] || 0,
            duration: 0
        }));
    }
    
    countLyrics(parsed.lyrics);

    await prepareQueue();
    buildTimeline();

    renderAll();

    alert('JSON aplicado');
}

document.addEventListener('keydown', e => {
    if (e.code === 'Space') {
        e.preventDefault();
        state.isPlaying ? pause() : play();
    }

    if (e.key.toLowerCase() === 'm') addLyric();
    if (e.key === 'ArrowLeft') seek(-1);
    if (e.key === 'ArrowRight') seek(1);
});

loadAlbums();