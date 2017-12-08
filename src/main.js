// declearing electron modules
const electron = require('electron');
const { app, BrowserWindow } = electron;
const path = require('path');
const url = require('url');

// ipcMain to communicate between main and renderer process
const {ipcMain} = electron;

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
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
  win.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  }));

  // Emitted when the window is closed.
  win.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    win = null
  });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
});

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null)
    createWindow();
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

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
