const { app, BrowserWindow, Tray, Menu, ipcMain, dialog } = require('electron');
const path = require('node:path');
const fs = require('fs');

if (require('electron-squirrel-startup')) {
  app.quit();
}

let mainWindow;
let splashWindow;
let playerProcess;
let tray = null;
const SPLASH_SCREEN_DELAY = 1000;

const createSplashScreen = () => {
  splashWindow = new BrowserWindow({
    title: "Spectral - Loading",
    icon: "icon.ico",
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
    icon: "icon.ico",
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

  mainWindow.once('ready-to-show', () => {
    if (splashWindow) {
      splashWindow.close();
    }
    mainWindow.show();
  });

  mainWindow.on("close", (event) => {
    event.preventDefault();
    mainWindow.hide();
  });
};

const createPlayerProcess = () => {
  playerProcess = new BrowserWindow({
    minWidth: 300,
    minHeight: 140,
    width: 300,
    height: 140,
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

  playerProcess.on('blur', () => {
    playerProcess.hide();
  });

  playerProcess.loadFile(path.join(__dirname, 'player.html'));

  playerProcess.on('closed', () => {
    playerProcess = null;
  });
};

app.whenReady().then(() => {
  createSplashScreen();
  setTimeout(() => {
    createMainWindow();
    createPlayerProcess();
    tray = new Tray(path.join('icon.ico'));
    tray.setToolTip('Spectral')
    tray.on('double-click', () => { showTrayMenu() });
    tray.on('right-click', () => { showTrayMenu() });
  }, SPLASH_SCREEN_DELAY);
});

function showTrayMenu() {
  if (playerProcess) {
    if (playerProcess.isVisible()) {
      playerProcess.hide();
    } else {
      playerProcess.show();
      const { x, y } = tray.getBounds();
      const { width, height } = playerProcess.getBounds();
      playerProcess.setPosition(Math.round(x - width / 2), Math.round(y - height));
    }
  } else {
    createPlayerProcess();
  }
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
  app.quit();
});

ipcMain.handle('is-maximized', () => {
  return mainWindow.isMaximized();
});

ipcMain.on('send-player-data', (event, data) => {
  playerProcess.webContents.send('receive-player-data', data);
});

ipcMain.on('tray-song-data-send', (event, message) => {
  mainWindow.webContents.send('tray-song-data-recieve', message);
});

ipcMain.handle('selectDirectory', async () => {
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ['openDirectory']
  });
  return result.filePaths[0];
});

ipcMain.handle('searchForSongFiles', async (event, folderPath) => {
  const audioExtensions = ['.mp3', '.wav', '.flac', '.aac', '.ogg'];
  const searchInsideFolders = true;
  const audioFiles = await searchFiles(folderPath, audioExtensions, searchInsideFolders);
  return audioFiles;
});

async function searchFiles(folderPath, audioExtensions, searchInsideFolders) {
  const files = await new Promise((resolve, reject) => {
    fs.readdir(folderPath, (err, files) => {
      if (err) {
        reject(err);
      } else {
        resolve(files);
      }
    });
  });
  const audioFiles = files
    .map(file => path.join(folderPath, file))
    .filter(filePath => audioExtensions.includes(path.extname(filePath).toLowerCase()));
  if (searchInsideFolders) {
    const folders = files.filter(file => fs.statSync(path.join(folderPath, file)).isDirectory());
    for (const folder of folders) {
      const childFiles = await searchFiles(path.join(folderPath, folder), audioExtensions, searchInsideFolders);
      audioFiles.push(...childFiles);
    }
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
  if (playerProcess) {
    playerProcess.destroy();
  }
});
