var electron = require('electron');
var request = require('request');
var app = electron.app;
var BrowserWindow = electron.BrowserWindow;
var Authentication = (function () {
    function Authentication(authWindow) {
        this.client_id = '1950a258-227b-4e31-a9cf-717495945fc2';
        this.redirect_uri = 'urn:ietf:wg:oauth:2.0:oob';
        this.consent_url = 'https://login.windows.net/common/oauth2/authorize?'
            + 'resource=https%3A%2F%2Fmanagement.core.windows.net%2F'
            + '&client_id=' + this.client_id
            + '&response_type=code'
            + '&redirect_uri=' + encodeURIComponent(this.redirect_uri);
        this.token_url = "https://login.windows.net/common/oauth2/token";
        this.resource = 'https://management.core.windows.net/';
        this.grant_type = 'authorization_code';
        this.authWindow = authWindow;
    }
    Authentication.prototype.Authenticate = function (callback) {
        var _this = this;
        this.authWindow.setMenu(null);
        this.authWindow.loadURL(this.consent_url);
        this.authWindow.show();
        this.authWindow.webContents.on('will-navigate', function (event, url) {
            _this.handleCallback(url, callback);
        });
        this.authWindow.webContents.on('did-get-redirect-request', function (event, oldUrl, newUrl) {
            _this.handleCallback(newUrl, callback);
        });
        // authWindow.on('close', function() {
        //     authWindow = null;
        // }, false);
    };
    Authentication.prototype.handleCallback = function (url, callback) {
        var raw_code = /code=([^&]*)/.exec(url) || null;
        var code = (raw_code && raw_code.length > 1) ? raw_code[1] : null;
        var error = /\?error=(.+)$/.exec(url);
        if (code || error) {
        }
        // If there is a code, proceed to get token from ms auth
        if (code) {
            this.requestToken(code);
        }
        else if (error) {
            alert('Oops! Something went wrong and we couldn\'t' +
                'log you in using your Microsoft Account. Please try again.');
        }
    };
    Authentication.prototype.requestToken = function (code) {
        request({
            uri: this.token_url,
            method: "POST",
            form: {
                resource: this.resource,
                client_id: this.client_id,
                grant_type: this.grant_type,
                code: code,
                redirect_uri: this.redirect_uri
            }
        }, function (error, response, body) {
            console.log(body);
        });
    };
    return Authentication;
})();
exports.Authentication = Authentication;
//# sourceMappingURL=authentication.js.map