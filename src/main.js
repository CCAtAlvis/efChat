const electron = require('electron');
const { app, BrowserWindow } = electron;
const path = require('path');
const url = require('url');

// ipcMain to communicate between main and renderer process
const {ipcMain} = electron;
let win;

// create the browser window option
let bwOption = {
	// transparent makes the title bar transparent
	// other wise title bar will take system default color
	// transparent: true,
	width: 300,
	minWidth: 300,
	// maxWidth: 300,

	height: 450,
	minHeight: 450,
	// maxHeight: 450,
	// useContentSize: true,
	// fullscreen : true,
	// skipTaskbar: true,
	autoHideMenuBar: true,
};

function createWindow() {
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
let userDetails;
// listen to login-user for logging in user
ipcMain.on('login-user', (event, arg) => {
	userDetails = arg;

	bwOption.width = 800;
	bwOption.minWidth = 800,
	bwOption.height = 600;
	bwOption.minHeight = 600;

	win = new BrowserWindow(bwOption);

	// and load the index.html of the app.
	win.loadURL(url.format({
		pathname: path.join(__dirname, 'chat.html'),
		protocol: 'file:',
		slashes: true
	}));

	event.sender.send('close-login-window');

	win.on('closed', () => {
		win = null
	});
});
