const electron = require('electron');
const { app, BrowserWindow } = electron;
const path = require('path');
const url = require('url');
const server = require('./server.js');

// ipcMain to communicate between main and renderer process
const {ipcMain} = electron;
let win;

function createWindow() {
  // create the browser window option
  let bwOption = {
    // transparent makes the title bar transparent
    // other wise title bar will take system default color
    // transparent: true,
    width: 300,
    minWidth: 300,
    // maxWidth: 300,

    height: 450,
    minHeight: 450
    // maxHeight: 450
    // useContentSize: true
  };

  // Create the browser window.
  win = new BrowserWindow(bwOption);

  // and load the index.html of the app.
  // win.loadURL(url.format({
  //   pathname: path.join(__dirname, 'test.html'),
  //   protocol: 'file:',
  //   slashes: true
  // }));
  win.loadURL('http://localhost:5685/test.html');
  

  // Emitted when the window is closed.
  win.on('closed', () => {
    win = null
  });
}

// This method will be called when Electron has finished initialization.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
});

app.on('activate', () => {
  if (win === null)
    createWindow();
});

// set the menu bar to null when the browser window is created
// so we have a simless effect
app.on('browser-window-created', (e, window) => {
  // window.setMenu(null);
});


// HERE GOES THE MAIN LOGIC CODE

// listen to login-user for logging in user

ipcMain.on('login-user', (event, arg) => {
  // console.log(event);
  // console.log(arg);
  // will handle this later
  // TODO
});
