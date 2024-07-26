const { app, BrowserWindow, Tray, ipcMain, dialog, nativeImage } = require('electron');
const chokidar = require('chokidar');
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
};

const createTrayProcess = () => {
  trayProcess = new BrowserWindow({
    minWidth: 150,
    minHeight: 105,
    width: 150,
    height: 105,
    frame: false,
    show: false,
    transparent: true,
    skipTaskbar: true,
    focusable: true,
    resizable: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      
    }
  });

  trayProcess.on('blur', () => {
    trayProcess.hide();
  });

  trayProcess.loadFile(path.join(__dirname, 'tray.html'));

  trayProcess.on('closed', () => {
    trayProcess = null;
  });

  trayProcess.on('show', () => {
    setTimeout(() => {
      trayProcess.setOpacity(1);
    }, 50);
  });
  
  trayProcess.on('hide', () => {
    trayProcess.setOpacity(0);
  });
};

app.whenReady().then(() => {
  createSplashScreen();
  setTimeout(() => {
    createMainWindow();
    createTrayProcess();
    tray = new Tray(fullTrayIconPath);
    tray.setToolTip('Spectral')
    if (process.platform === 'linux') {
      tray.on('click', () => {showTrayMenu()});
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
      tray.on('right-click', () => { showTrayMenu() });
    }
  }, SPLASH_SCREEN_DELAY);
});

function showTrayMenu() {
  if (trayProcess) {
    if (trayProcess.isVisible()) {
      trayProcess.hide();
    } else {
      trayProcess.show();
      const { x, y } = tray.getBounds();
      const { width, height } = trayProcess.getBounds();
      trayProcess.setPosition(Math.round(x - width / 2), Math.round(y - height));
    }
  } else {
    createTrayProcess();
  }
}

app.on('activate', () => {
  if (mainWindow === null) {
    createMainWindow();
  } else {
    mainWindow.show();
  }
});

// for the custom titlebar buttons
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
});

ipcMain.handle('selectDirectory', async () => {
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ['openDirectory']
  });
  return result.filePaths[0];
});

ipcMain.handle('searchForSongFiles', async (event, folderPath) => {
  const audioExtensions = new Set(['.mp3', '.flac', '.aac', '.ogg']);
  return await searchFiles(folderPath, audioExtensions);
});

async function searchFiles(folderPath, audioExtensions) {
  let audioFiles = [];

  try {
    const entries = await fs.readdir(folderPath, { withFileTypes: true });

    const tasks = entries.map(async (entry) => {
      const fullPath = path.join(folderPath, entry.name);
      if (entry.isFile() && audioExtensions.has(path.extname(entry.name).toLowerCase())) {
        audioFiles.push(fullPath);
      } else if (entry.isDirectory()) {
        const childFiles = await searchFiles(fullPath, audioExtensions);
        audioFiles = audioFiles.concat(childFiles);
      }
    });

    await Promise.all(tasks);
  } catch (error) {
    console.error('Error reading directory:', error);
  }

  return audioFiles;
}

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
