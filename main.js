const { app, BrowserWindow, ipcMain, globalShortcut, Menu, dialog, shell } = require("electron");
const { join } = require("path");

const { startServer } = require("./server");
const { loadRPC, updateMusic } = require("./rpc");

const { initUpdater, setupIPC } = require("./updater");
const log = require("electron-log");

log.transports.file.level = "info";

/**
 * @type {BrowserWindow}
 */
let mainWindow;

const isDev = !app.isPackaged;

function createWindow(inicialWindow = false) {
    const window = new BrowserWindow({
        title: "SoulTune",
        width: 800,
        height: 600,
        webPreferences: {
            preload: join(__dirname, "preload.js"),
            contextIsolation: true,
            webviewTag: true,
            additionalArguments: [
                `--isdev=${isDev}`
            ],
            nodeIntegration: false
        },
        closable: !inicialWindow,
        minimizable: !inicialWindow,
        maximizable: !inicialWindow,
        icon: join(__dirname, "icon.ico")
    });

    return window;
}

app.whenReady().then(() => {
    startServer();
    loadRPC();

    Menu.setApplicationMenu(null);

    globalShortcut.register('CommandOrControl+Shift+C', () => {
        const focused = BrowserWindow.getFocusedWindow();
        if (focused) {
            focused.webContents.toggleDevTools();
        }
    });

    mainWindow = createWindow(true);
    mainWindow.loadFile("sources/templates/index.html");

    setupIPC();

    if (!isDev) {
        initUpdater(mainWindow);
    }

    mainWindow.webContents.on('will-navigate', (event, url) => {
        const parsed = new URL(url);

        if (parsed.hostname === '127.0.0.1' && parsed.port === '5000') {
            if (parsed.pathname.startsWith('/dev')) {
                event.preventDefault();

                const newWindow = createWindow();
                newWindow.loadURL(url);
            }
            return;
        }

        event.preventDefault();
        shell.openExternal(url);
    });
});

app.on('will-quit', () => {
    globalShortcut.unregisterAll();
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
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

    mainWindow.setClosable(true);
    mainWindow.setMinimizable(true);
    mainWindow.setMaximizable(true);

    mainWindow.maximize();
});

ipcMain.handle("get-version", () => {
    return app.getVersion();
});