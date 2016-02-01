const electron = require('electron');
const authentication = require('./authentication')

const app = electron.app;
const BrowserWindow = electron.BrowserWindow;

app.on('ready', createWindow);

var mainWindow = null;
var authWindow = null;

function createWindow () {
    mainWindow = new BrowserWindow({width: 800, height: 600});
    mainWindow.loadURL('file://' + __dirname + '/build/index.html');
    
    authWindow = new BrowserWindow({width: 400, height: 600});
    
    var auth = new authentication.Authentication(authWindow);
    
    auth.Authenticate(function (resp) {
        authWindow.destroy();
    });
}