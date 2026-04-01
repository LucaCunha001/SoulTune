const { Notification, BrowserWindow, ipcMain } = require("electron");
const { autoUpdater } = require("electron-updater");
const log = require("electron-log");

/**
 * @param {BrowserWindow} mainWindow 
 */
function initUpdater(mainWindow) {
    autoUpdater.autoDownload = false;
    autoUpdater.autoInstallOnAppQuit = false;

    autoUpdater.on("checking-for-update", () => {
        mainWindow.webContents.send("update-status", "Verificando atualizações...");
    });

    autoUpdater.on("update-available", (info) => {
        if (!mainWindow.isFocused()) {
            const notification = new Notification({
                title: "Nova atualização disponível",
                body: "Abra a janela para conferir"
            });
            notification.show();
        }
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
        if (!mainWindow.isFocused()) {
            const notification = new Notification({
                title: "Atualização instalada com sucesso!",
                body: "Aguarde até que a atualização seja carregada."
            });
            notification.show();
        }
        mainWindow.webContents.send("update-downloaded");
    });

    autoUpdater.on("error", (err) => {
        if (!mainWindow.isFocused()) {
            const notification = new Notification({
                title: "Ocorreu um erro no instalação.",
                body: "Confira o arquivo de logs para mais detalhes. Se necessário, chame um suporte."
            });
            notification.show();
        }
        log.error("Erro no updater:", err);
        mainWindow.webContents.send("update-error");
    });

    autoUpdater.checkForUpdates();
}

function setupIPC() {
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