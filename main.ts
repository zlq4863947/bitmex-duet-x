import * as path from 'path';
import * as url from 'url';

import { BrowserWindow, Menu, app, autoUpdater, dialog, screen, session, shell } from 'electron';
import log from 'electron-log';
import * as settings from 'electron-settings';

log.transports.file.level = 'info';
log.transports.console.level = false;
log.transports.rendererConsole.format = '[{y}-{m}-{d} {h}:{i}:{s}.{ms}] [{level}] {text}'
//log.transports.file.file = __dirname + '/bitmex-dust.log';
//console.log(__dirname + '/bitmex-dust.log')

let win, serve;
const args = process.argv.slice(1);
serve = args.some((val) => val === '--serve');

function createWindow() {
  const electronScreen = screen;
  const size = electronScreen.getPrimaryDisplay().workAreaSize;
  const name = ' bitmex-duet';
  // ElectronのMenuの設定
  const templateMenu = [
    {
      label: '编辑',
      submenu: [
        { label: '关于', role: 'about' },
        { label: '撤销', role: 'undo', accelerator: 'CmdOrCtrl+Z' },
        { label: '重做', role: 'redo', accelerator: 'Shift+CmdOrCtrl+Z' },
        { type: 'separator' },
        { label: '剪切', role: 'cut', accelerator: 'CmdOrCtrl+X' },
        { label: '复制', role: 'copy', accelerator: 'CmdOrCtrl+C' },
        { label: '粘贴', role: 'paste', accelerator: 'CmdOrCtrl+V' },
        { label: '全选', role: 'selectall', accelerator: 'CmdOrCtrl+A' },
      ],
    },
    {
      label: '查看',
      submenu: [
        {
          label: '重载',
          accelerator: 'CmdOrCtrl+R',
          click: (item, focusedWindow) => {
            if (focusedWindow) {
              // 重载之后, 刷新并关闭所有的次要窗体
              if (focusedWindow.id === 1) {
                BrowserWindow.getAllWindows().forEach((winEl) => {
                  if (winEl.id > 1) {
                    winEl.close();
                  }
                });
              }
              focusedWindow.reload();
            }
          },
        },
        {
          label: '切换全屏',
          accelerator: (() => {
            if (process.platform === 'darwin') {
              return 'Ctrl+Command+F';
            } else {
              return 'F11';
            }
          })(),
          click: (item, focusedWindow) => {
            if (focusedWindow) {
              focusedWindow.setFullScreen(!focusedWindow.isFullScreen());
            }
          },
        },
        {
          label: '切换开发者工具',
          accelerator: (() => {
            if (process.platform === 'darwin') {
              return 'Alt+Command+I';
            } else {
              return 'Ctrl+Shift+I';
            }
          })(),
          click: (item, focusedWindow) => {
            if (focusedWindow) {
              focusedWindow.toggleDevTools();
            }
          },
        },
        { type: 'separator' },
        {
          label: '应用程序菜单演示',
          click: (item, focusedWindow) => {
            if (focusedWindow) {
              const options = {
                type: 'info',
                title: '应用程序菜单演示',
                buttons: ['好的'],
                message: '此演示用于 "菜单" 部分, 展示如何在应用程序菜单中创建可点击的菜单项.',
              };
              dialog.showMessageBox(focusedWindow, options, function() {});
            }
          },
        },
      ],
    },
    {
      label: '窗口',
      role: 'window',
      submenu: [
        { label: '最小化', role: 'minimize', accelerator: 'CmdOrCtrl+M' },
        { label: '关闭', role: 'close', accelerator: 'CmdOrCtrl+W' },
        { type: 'separator' },
        {
          label: '重新打开窗口',
          accelerator: 'CmdOrCtrl+Shift+T',
          enabled: false,
          key: 'reopenMenuItem',
          click: () => {
            app.emit('activate');
          },
        },
      ],
    },
    {
      label: '帮助',
      role: 'help',
      submenu: [
        {
          label: '学习更多',
          click: () => {
            shell.openExternal('http://electron.atom.io');
          },
        },
      ],
    },
    { label: `关于 ${name}`, role: 'about' },
    { type: 'separator' },
    { label: '服务', role: 'services', submenu: [] },
    { type: 'separator' },
    { label: `隐藏 ${name}`, role: 'hide', accelerator: 'Command+H' },
    { label: '隐藏其它', role: 'hideothers', accelerator: 'Command+Alt+H' },
    { label: '显示全部', role: 'unhide' },
    { type: 'separator' },
    {
      label: '退出',
      accelerator: 'Command+Q',
      click: function() {
        app.quit();
      },
    },
  ];

  const menu = Menu.buildFromTemplate(<any>templateMenu);
  Menu.setApplicationMenu(menu);

  // Default settings
  const defaultSettings = {
    notification: true,
    folderswitch: true,
    clearlist: false,
    suffix: true,
    updatecheck: true,
  };

  // Create the browser window.
  win = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 860,
    minHeight: 600,
    title: 'BitMEX趋势机器人',
    frame: true,
    resizable: true,
    icon: path.join(__dirname, 'src/assets/img/icons/png/64x64.png'),
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
      electron: require(`${__dirname}/node_modules/electron`),
    });
    win.loadURL('http://localhost:6531');
  } else {
    win.loadURL(
      url.format({
        pathname: path.join(__dirname, 'dist/index.html'),
        protocol: 'file:',
        slashes: true,
      }),
    );
  }

  // win.webContents.openDevTools();

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
    /*if (settings.get('updatecheck', {}) === true) {
      autoUpdater.checkForUpdates();
    }*/
    // HACK: patch webrequest to fix devtools incompatibility with electron 2.x.
    // See https://github.com/electron/electron/issues/13008#issuecomment-400261941
    /*session.defaultSession.webRequest.onBeforeRequest({urls: []}, (details, callback) => {
      // console.log('details.url: ', details.url)
      if (details.url.indexOf('7accc8730b0f99b5e7c0702ea89d1fa7c17bfe33') !== -1) {
        callback({
          redirectURL: details.url.replace(
            '7accc8730b0f99b5e7c0702ea89d1fa7c17bfe33',
            '57c9d07b416b5a2ea23d28247300e4af36329bdc'
          )
        })
      } else {
        callback({ cancel: false })
      }
    })*/
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
    log.error(e);
  });

  /** when the update has been downloaded and is ready to be installed, notify the BrowserWindow */
  /*autoUpdater.on('update-downloaded', (info) => {
    log.info(info);
    win.webContents.send('updateReady');
  });*/
} catch (e) {
  log.error(e.message);
}
