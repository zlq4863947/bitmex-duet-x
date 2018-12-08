"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var electron_1 = require("electron");
var path = require("path");
var url = require("url");
var settings = require("electron-settings");
var log_1 = require("./src/log");
var win, serve;
var args = process.argv.slice(1);
serve = args.some(function (val) { return val === '--serve'; });
function createWindow() {
    var electronScreen = electron_1.screen;
    var size = electronScreen.getPrimaryDisplay().workAreaSize;
    // Default settings
    var defaultSettings = {
        notification: true,
        folderswitch: true,
        clearlist: false,
        suffix: true,
        updatecheck: true
    };
    // Create the browser window.
    win = new electron_1.BrowserWindow({
        width: 1200,
        height: 800,
        minWidth: 860,
        minHeight: 600,
        frame: true,
        resizable: true,
        icon: path.join(__dirname, 'src/assets/img/icons/png/64x64.png')
    });
    // Set default settings at first launch
    if (Object.keys(settings.getAll()).length === 0) {
        settings.setAll(defaultSettings);
    }
    // set missing settings
    var settingsAll = settings.getAll();
    Object.keys(defaultSettings).forEach(function (key) {
        if (!settingsAll.hasOwnProperty(key)) {
            settings.set(key, defaultSettings[key]);
        }
    });
    if (serve) {
        require('electron-reload')(__dirname, {
            electron: require(__dirname + "/node_modules/electron")
        });
        win.loadURL('http://localhost:4200');
    }
    else {
        win.loadURL(url.format({
            pathname: path.join(__dirname, 'dist/index.html'),
            protocol: 'file:',
            slashes: true
        }));
    }
    win.webContents.openDevTools();
    // Emitted when the window is closed.
    win.on('closed', function () {
        // Dereference the window object, usually you would store window
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        win = null;
    });
}
try {
    // This method will be called when Electron has finished
    // initialization and is ready to create browser windows.
    // Some APIs can only be used after this event occurs.
    electron_1.app.on('ready', function () {
        createWindow();
        if (settings.get('updatecheck', {}) === true) {
            electron_1.autoUpdater.checkForUpdates();
        }
    });
    // Quit when all windows are closed.
    electron_1.app.on('window-all-closed', function () {
        // On OS X it is common for applications and their menu bar
        // to stay active until the user quits explicitly with Cmd + Q
        if (process.platform !== 'darwin') {
            electron_1.app.quit();
        }
    });
    electron_1.app.on('activate', function () {
        // On OS X it's common to re-create a window in the app when the
        // dock icon is clicked and there are no other windows open.
        if (win === null) {
            createWindow();
        }
    });
    process.on('uncaughtException', function (e) {
        log_1.default.error('an error happened');
        log_1.default.error(e.message);
    });
    /** when the update has been downloaded and is ready to be installed, notify the BrowserWindow */
    electron_1.autoUpdater.on('update-downloaded', function (info) {
        log_1.default.info(info);
        win.webContents.send('updateReady');
    });
}
catch (e) {
    log_1.default.error(e.message);
}
//# sourceMappingURL=main.js.map