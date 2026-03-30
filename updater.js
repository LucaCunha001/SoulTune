const { autoUpdater } = require("electron-updater");
const log = require("electron-log");

function initUpdater(mainWindow) {
    autoUpdater.autoDownload = false;
    autoUpdater.autoInstallOnAppQuit = false;

    autoUpdater.on("checking-for-update", () => {
        mainWindow.webContents.send("update-status", "Verificando atualizações...");
    });

    autoUpdater.on("update-available", (info) => {
        mainWindow.webContents.send("update-available", {
            version: info.version,
            notes: info.releaseNotes || "Sem descrição"
        });
    });

    autoUpdater.on("update-not-available", () => {
        mainWindow.webContents.send("update-not-available");
    });

    autoUpdater.on("download-progress", (progress) => {
        mainWindow.webContents.send("update-progress", progress.percent);
    });

    autoUpdater.on("update-downloaded", () => {
        mainWindow.webContents.send("update-downloaded");
    });

    autoUpdater.on("error", (err) => {
        console.error(err);
        log.error("Erro no updater:", err);
        mainWindow.webContents.send("update-error");
    });

    autoUpdater.checkForUpdates();
}

function setupIPC() {
    const { ipcMain } = require("electron");

    ipcMain.handle("update-download", () => {
        autoUpdater.downloadUpdate();
    });

    ipcMain.handle("update-install", () => {
        autoUpdater.quitAndInstall();
    });

    ipcMain.handle("update-check", () => {
        autoUpdater.checkForUpdates();
    });
}

module.exports = { initUpdater, setupIPC };