const electron = require('electron');
const request = require('request');

// Module to control application life.
const app = electron.app;
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow;

app.on('ready', createWindow);

var mainWindow = null;

function createWindow () {

mainWindow = new BrowserWindow({width: 800, height: 600});

  // and load the index.html of the app.
mainWindow.loadURL('file://' + __dirname + '/index.html');

// Your GitHub Applications Credentials
var options = {
    client_id: '1950a258-227b-4e31-a9cf-717495945fc2',
    //scopes: ["user:email", "notifications"] // Scopes limit access for OAuth tokens.
};

// Build the OAuth consent page URL
var authWindow = new BrowserWindow({ width: 400, height: 600, show: false, 'node-integration': false, 'web-security': false });
authWindow.setMenu(null);
var githubUrl = 'https://login.windows.net/common/oauth2/authorize?';
var authUrl = githubUrl
                    + 'resource=https%3A%2F%2Fmanagement.core.windows.net%2F'
                    + '&client_id=' + options.client_id
                    + '&response_type=code'
                    + '&redirect_uri=urn%3Aietf%3Awg%3Aoauth%3A2.0%3Aoob'; // + '&scope=' + options.scopes;
authWindow.loadURL(authUrl);
authWindow.show();

function handleCallback (url) {
  var raw_code = /code=([^&]*)/.exec(url) || null;
  var code = (raw_code && raw_code.length > 1) ? raw_code[1] : null;
  var error = /\?error=(.+)$/.exec(url);

  if (code || error) {
    // Close the browser if code found or error
    //authWindow.destroy();
  }

  // If there is a code, proceed to get token from github
  if (code) {
    requestToken(options, code);
  } else if (error) {
    alert('Oops! Something went wrong and we couldn\'t' +
      'log you in using Github. Please try again.');
  }
}

var requestToken = function (options, code) {
    request({
    uri: "https://login.windows.net/common/oauth2/token",
    method: "POST",
    form: {
            resource: 'https%3A%2F%2Fmanagement.core.windows.net%2F',
            client_id: '1950a258-227b-4e31-a9cf-717495945fc2',
            grant_type:'authorization_code',
            code: code
    }
    }, function(error, response, body) {
    console.log(body);
    });
}

// Handle the response from GitHub - See Update from 4/12/2015

authWindow.webContents.on('will-navigate', function (event, url) {
  handleCallback(url);
});

authWindow.webContents.on('did-get-redirect-request', function (event, oldUrl, newUrl) {
  handleCallback(newUrl);
});

// Reset the authWindow on close
authWindow.on('close', function() {
    authWindow = null;
}, false);



}