const { app, BrowserWindow, Menu,ipcMain } = require('electron');
const log = require('electron-log');
const Store = require('./Store');

// Set env
process.env.NODE_ENV = 'development';

const isDev = process.env.NODE_ENV !== 'production' ? true : false
const isMac = process.platform === 'darwin' ? true : false

let mainWindow;

// init store
const store = new Store({
  configName: 'user-settings',
  defaults: {
    settings: {
      cpuOverload: 80,
      alertFrequency: 5
    }
  }
});

function createMainWindow() {
  mainWindow = new BrowserWindow({
    title: 'System info',
    width: isDev ? 700 : 355,
    height: 500,
    icon: './assets/icons/icon.png',
    resizable: isDev ? true : false,
    backgroundColor: 'white',
    webPreferences: {
      nodeIntegration: true,
    },
  });



  mainWindow.loadFile('./app/index.html')
}

app.on('ready', () => {
  createMainWindow();

  mainWindow.webContents.on('dom-ready',() => {
      mainWindow.webContents.send('settings:get',store.get('settings'))
  });

  const mainMenu = Menu.buildFromTemplate(menu);
  Menu.setApplicationMenu(mainMenu)
});

//set settings
ipcMain.on('settings:set',(e,value) => {
    store.set('settings',value);
    mainWindow.webContents.send('settings:get',store.get('settings'));
});

const menu = [
  ...(isMac ? [{ role: 'appMenu' }] : []),
  {
    role: 'fileMenu',
  },
  ...(isDev
    ? [
        {
          label: 'Developer',
          submenu: [
            { role: 'reload' },
            { role: 'forcereload' },
            { type: 'separator' },
            { role: 'toggledevtools' },
          ],
        },
      ]
    : []),
];

app.on('window-all-closed', () => {
  if (!isMac) {
    app.quit()
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createMainWindow()
  }
});

app.allowRendererProcessReuse = true;
