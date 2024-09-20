const { app, BrowserWindow, Tray, ipcMain, dialog, nativeImage } = require('electron');
const chokidar = require('chokidar');
const positioner = require('electron-traywindow-positioner');
const path = require('node:path');
const fs = require('fs').promises;

if (require('electron-squirrel-startup')) {
  app.quit();
}

let mainWindow;
let splashWindow;
let trayProcess;
let tray;
const SPLASH_SCREEN_DELAY = 1000;

const iconPath = process.platform === 'win32' ? 'icon.ico' : 'icon.png';
const trayIconPath = process.platform === 'win32' ? 'icon-tray.ico' : 'icon-tray.png';
const fullIconPath = path.join(__dirname, '../build', iconPath);
const fullTrayIconPath = path.join(__dirname, '../build', trayIconPath);

let watcher;
const audioExtensions = new Set(['.mp3', '.flac', '.aac', '.ogg']);
const watchedFolders = new Set();

const createSplashScreen = () => {
  splashWindow = new BrowserWindow({
    title: "Spectral",
    icon: fullIconPath,
    minWidth: 240,
    minHeight: 336,
    width: 240,
    height: 336,
    frame: false,
    transparent: true,
    show: false,
    resizable: false,
  });

  splashWindow.loadFile(path.join(__dirname, 'splash.html'));

  splashWindow.once('ready-to-show', () => {
    splashWindow.show();
    setTimeout(() => {
      createMainWindow();
    }, SPLASH_SCREEN_DELAY);
  });

  splashWindow.on('closed', () => {
    splashWindow = null;
  });
};

const createMainWindow = () => {
  mainWindow = new BrowserWindow({
    title: "Spectral",
    icon: fullIconPath,
    width: 1280,
    height: 720,
    minWidth: 800,
    minHeight: 600,
    frame: false,
    transparent: true,
    backgroundColor: '#00FFFFFF',
    autoHideMenuBar: true,
    show: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  mainWindow.loadFile(path.join(__dirname, 'index.html'));

  mainWindow.on("close", (event) => {
    event.preventDefault();
    mainWindow.hide();
  });

  mainWindow.on('show', () => {
    setTimeout(() => {
      mainWindow.setOpacity(1);
    }, 50);
  });

  mainWindow.on('hide', () => {
    mainWindow.setOpacity(0);
  });

  mainWindow.once('ready-to-show', () => {
    splashWindow.close();
    mainWindow.show();
  });
};

app.whenReady().then(() => {
  createSplashScreen();
  createTrayProcess();
});

function showTrayMenu() {
  if (trayProcess) {
    if (trayProcess.isVisible()) {
      trayProcess.hide();
    } else {
      trayProcess.show();
      positioner.position(trayProcess, tray.getBounds());
    }
  } else {
    createTrayProcess();
  }
}

function isAudioFile(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  return audioExtensions.has(ext);
}

function startWatching(foldersArray) {
  if (watcher) {
    watcher.close();
  }

  watcher = chokidar.watch(foldersArray, { persistent: true });

  watcher.on('ready', () => {
    const watchedPaths = watcher.getWatched();
    const os_weird_route_thingy = process.platform === 'linux' ? '/' : '\\';
    for (const directory in watchedPaths) {
      watchedPaths[directory].forEach(filePath => {
        const fullPath = `${directory}${os_weird_route_thingy}${filePath}`;
        if (isAudioFile(fullPath)) {
          mainWindow.webContents.send('library-file-added', fullPath);
        }
      });
    }
  });

  watcher.on('add', filePath => {
    if (isAudioFile(filePath)) {
      mainWindow.webContents.send('library-file-added', filePath);
    }
  });

  watcher.on('unlink', filePath => {
    if (isAudioFile(filePath)) {
      mainWindow.webContents.send('library-file-deleted', filePath);
    }
  });
}

app.on('activate', () => {
  if (mainWindow === null) {
    createMainWindow();
  } else {
    mainWindow.show();
  }
});

ipcMain.on('minimize-window', () => {
  mainWindow.minimize();
});

ipcMain.on('maximize-window', () => {
  mainWindow.maximize();
});

ipcMain.on('restore-window', () => {
  mainWindow.unmaximize();
});

ipcMain.on('close-window', () => {
  mainWindow.hide();
});

ipcMain.on('toogle-main-window', () => {
  if (mainWindow.isVisible()) {
    mainWindow.hide();
  } else {
    mainWindow.show();
  }
});

ipcMain.on('close-spectral', () => {
  mainWindow.webContents.send('app-closing', '');
  app.quit();
});

ipcMain.handle('is-maximized', () => {
  return mainWindow.isMaximized();
});

ipcMain.handle('spectral-is-loaded', () => {
  if (splashWindow) {
    splashWindow.close();
  }
  mainWindow.show();
  if (!tray) {
    tray = new Tray(fullTrayIconPath);
    tray.setToolTip('Spectral')
    if (process.platform === 'linux') {
      tray.on('click', (event, bounds) => { showTrayMenu(bounds) });
    } else {
      tray.on('click', () => {
        setTimeout(() => {
          if (!mainWindow.isFocused() && mainWindow.isVisible()) {
            mainWindow.focus();
          } else {
            mainWindow.show();
          }
        }, 100);
      });
      tray.on('right-click', (event) => { showTrayMenu() });
    }
  }
});

ipcMain.handle('selectDirectory', async () => {
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ['openDirectory']
  });
  return result.filePaths[0];
});

ipcMain.handle('set-folders', (event, foldersArray) => {
  startWatching(foldersArray);
});

ipcMain.handle('start-search', (event, content) => {
  mainWindow.webContents.send('search-content', content);
});

app.on('before-quit', () => {
  if (tray) {
    tray.destroy();
  }
  if (mainWindow) {
    mainWindow.destroy();
  }
  if (trayProcess) {
    trayProcess.destroy();
  }
});
