'use strict';

var app = require('app');
var BrowserWindow = require('browser-window');
var path = require('path');
var mainWindow = null;
var globalShortcut = require('global-shortcut');
var _ = require('lodash');
var fs = require('file-system');
var shell = require('shelljs');
var notification = require('./app_modules/notifier');
var child_process = require('child_process');
var graphql = require ('graphql').graphql;
var chokidar= require('chokidar');
var mkdirp = require('mkdirp');
var filessystem = require('fs');
var ncp = require('ncp').ncp;
var express = require('express'), cors = require('cors');
var http = require('http');
var configuration = require('./app_modules/configuration');
var options = {
	"debug": true,
	"version": "1.0.0",
	"views_dir": "App",
	"root_view": "index.html"
};
require('crash-reporter').start();
app.on('ready', function() {
    if (!configuration.readSettings('shortcutKeys')) {
        configuration.saveSettings('shortcutKeys', ['ctrl', 'shift']);
        //TODO on SignUp complete with success please use the above code to save user credential for future use also encrypt it on local!
    };
    mainWindow = new BrowserWindow({
        frame: true,
        kiosk: true,
        height: 500,   
        title:"StreamUpBox Setup",
        resizable: false,
        width: 310
    });
    mainWindow.setMenu(null);
    mainWindow.loadUrl(path.join('file://', __dirname, options.views_dir, options.root_view));

    
    var folderWatcher = function(object) {
       
        require('chokidar').watch('/home/StreamUpBox', {ignored: /[\/\\]\./}).on('all', function(event, path) {
            if(event === "unlink"){
                notification.send('removed files');
            }else if(event === "add"){
                //we got a new files push them to the server
                //TODO As we are listening on new files added please upload each on server
                 var server = express();
                    var corsOptions = {
                    origin: 'http://localhost:8000/'
                    };
                    server.post('streamupbox.com/api/v1/upload', cors(corsOptions), function(req, res, next){
                        console.log(res);
                        res.json({msg: 'This is CORS-enabled for only example.com.'});
                    });
                 notification.send('add new file');
            }else if(event ==="change"){
                 notification.send('changes');

            }
            
            console.log(event, path);
        });
    };
    
 
    var dir = '/home/StreamUpBox';
    if (!filessystem.existsSync(dir)){
        filessystem.mkdirSync(dir);
        console.log("Folder created Successfully!");
    }
    else
    {
        console.log("Folder already exist!");
    }

    fs.watch("/home/StreamUpBox", { persistent: true }, function (event, fileName) {
        folderWatcher();
    });
});

function setGlobalShortcuts() {
    globalShortcut.unregisterAll();

    var shortcutKeysSetting = configuration.readSettings('shortcutKeys');
    var shortcutPrefix = shortcutKeysSetting.length === 0 ? '' : shortcutKeysSetting.join('+') + '+';

    globalShortcut.register(shortcutPrefix + '1', function () {
        mainWindow.webContents.send('global-shortcut', 0);
    });
    globalShortcut.register(shortcutPrefix + '2', function () {
        mainWindow.webContents.send('global-shortcut', 1);
    });
};

var ipc = require('ipc');

ipc.on('close-main-window', function () {
    app.quit();
});

var settingsWindow = null;