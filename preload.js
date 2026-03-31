const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("api", {
    updateMusic: (name, album, start, end) =>
        ipcRenderer.invoke("update-music", name, album, start, end),
    selectFolder: () => ipcRenderer.invoke("select-folder"),
    maximize: () => ipcRenderer.invoke('maximize'),
    setAutoStart: (enabled) => ipcRenderer.invoke('set-auto-start', enabled),
    setDiscordRpc: (enabled) => ipcRenderer.invoke('set-discord-rpc', enabled)
});

const isDev = process.argv.includes("--isdev=true");

contextBridge.exposeInMainWorld("updater", {
    onAvailable: (cb) => {
        if (!isDev) ipcRenderer.on("update-available", (_, d) => cb(d));
    },
    onNotAvailable: (cb) => {
        if (isDev) cb();
        else ipcRenderer.on("update-not-available", cb);
    },
    onProgress: (cb) => {
        if (!isDev) ipcRenderer.on("update-progress", (_, p) => cb(p));
    },
    onDownloaded: (cb) => {
        if (!isDev) ipcRenderer.on("update-downloaded", cb);
    },
    onError: (cb) => {
        if (!isDev) ipcRenderer.on("update-error", cb);
    },

    check: () => {
        if (!isDev) ipcRenderer.invoke("update-check");
    },
    download: () => {
        if (!isDev) ipcRenderer.invoke("update-download");
    },
    install: () => {
        if (!isDev) ipcRenderer.invoke("update-install");
    }
});

contextBridge.exposeInMainWorld("env", {
    isDev,
    getVersion: () => ipcRenderer.invoke("get-version")
});