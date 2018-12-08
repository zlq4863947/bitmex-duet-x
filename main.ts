import { app, BrowserWindow, screen, autoUpdater } from 'electron';
import * as path from 'path';
import * as url from 'url';
import * as settings from 'electron-settings';
import * as log from 'electron-log';

let win, serve;
const args = process.argv.slice(1);
serve = args.some(val => val === '--serve');

function createWindow() {

  const electronScreen = screen;
  const size = electronScreen.getPrimaryDisplay().workAreaSize;

  // Default settings
  const defaultSettings = {
    notification: true,
    folderswitch: true,
    clearlist: false,
    suffix: true,
    updatecheck: true
  };

  // Create the browser window.
  win = new BrowserWindow({
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
  const settingsAll = settings.getAll();
  Object.keys(defaultSettings).forEach((key) => {
    if (!settingsAll.hasOwnProperty(key)) {
      settings.set(key, defaultSettings[key]);
    }
  });


  if (serve) {
    require('electron-reload')(__dirname, {
      electron: require(`${__dirname}/node_modules/electron`)
    });
    win.loadURL('http://localhost:4200');
  } else {
    win.loadURL(url.format({
      pathname: path.join(__dirname, 'dist/index.html'),
      protocol: 'file:',
      slashes: true
    }));
  }

  win.webContents.openDevTools();

  // Emitted when the window is closed.
  win.on('closed', () => {
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
  app.on('ready', () => {
    createWindow();
    if (settings.get('updatecheck', {}) === true) {
        autoUpdater.checkForUpdates();
    }
  });

  // Quit when all windows are closed.
  app.on('window-all-closed', () => {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
      app.quit();
    }
  });

  app.on('activate', () => {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (win === null) {
      createWindow();
    }
  });
  process.on('uncaughtException', (e) => {
    log.error(e)
  });

  /** when the update has been downloaded and is ready to be installed, notify the BrowserWindow */
  autoUpdater.on('update-downloaded', (info) => {
    log.info(info);
    win.webContents.send('updateReady');
  });

} catch (e) {
  log.error(e.message)
}
