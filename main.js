import { app, BrowserWindow, ipcMain, globalShortcut, Menu, dialog, shell } from "electron";
import { join } from "path";

import { startServer, loadSettings, saveSettings } from "./server.js";
import { loadRPC, updateMusic, disconnectRPC } from "./rpc.js";

import { initUpdater, setupIPC } from "./updater.js";
import logPkg from "electron-log";

const { transports } = logPkg;
const __dirname = import.meta.dirname;

transports.file.level = "info";

/**
 * @type {BrowserWindow}
 */
let mainWindow;
/**
 * @type {BrowserWindow}
 */
let updaterWindow;

const isDev = !app.isPackaged;

function createUpdaterWindow() {
    updaterWindow = new BrowserWindow({
        title: "SoulTune",
        width: 800,
        height: 600,
        resizable: false,
        frame: false,
        webPreferences: {
            preload: join(__dirname, "preload.js"),
            contextIsolation: true,
            nodeIntegration: false,
            additionalArguments: [
                `--isdev=${isDev}`
            ]
        },
        icon: join(__dirname, "sources", "static", "images", "icon.ico")
    });

    updaterWindow.loadFile("sources/templates/index.html");
}

function createMainWindow() {
    mainWindow = new BrowserWindow({
        width: 1200,
        height: 800,
        webPreferences: {
            preload: join(__dirname, "preload.js"),
            contextIsolation: true,
            webviewTag: true,
            additionalArguments: [
                `--isdev=${isDev}`
            ],
            autoplayPolicy: "no-user-gesture-required",
            backgroundThrottling: false
        },
        icon: join(__dirname, "sources", "static", "images", "icon.ico")
    });

    mainWindow.webContents.on('will-navigate', (event, url) => {
        const parsed = new URL(url);

        if (parsed.hostname === '127.0.0.1' && parsed.port === '5000') {
            event.preventDefault();
            mainWindow.loadURL(url);
            return;
        }

        event.preventDefault();
        shell.openExternal(url);
    });

    const saveSize = (max = false) => {
        const settings = loadSettings();
        settings.maximized = max;
        saveSettings(settings);
    }
    mainWindow.addListener("maximize", () => saveSize(true));
    mainWindow.addListener("minimize", () => saveSize(false));

    mainWindow.loadURL("http://127.0.0.1:5000/app/");
}

app.whenReady().then(() => {
    const settings = loadSettings();
    loadRPC(settings.discordRpc);

    if (settings.autoStart) {
        setAutoStart(true);
    }

    Menu.setApplicationMenu(null);

    if (isDev) {
        globalShortcut.register('CommandOrControl+Shift+C', () => {
            const focused = BrowserWindow.getFocusedWindow();
            if (focused) {
                focused.webContents.toggleDevTools();
            }
        });
    }

    createUpdaterWindow();
    startServer();

    setupIPC();

    if (!isDev) {
        initUpdater(updaterWindow);
    }
});

app.on('will-quit', () => {
    globalShortcut.unregisterAll();
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

function setAutoStart(enabled) {
    if (!isDev) {
        app.setLoginItemSettings({
            openAtLogin: enabled,
            path: process.execPath
        });
    }
}

ipcMain.handle("start-app", () => {
    if (updaterWindow) {
        updaterWindow.close();
        updaterWindow = null;
    }

    createMainWindow();

    const settings = loadSettings();

    if (settings?.maximized) {
        mainWindow.maximize();
    }
});

ipcMain.handle("set-auto-start", (_, enabled) => {
    setAutoStart(enabled);
});

ipcMain.handle("set-discord-rpc", (_, enabled) => {
    if (enabled) {
        loadRPC(true);
    } else {
        disconnectRPC();
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

ipcMain.handle("update-icon", (event, iconPath) => {
    const icon = iconPath.replace("http://127.0.0.1:5000", ".");
    mainWindow.setIcon(icon);
});