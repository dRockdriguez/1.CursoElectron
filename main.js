// Modules to control application life and create native browser window
const { app, BrowserWindow, session, dialog, globalShortcut, Menu, MenuItem, Tray } = require('electron')
require('electron-reload')(__dirname);
const windowStateKeeper = require('electron-window-state');
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
let mainWindow, tray
let childWindow
let secdWindow

function createTray(){
  tray = new Tray('icon.jpg');
  tray.setToolTip('Tooltip tray guay')
  const trayMenu = Menu.buildFromTemplate([
    {label:'Try menu item'},
    {role: 'quit'}
  ])
  //tray.setContextMenu(trayMenu)
  tray.on('click', () => {
    mainWindow.isVisible()? mainWindow.hide() : mainWindow.show()
  })
}
app.setBadgeCount(22);
// Filesystem paths
console.log(app.getPath('desktop'));
console.log(app.getPath('music'));
console.log(app.getPath('temp'));
console.log(app.getPath('userData'));

setTimeout(() => {
  console.log(app.isReady());
}, 3000)

let mainMenu = Menu.buildFromTemplate(require('./contextMenu.js'))
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

function showDialog(){
  dialog.showOpenDialog({
    defaultPath: '/Users/Onetec/Downloads/',
    buttonLabel: 'Select logo'
  }, (onePath) => {
    console.log(onePath)
  });
}



function createWindow () {
  console.log('creating mainWindow');
  
  globalShortcut.register('CommandOrControl+g',() => {
    console.log('user pressed CommandOrControl+g')
    globalShortcut.unregister('CommandOrControl+g', () => {
      console.log('CommandOrControl+g unregistred')
    });
  })

  let appSession = session.fromPartition('persist:partition1') // Estas sesiones que no son las de por defecto no se persisten por defecto. Para que se persistan su nombre debe empezar por 'persist:'
  let defaultSession = session.defaultSession
  let winState = windowStateKeeper({
    defaultHeight: 600 ,
    defaultWidth: 1200
  });

  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: winState.width,
    height: winState.height,
    x: winState.x,
    y: winState.y, 
    show: true,
    backgroundColor: '#ff0000',
    webPreferences: {
      nodeIntegration: true
    },
    // frame: false,
    minWidth: 400,
    minHeight: 200,
    webPreferences: {
      session: appSession
    }
  })
  setTimeout(() => {
    showDialog();
  }, 3000);
  let mainSession = mainWindow.webContents.session
  console.log('mainSession ' + mainSession);
  winState.manage(mainWindow)
  childWindow = new BrowserWindow({
    width: 800,
    height: 600,
    parent: mainWindow,
    modal: true,
    show: false
  });

  secdWindow = new BrowserWindow({
    width: 800,
    height: 600,
    minWidth: 400,
    minHeight: 200
  });

  let secSession = secdWindow.webContents.session
  console.log('secSession ' + secSession);

  console.log(BrowserWindow.getAllWindows());

  console.log('Loading index.html into mainWindow')
  // and load the index.html of the app.
  mainWindow.loadFile('index.html')
  childWindow.loadFile('index_child.html')
  secdWindow.loadFile('index_child.html')

  mainWindow.webContents.on('context-menu', (e) => {
    e.preventDefault()
    mainMenu.popup()
  })

  // Listen for download
  mainSession.on('will-download', (e, downloadItem, webContets) => {
    let file = downloadItem.getFilename();
    downloadItem.setSavePath('downloads/'+file);
    console.log('will download' + downloadItem.getFilename())

    let size = downloadItem.getTotalBytes();
    downloadItem.on('updated', (e, state) => {
      // get download progress
      let progress = Math.round(downloadItem.getReceivedBytes() / size * 100)

      if (state === 'progressing') {
        console.log(progress + '%')
      }
    });
    downloadItem.once('done', (e, state)=> {
      if (state === 'completed') {
        console.log('DOWNLOAD COMPLETEDDDDDDDDDDDDDDDDDDDDDD')
      }
    })
  })
  //mainWindow.loadURL('https://github.com')
  mainSession.cookies.set({
    url: 'https://myapp.com',
    name: 'cookie1',
    value: 'value',
    domain:'myapp.com',
    expirationDate: 99999999
  },
    (error) => {
      console.log('cookies set')
      mainSession.cookies.get({name: 'cookie1'}, (error, cookies) => {
        console.log(cookies)
      })
    });
 
  let mainContents = mainWindow.webContents

  console.log(mainContents)
  childWindow.once('ready-to-show', () => {
    childWindow.show();
  })

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

  secdWindow.on('closed', function () {
    console.log('secdWindow closed');
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })
}

/*childWindow.on('closed', function () {
  console.log('childWindow closed');
  // Dereference the window object, usually you would store windows
  // in an array if your app supports multi windows, this is the time
  // when you should delete the corresponding element.
  childWindow = null
})*/

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', () => {
  createWindow()
  createTray();
  electron.powerMonitor.on('suspend', () => {
    console.log('sleeepepepepepepepeppepe')
  })
  electron.powerMonitor.on('resume', () => {
    console.log('awakekekekek')
  })
  //Menu.setApplicationMenu(mainMenu)
})

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
