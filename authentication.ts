import electron = require('electron');
import request = require('request');

const app : GitHubElectron.App = electron.app;
const BrowserWindow = electron.BrowserWindow;
const ipc = electron.ipcRenderer;

export class Authentication {   
    private client_id : string = '1950a258-227b-4e31-a9cf-717495945fc2';
    private redirect_uri: string =  'urn:ietf:wg:oauth:2.0:oob';
    private consent_url : string = 'https://login.windows.net/common/oauth2/authorize?'
                                    + 'resource=https%3A%2F%2Fmanagement.core.windows.net%2F'
                                    + '&client_id=' + this.client_id
                                    + '&response_type=code'
                                    + '&redirect_uri=' + encodeURIComponent(this.redirect_uri);
    private token_url :  string = "https://login.windows.net/common/oauth2/token";
    private resource: string = 'https://management.core.windows.net/';
    private grant_type: string = 'authorization_code';
    private authWindow : any;
    
    constructor(authWindow :any) {
        this.authWindow = authWindow;
    }
        
    public Authenticate(callback: (response: AuthenticationResponse) => void) : void {
        this.authWindow.setMenu(null);
        this.authWindow.loadURL(this.consent_url);
        this.authWindow.show();
        
        this.authWindow.webContents.on('will-navigate', (event, url) => {
            this.handleCallback(url, callback);
        });

        this.authWindow.webContents.on('did-get-redirect-request', (event, oldUrl, newUrl) => {
            this.handleCallback(newUrl, callback);
        });
        
        // authWindow.on('close', function() {
        //     authWindow = null;
        // }, false);
    }
    
    private handleCallback(url: string, callback: (response: AuthenticationResponse) => void) : void {
        var raw_code = /code=([^&]*)/.exec(url) || null;
        var code = (raw_code && raw_code.length > 1) ? raw_code[1] : null;
        var error = /\?error=(.+)$/.exec(url);

        if (code || error) {
            // Close the browser if code found or error
            //authWindow.destroy();
        }

        // If there is a code, proceed to get token from ms auth
        if (code) {
            this.requestToken(code);
        } else if (error) {
            alert('Oops! Something went wrong and we couldn\'t' +
            'log you in using your Microsoft Account. Please try again.');
        }
    }
    
    private requestToken (code) {
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
        }, function(error, response, body) {
            
            ipc.send('auth-success', body);
            
             //console.log(body);
        });
    }
}

interface AuthenticationResponse {
    token_type: string;
    expires_on: string,
    not_before: string;
    resource: string;
    access_token: string;
    refresh_token: string;
    id_token: string;
}