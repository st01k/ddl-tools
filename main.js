const electron = require('electron')
const handler = require('./custom_modules/handler')

const { app, BrowserWindow, ipcMain, Menu } = electron

let mainWindow

app.on('ready', () => {
  mainWindow = new BrowserWindow({})

  mainWindow.loadURL(`file://${__dirname}/static/index.html`)
  // mainWindow.loadFile('index.html')

  mainWindow.maximize()

  const mainMenu = Menu.buildFromTemplate(menuTemplate)
  // Menu.setApplicationMenu(mainMenu)
})

app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
})

const menuTemplate = [
  {
    label: 'File',
    submenu: [
      {label: 'Import DDL'},
      {
        label: 'Quit',
        accelerator: process.platform === 'darwin' ? 'Command+Q' : 'Ctrl+Q',
        click() {
          app.quit()
        }
      }
    ]
  },
  {
    label: 'Debug',
    submenu: [
      {
        label: 'DevTools',
        click() {
          mainWindow.webContents.openDevTools()
        }
      }
    ]
  }
]

if (process.platform === 'darwin') {
  menuTemplate.unshift({})
}

ipcMain.on('file:import', (event, path) => {
  let data = handler.import(path)
  mainWindow.webContents.send('file:imported', data)
})

ipcMain.on('file:export', (event, handler_data) => {
  let path = handler.export(handler_data)
  mainWindow.webContents.send('file:exported', path)
})

ipcMain.on('pdf:open', (event) => {
  electron.shell.openItem('./static/assets/JCI DDL Manual.pdf')
})

ipcMain.on('file:show', (event, path) => {
  electron.shell.showItemInFolder(path)
})

ipcMain.on('power:off', (event) => {
  app.quit()
})
