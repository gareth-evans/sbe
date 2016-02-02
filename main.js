const electron = require('electron');
const request = require('request');
const authentication = require('./authentication');
const ipc = electron.ipcMain;

const app = electron.app;
const BrowserWindow = electron.BrowserWindow;

app.on('ready', createWindow);

var mainWindow = null;

function createWindow () {
    mainWindow = new BrowserWindow({width: 800, height: 600});
    mainWindow.loadURL('file://' + __dirname + '/index.html');

    var authWindow = new BrowserWindow({ width: 400, height: 600, show: false, 'node-integration': false, 'web-security': false });
    authWindow.setMenu(null);
    
    var auth = new authentication.Authentication(authWindow);

    auth.Authenticate(function(resp) { console.log(resp); });
}

ipc.on('auth-success', function (x) {
    console.log(x);
    
    console.log('main got auth sucess!!');
});