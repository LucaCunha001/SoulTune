const { app, BrowserWindow, ipcMain, globalShortcut, Menu, dialog } = require("electron");
const { join } = require("path");

const { startServer } = require("./server");
const { loadRPC, updateMusic } = require("./rpc");
const { RPCCloseEventCodes } = require("discord-api-types/v10");

const { initUpdater, setupIPC } = require("./updater");

/**
 * @type BrowserWindow
 */
let mainWindow;

const isDev = !app.isPackaged;

function createWindow() {
    mainWindow = new BrowserWindow({
        title: "SoulTune",
        width: 800,
        height: 600,
        webPreferences: {
            preload: join(__dirname, "preload.js"),
            contextIsolation: true,
            webviewTag: true,
            additionalArguments: [
                `--isdev=${!app.isPackaged}`
            ],
            nodeIntegration: false
        },
        closable: false,
        minimizable: false,
        maximizable: false,
        icon: join(__dirname, "icon.ico")
    });

    Menu.setApplicationMenu(null);

    return mainWindow;
}

app.whenReady().then(() => {
    startServer();

    loadRPC();

    mainWindow = createWindow();
    mainWindow.loadFile("sources/templates/index.html");

    setupIPC();
    if (!isDev)
        initUpdater(mainWindow);

    globalShortcut.register('CommandOrControl+Shift+C', () => {
        mainWindow.webContents.toggleDevTools();
    });
});

ipcMain.handle("update-music", (_, musicName, album, start, end) => {
    updateMusic(musicName, album, start, end);
});

ipcMain.handle("select-folder", async () => {
    const result = await dialog.showOpenDialog(mainWindow, {
        properties: ['openDirectory']
    });
    return result.canceled ? null : result.filePaths[0];
});

ipcMain.handle("maximize", () => {
    mainWindow.setSize(1200, 800);
    mainWindow.center();
    mainWindow.closable = true;
    mainWindow.minimizable = true;
    mainWindow.maximizable = true;
    mainWindow.maximize();
})