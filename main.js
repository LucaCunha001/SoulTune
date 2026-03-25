const { app, BrowserWindow, ipcMain, globalShortcut, Menu, dialog } = require("electron");
const { join } = require("path");

const { startServer } = require("./server");
const { loadRPC, updateMusic } = require("./rpc");

let mainWindow;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1200,
        height: 800,
        webPreferences: {
            preload: join(__dirname, "preload.js"),
            contextIsolation: true,
            webviewTag: true
        },
        icon: join(__dirname, "icon.ico")
    });

    Menu.setApplicationMenu(null);

    return mainWindow;
}

app.whenReady().then(() => {
    startServer();

    loadRPC();

    
    const mainWindow = createWindow();
    
    mainWindow.maximize();
    mainWindow.loadURL("http://127.0.0.1:5000/");

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