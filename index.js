const electron = require('electron')
const handler = require('./custom_modules/handler')

const { app, BrowserWindow, ipcMain } = electron

let mainWindow

app.on('ready', () => {
  mainWindow = new BrowserWindow({})
  mainWindow.loadURL(`file://${__dirname}/index.html`)
})

ipcMain.on('file:import', (event, path) => {
  let data = handler.import(path)
  // console.log(data.records[0])
  mainWindow.webContents.send('file:handler', data)
})