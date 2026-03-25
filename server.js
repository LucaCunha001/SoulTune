const express = require("express");
const path = require("path");
const fs = require("fs");

const app = express();

app.use(express.json());

const BASE_PATH = path.join(__dirname);

const MUSIC_DATA = JSON.parse(
    fs.readFileSync(path.join(BASE_PATH, "albums_ready.json"), "utf-8")
);

let AppData = "";
let PLAYLISTS_PATH = "";
let SETTINGS_PATH = "";

(async () => {
    const envPaths = (await import('env-paths')).default;
    const paths = envPaths('SoulTune');
    Object.values(paths).forEach(dir => {
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
    });

    AppData = paths;
    PLAYLISTS_PATH = path.join(AppData.data, "playlists.json");
    SETTINGS_PATH = path.join(AppData.config, "settings.json");
})();

function loadPlaylists() {
    try {
        return JSON.parse(fs.readFileSync(PLAYLISTS_PATH, "utf-8"));
    } catch {
        return [];
    }
}

function savePlaylists(playlists) {
    fs.writeFileSync(PLAYLISTS_PATH, JSON.stringify(playlists, null, 2));
}

function loadSettings() {
    try {
        return JSON.parse(fs.readFileSync(SETTINGS_PATH, "utf-8"));
    } catch {
        return {};
    }
}

function saveSettings(settings) {
    fs.writeFileSync(SETTINGS_PATH, JSON.stringify(settings, null, 2));
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
                for (file in track.files.files) {
                    registeredFiles.add(file);
                }
            }
        });
    });

    const unregisteredFiles = [];

    const listFiles = (dir) => {
        if (!fs.existsSync(dir)) return;
        const items = fs.readdirSync(dir);
        for (const item of items) {
            const fullPath = path.join(dir, item);
            const stat = fs.statSync(fullPath);
            if (stat.isDirectory()) {
                listFiles(fullPath);
            } else if (musicExtensions.includes(path.extname(fullPath).toLowerCase())) {
                const relativePath = path.relative(dir, fullPath);
                if (!registeredFiles.has(relativePath)) {
                    unregisteredFiles.push({
                        path: fullPath,
                        relativePath: relativePath,
                        name: path.basename(fullPath, path.extname(fullPath)),
                        folder: path.basename(dir)
                    });
                }
            }
        }
    };

    if (undertaleFolder) listFiles(undertaleFolder);
    if (deltaruneFolder) listFiles(deltaruneFolder);

    return unregisteredFiles;
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

function getTrackPath(albumId, fileName) {
    if (!fileName) return "";

    let full = path.join(BASE_PATH, "mus", fileName);
    if (fs.existsSync(full)) return full;

    const sub = albumId === "undertale-ost" ? "undertale" : "deltarune";
    return path.join(BASE_PATH, "mus", sub, fileName);
}

app.use("/static", express.static(path.join(BASE_PATH, "sources", "static")));

app.get("/", (req, res) => {
    res.sendFile(path.join(BASE_PATH, "sources", "templates", "index.html"));
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

    if (track.file) {
        const filePath = getTrackPath(album.id, track.file);
        return res.sendFile(filePath);
    }

    if (track.files) {
        const part = parseInt(req.query.part);
        if (isNaN(part)) return res.status(400).json({ error: "Part required" });

        const fileName = track.files.files[part];
        return res.sendFile(getTrackPath(album.id, fileName));
    }

    res.status(400).json({ error: "Música inválida" });
});

app.get("/api/unknowmusic/:filename", (req, res) => {
    const file = path.join(res.get("filename"))
    if (fs.existsSync(file)) {
        return res.sendFile(file);
    }

    res.status(400).json({ error: "Música inválida" });
});

app.get("/api/unregistered-music", (req, res) => {
    const filePath = req.query.path;
    if (!filePath || !fs.existsSync(filePath)) {
        return res.status(404).json({ error: "Arquivo não encontrado" });
    }

    const musicExtensions = ['.mp3', '.ogg', '.wav', '.flac'];
    if (!musicExtensions.includes(path.extname(filePath).toLowerCase())) {
        return res.status(400).json({ error: "Tipo de arquivo inválido" });
    }

    res.sendFile(filePath);
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
        return res.status(400).json({ error: "Faixa e álbum são obrigatórios" });
    }

    let playlists = loadPlaylists();
    const playlist = playlists.find(p => p.id === id);
    
    if (!playlist) {
        return res.status(404).json({ error: "Playlist não encontrada" });
    }

    const trackEntry = {
        ...track,
        album,
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
        res.status(500).json({ error: "Erro ao salvar configurações" });
    }
});

app.get("/api/unregistered-files", (req, res) => {
    try {
        const { undertaleFolder, deltaruneFolder } = req.query;
        const files = getUnregisteredFiles(undertaleFolder, deltaruneFolder);
        res.json(files);
    } catch (error) {
        console.error("Erro ao listar arquivos não registrados:", error);
        res.status(500).json({ error: "Erro ao listar arquivos" });
    }
});

function startServer() {
    app.listen(5000, "127.0.0.1", () => {
        console.log("Server rodando em http://127.0.0.1:5000");
    });
}

module.exports = { startServer };