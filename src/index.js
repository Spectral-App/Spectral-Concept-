const { app, BrowserWindow, Tray, Menu, ipcMain } = require('electron');
const path = require('node:path');

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

    tray.on('click', () => {
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
    });

    tray.setContextMenu(Menu.buildFromTemplate([]));
  }, SPLASH_SCREEN_DELAY);
});

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

app.on('before-quit', () => {
  if (tray) {
    tray.destroy();
  }
  if (mainWindow) {
    mainWindow.destroy(); // Destruye mainWindow
  }
  if (playerProcess) {
    playerProcess.destroy(); // Destruye playerProcess
  }
});