const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("api", {
    updateMusic: (name, album, start, end) =>
        ipcRenderer.invoke("update-music", name, album, start, end),
    selectFolder: () => ipcRenderer.invoke("select-folder")
});