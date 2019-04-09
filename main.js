// Modules to control application life and create native browser window
const {app, BrowserWindow} = require('electron')
require('electron-reload')(__dirname);

console.log('main.js executing');

const bcrypt = require('bcrypt');
const saltRounds = 10;
const myPlaintextPassword = 's0/\/\P4$$w0rD';
const someOtherPlaintextPassword = 'not_bacon';

bcrypt.hash(myPlaintextPassword, saltRounds, function(err, hash) {
  // Store hash in your password DB.
  console.log('Hashed pass ::: ' + hash);
});

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

app.setBadgeCount(22);
// Filesystem paths
console.log(app.getPath('desktop'));
console.log(app.getPath('music'));
console.log(app.getPath('temp'));
console.log(app.getPath('userData'));

setTimeout(() => {
  console.log(app.isReady());
}, 3000)


app.on('before-quit', function(e){
  console.log('App is about to quit');
  e.preventDefault();
});

app.on('browser-window-blur', function(e){
  setTimeout(() => {
    console.log('browser-window-blur');
  }, 3000);
});

app.on('browser-window-focus', function(e){
  console.log('browser-window-focus');
});

function createWindow () {
  console.log('creating mainWindow');
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    show: true,
    backgroundColor: '#ff0000',
    webPreferences: {
      nodeIntegration: true
    }
  })

  console.log('Loading index.html into mainWindow')
  // and load the index.html of the app.
  mainWindow.loadFile('index.html')
 /* mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });*/
  // mainWindow.loadURL('google.es');

  // Open the DevTools.
 // mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    console.log('mainWindow closed');
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') app.quit()
})

app.on('activate', function () {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) createWindow()
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
