import express from "express";
import { join, extname, relative, basename, normalize, resolve } from "path";
import { readFileSync, existsSync, mkdirSync, writeFileSync, readdirSync, statSync } from "fs";
import os from "os";

const __dirname = import.meta.dirname;

const app = express();

app.use(express.json());

const BASE_PATH = join(__dirname);

const MUSIC_DATA = JSON.parse(
    readFileSync(join(BASE_PATH, "albums_ready.json"), "utf-8")
);

const appName = 'SoulTune';
const APP_DIR = join(process.env.LOCALAPPDATA, appName);

if (!existsSync(APP_DIR)) {
    mkdirSync(APP_DIR, { recursive: true });
    console.log('Pasta criada:', APP_DIR);
}

const PLAYLISTS_PATH = join(APP_DIR, "playlists.json");
const SETTINGS_PATH = join(APP_DIR, "settings.json");
const SCORE_PATH = join(APP_DIR, "score.json");

if (!existsSync(PLAYLISTS_PATH)) writeFileSync(PLAYLISTS_PATH, "[]");
if (!existsSync(SETTINGS_PATH)) writeFileSync(SETTINGS_PATH, "{}");
if (!existsSync(SCORE_PATH)) writeFileSync(SCORE_PATH, "{}");

function loadPlaylists() {
    try {
        return JSON.parse(readFileSync(PLAYLISTS_PATH, "utf-8"));
    } catch {
        return [];
    }
}

function savePlaylists(playlists) {
    writeFileSync(PLAYLISTS_PATH, JSON.stringify(playlists, null, 2));
}

export function loadSettings() {
    try {
        return JSON.parse(readFileSync(SETTINGS_PATH, "utf-8"));
    } catch {
        return {};
    }
}

export function saveSettings(settings) {
    writeFileSync(SETTINGS_PATH, JSON.stringify(settings, null, 4));
}

function loadRhythmScore() {
    try {
        return JSON.parse(readFileSync(SCORE_PATH, "utf-8"));
    } catch {
        return {};
    }
}

function saveRhythmScore(key, value) {
    const scores = loadRhythmScore();
    scores[String(key)] = value;
    writeFileSync(SCORE_PATH, JSON.stringify(scores, null, 4));
}

function getUnregisteredFiles(undertaleFolder, deltaruneFolder) {
    const musicExtensions = ['.mp3', '.ogg', '.wav', '.flac'];
    const registeredFiles = new Set();

    Object.values(MUSIC_DATA).forEach(album => {
        album.tracks.forEach(track => {
            if (track.file) {
                registeredFiles.add(track.file);
            }
            if (track.files) {
                for (const file of track.files.files) {
                    registeredFiles.add(file);
                }
            }
        });
    });

    const unregisteredFiles = [];

    const listFiles = (dir, rootDir) => {
        if (!existsSync(dir)) return;
        const items = readdirSync(dir);

        for (const item of items) {
            const fullPath = join(dir, item);
            const stat = statSync(fullPath);

            if (stat.isDirectory()) {
                listFiles(fullPath, rootDir);
            } else if (musicExtensions.includes(extname(fullPath).toLowerCase())) {
                const relativePath = relative(rootDir, fullPath);

                if (!registeredFiles.has(basename(relativePath))) {
                    unregisteredFiles.push({
                        path: fullPath,
                        relativePath: relativePath,
                        name: basename(fullPath, extname(fullPath)),
                        folder: basename(dir)
                    });
                }
            }
        }
    };

    if (undertaleFolder) listFiles(undertaleFolder, undertaleFolder);
    if (deltaruneFolder) listFiles(deltaruneFolder, deltaruneFolder);

    return unregisteredFiles;
}

function resolveMusicPath(albumId, fileName) {
    const settings = loadSettings();

    let baseDir;

    if (albumId === "undertale-ost") {
        baseDir = settings.undertaleFolder;
    } else if (albumId === "dogs") {
        let uPath = join(settings.undertaleFolder, fileName);
        baseDir = existsSync(uPath) ? settings.undertaleFolder : join(settings.deltaruneFolder, "mus");
    } else {
        baseDir = join(settings.deltaruneFolder, "mus");
    }

    if (fileName.startsWith("../extras")) {
        baseDir = join(__dirname, "mus", "extras");
    }

    const fullPath = normalize(join(baseDir, fileName));

    if (!existsSync(fullPath)) return null;

    return fullPath;
}

function getAllowedDirs() {
    const settings = loadSettings();

    return [
        settings.undertaleFolder,
        settings.deltaruneFolder
    ].filter(Boolean);
}

function safeResolve(filePath) {
    const allowedDirs = getAllowedDirs();

    for (const base of allowedDirs) {
        const full = resolve(base, filePath);

        if (full.startsWith(resolve(base)) && existsSync(full)) {
            return full;
        }
    }

    return null;
}

const SEARCH_INDEX = [];

Object.values(MUSIC_DATA).forEach(album => {
    album.tracks.forEach(track => {
        SEARCH_INDEX.push({
            title: track.title.toLowerCase(),
            track,
            album: {
                id: album.id,
                title: album.title,
                artist: album.artist,
                cover: album.cover
            }
        });
    });
});

app.use("/static", express.static(join(BASE_PATH, "sources", "static")));
app.use('/html5game', express.static(join(BASE_PATH, "Rhythm Game", "html5game")))

app.get("/", (req, res) => {
    res.sendFile(join(BASE_PATH, "sources", "templates", "index.html"));
});

app.get("/app/", (req, res) => {
    res.sendFile(join(BASE_PATH, "sources", "templates", "app.html"));
});

app.get("/dev/", (req, res) => {
    res.sendFile(join(BASE_PATH, "sources", "templates", "dev.html"));
});

app.get("/lightners/", (req, res) => {
    res.sendFile(join(BASE_PATH, "Rhythm Game", "lightners.html"));
});

app.get("/api/lightners/music/:file", (req, res) => {
    const settings = loadSettings();
    res.sendFile(join(settings.deltaruneFolder, "mus", req.params.file))
});

app.get("/api/lightners/scores", (req, res) => {
    const scores = loadRhythmScore();
    res.json({
        scores
    });
});

app.post("/api/lightners/save-flag/", (req, res) => {
    const { key, value } = req.body;
    console.log(`Flag recebida: ${key} - ${value}`);
    saveRhythmScore(key, value);
    res.sendStatus(200);
});

app.get('/api/track-dev', (req, res) => {
    const { album: albumId, track: trackId } = req.query;

    if (!albumId || !trackId) {
        return res.status(400).json({ error: "album e track são obrigatórios" });
    }

    const album = Object.values(MUSIC_DATA).find(a => a.id === albumId);
    if (!album) {
        return res.status(404).json({ error: "Álbum não encontrado" });
    }

    const track = album.tracks.find(t => String(t.id) === String(trackId));
    if (!track) {
        return res.status(404).json({ error: "Música não encontrada" });
    }

    let files = [];

    if (track.file) {
        files.push(track.file.fileName);
    }

    else if (track.files) {
        files = track.files;
    }

    let lyrics = track.lyrics;

    res.json({ files, lyrics });
});

app.post('/api/track-dev', (req, res) => {
    const { files, lyrics } = req.body;

    if (!files || !files.files) {
        return res.status(400).json({ error: "files inválido" });
    }

    const linhas = [];
    const tempos = [];

    let lastTime = 0;

    lyrics
        .sort((a, b) => a.time - b.time)
        .forEach(l => {
            linhas.push(l.text || '');

            const delta = l.time - lastTime;
            tempos.push(delta);

            lastTime = l.time;
        });

    const result = {
        files: {
            files: files.files,
            delays: files.delays || []
        },
        lyrics: {
            linhas,
            tempos
        }
    };

    console.log("Resultado convertido:");
    console.log(JSON.stringify(result, null, 2));

    res.json(result);
});

app.get("/api/albums", (req, res) => {
    res.json(Object.values(MUSIC_DATA));
});

app.get("/api/search", (req, res) => {
    const q = (req.query.q || "").toLowerCase().trim();
    if (!q) return res.json([]);

    res.json(SEARCH_INDEX.filter(i => i.title.includes(q)));
});

app.get("/api/album/:id", (req, res) => {
    const album = Object.values(MUSIC_DATA).find(a => a.id === req.params.id);
    if (!album) return res.status(404).json({ error: "Álbum não encontrado" });

    res.json(album);
});

app.get("/api/music/:albumId/:index", (req, res) => {
    const album = Object.values(MUSIC_DATA).find(a => a.id === req.params.albumId);
    if (!album) return res.status(404).json({ error: "Álbum não encontrado" });

    const track = album.tracks.find(t => String(t.id) === req.params.index);
    if (!track) return res.status(404).json({ error: "Música não encontrada" });

    if (req.query.video === 'true' && track?.video) {
        const filePath = resolveMusicPath(album.id, track.video);

        if (!filePath) {
            return res.status(404).json({ error: "Vídeo não encontrado no sistema" });
        }
        return res.sendFile(filePath);
    }

    if (track?.file) {
        const filePath = resolveMusicPath(album.id, track.file);

        if (!filePath) {
            console.log("Arquivo não encontrado no sistema");
            return res.status(404).json({ error: "Arquivo não encontrado no sistema" });
        }
        return res.sendFile(filePath);
    }

    if (track?.files) {
        const part = parseInt(req.query.part);
        if (isNaN(part)) return res.status(400).json({ error: "Part required" });

        const fileName = track.files.files[part];
        
        return res.sendFile(resolveMusicPath(album.id, fileName));
    }

    res.status(400).json({ error: "Música inválida" });
});

app.get("/api/unknowmusic/:file", (req, res) => {
    const file = req.params.file;

    const safePath = safeResolve(file);

    if (!safePath) {
        return res.status(404).json({ error: "Arquivo não encontrado" });
    }

    res.sendFile(safePath);
});

app.get("/api/unregistered-music", (req, res) => {
    const { file } = req.query;

    if (!file) {
        return res.status(400).json({ error: "Arquivo não informado" });
    }

    const safePath = safeResolve(file);

    if (!safePath) {
        return res.status(404).json({ error: "Arquivo não encontrado" });
    }

    const ext = extname(safePath).toLowerCase();
    const allowed = ['.mp3', '.ogg', '.wav', '.flac'];

    if (!allowed.includes(ext)) {
        return res.status(400).json({ error: "Tipo inválido" });
    }

    res.sendFile(safePath);
});

app.get("/api/playlists", (req, res) => {
    const playlists = loadPlaylists();
    res.json(playlists);
});

app.post("/api/playlists", (req, res) => {
    const { name, description = "" } = req.body;
    
    if (!name || typeof name !== "string") {
        return res.status(400).json({ error: "Nome da playlist é obrigatório" });
    }

    const playlists = loadPlaylists();
    const id = `playlist-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    const newPlaylist = {
        id,
        name: name.trim(),
        description: description.trim(),
        tracks: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };

    playlists.push(newPlaylist);
    savePlaylists(playlists);
    
    res.status(201).json(newPlaylist);
});

app.delete("/api/playlists/:id", (req, res) => {
    const { id } = req.params;
    let playlists = loadPlaylists();
    
    const index = playlists.findIndex(p => p.id === id);
    if (index === -1) {
        return res.status(404).json({ error: "Playlist não encontrada" });
    }

    const deleted = playlists.splice(index, 1)[0];
    savePlaylists(playlists);
    
    res.json(deleted);
});

app.post("/api/playlists/:id/tracks", (req, res) => {
    const { id } = req.params;
    const { track, album } = req.body;
    
    if (!track || !album) {
        console.error("Faixa e álbum são obrigatórios")
        return res.status(400).json({ error: "Faixa e álbum são obrigatórios" });
    }

    let playlists = loadPlaylists();
    const playlist = playlists.find(p => p.id === id);
    
    if (!playlist) {
        console.error("Playlist não encontrada")
        return res.status(404).json({ error: "Playlist não encontrada" });
    }

    const trackEntry = {
        ...track,
        album: album.id,
        addedAt: new Date().toISOString()
    };

    playlist.tracks.push(trackEntry);
    playlist.updatedAt = new Date().toISOString();
    savePlaylists(playlists);
    
    res.status(201).json(trackEntry);
});

app.delete("/api/playlists/:id/tracks/:trackIndex", (req, res) => {
    const { id, trackIndex } = req.params;
    const index = parseInt(trackIndex);
    
    if (isNaN(index)) {
        return res.status(400).json({ error: "Índice inválido" });
    }

    let playlists = loadPlaylists();
    const playlist = playlists.find(p => p.id === id);
    
    if (!playlist) {
        return res.status(404).json({ error: "Playlist não encontrada" });
    }

    if (index < 0 || index >= playlist.tracks.length) {
        return res.status(400).json({ error: "Faixa não encontrada" });
    }

    const removed = playlist.tracks.splice(index, 1)[0];
    playlist.updatedAt = new Date().toISOString();
    savePlaylists(playlists);
    
    res.json(removed);
});

app.put("/api/playlists/:id/reorder", (req, res) => {
    const { id } = req.params;
    const { tracks } = req.body;

    if (!Array.isArray(tracks)) {
        return res.status(400).json({ error: "Tracks inválidos" });
    }

    let playlists = loadPlaylists();
    const playlist = playlists.find(p => p.id === id);

    if (!playlist) {
        return res.status(404).json({ error: "Playlist não encontrada" });
    }

    if (tracks.length !== playlist.tracks.length) {
        return res.status(400).json({ error: "Quantidade de faixas inconsistente" });
    }

    const originalIds = playlist.tracks.map(t => t.id);
    const newIds = tracks.map(t => t.id);

    const sameTracks =
        originalIds.length === newIds.length &&
        originalIds.every(id => newIds.includes(id));

    if (!sameTracks) {
        return res.status(400).json({ error: "Tracks não correspondem à playlist original" });
    }

    playlist.tracks = tracks;
    playlist.updatedAt = new Date().toISOString();

    savePlaylists(playlists);

    res.json({ success: true });
});

app.get("/api/settings", (req, res) => {
    try {
        const settings = loadSettings();
        res.json(settings);
    } catch (error) {
        console.error("Erro ao carregar configurações:", error);
        res.status(500).json({ error: "Erro ao carregar configurações" });
    }
});

app.put("/api/settings", (req, res) => {
    try {
        const newSettings = req.body;
        saveSettings(newSettings);
        res.json({ success: true });
    } catch (error) {
        console.error("Erro ao salvar configurações:", error);
        res.status(500).json({ error: `Erro ao salvar configurações: ${error}` });
    }
});

app.get("/api/unregistered-files", (req, res) => {
    try {
        const settings = loadSettings();

        const files = getUnregisteredFiles(
            settings.undertaleFolder,
            settings.deltaruneFolder
        );

        res.json(files);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erro ao listar arquivos" });
    }
});

export function startServer() {
    app.listen(5000, "127.0.0.1", () => {
        console.log("Server rodando em http://127.0.0.1:5000");
    });
}