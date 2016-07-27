'use strict';

var app = require('app');
var Tray = require('electron');
var BrowserWindow = require('browser-window');
var path = require('path');
var mainWindow = null;
var globalShortcut = require('global-shortcut');
var _ = require('lodash');

var shell = require('shelljs');
var notification = require('./app_modules/notifier');
var child_process = require('child_process');
var graphql = require ('graphql').graphql;
var chokidar= require('chokidar');
var mkdirp = require('mkdirp');
var fs = require('fs');
var ncp = require('ncp').ncp;
var express = require('express'), cors = require('cors');
var http = require('http');
var configuration = require('./app_modules/configuration');
var  configureApp =require('./app_modules/windowManager');
var options = {
	"debug": true,
	"version": "1.0.0",
	"views_dir": "App",
	"root_view": "index.html"
};

// var  shouldQuit = app.makeSingleInstance(function() {
//        if (mainWindow) {
//       if (mainWindow.isMinimized()) mainWindow.restore();
//       mainWindow.focus();
//       mainWindow.show();
//       mainWindow.setSkipTaskbar(false);
//       if (app.dock && app.dock.show) app.dock.show();
//     }
//   });
configureApp.defaultWindow(app);
require('crash-reporter').start();
app.on('ready', function() {
    if (!configuration.readSettings('shortcutKeys')) {
        configuration.saveSettings('shortcutKeys', ['ctrl', 'shift']);
        //TODO on SignUp complete with success please use the above code to save user credential for future use also encrypt it on local!
    };
    var  iconPath =__dirname + '/dist/img/app-icon.png';
    mainWindow = new BrowserWindow({
        frame: true,
        kiosk: true,
        height: 500,   
        title:"StreamUpBox Setup",
        resizable: false,
        width: 310,
        icon: iconPath,
        transparent:true
    });
    mainWindow.setMenu(null);
    
    mainWindow.loadUrl(path.join('file://', __dirname, options.views_dir, options.root_view));

    new Tray(iconPath);

    var os = require('os'),
     userInfo = require('user-info');
    var dir = os.homedir() +'/StreamUpBox';
    
    fs.exists(dir,function (params,status) {
       if(status !== true){
           fs.mkdir(dir,function(_,t){});
           fs.chmod(dir, '777',function(_,t){
                
            });
            console.log("Folder created Successfully!");
        }else{
             fs.chmod(dir, '777',function(_,t){

             });
            console.log("Folder already exist!");
        };
    });
    
    var folderWatcher = function(object) {
       
        require('chokidar').watch(os.homedir()+'/StreamUpBox', {ignored: /[\/\\]\./}).on('all', function(event, path) {
            if(event === "unlink"){
                notification.send('removed files');
            }else if(event === "add"){
                
                 notification.send('add new file');
            }else if(event ==="change"){
                 notification.send('changes');

            }
            console.log(event, path);
        });
    };
    
    
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