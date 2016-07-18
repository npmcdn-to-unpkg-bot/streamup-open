// var shell = require('shelljs');
// shell.exec('bash ./commands/dir.sh', {silent:false,async:true}).output;
// if (shell.exec('bash cd ~/Desktop && sudo git init && sudo git commit -am "Auto-commit"').code !== 0) {
'use strict';
var _ = require('lodash');
var fs = require('file-system');
var app=require ('app');
var path = require('path');
var shell = require('shelljs');
var BrowserWindow = require('browser-window');
var notifier = require('node-notifier');
var child_process = require('child_process');
var graphql = require ('graphql').graphql;
var chokidar= require('chokidar');
 var mkdirp = require('mkdirp');
var filessystem = require('fs');
var ncp = require('ncp').ncp;

var mainWindow = null;
var globalShortcut = require('global-shortcut');

//install nconf dependency for this configuration to work
var configuration = require('./configuration');

var options = {
	"debug": false,
	"version": "1.0.0",
	"views_dir": "App",
	"root_view": "index.html"
};

options = _.extend({
	// ADDITIONAL CUSTOM SETTINGS
}, options);


require('crash-reporter').start();
app.on('ready', function() {

     if (!configuration.readSettings('shortcutKeys')) {
         configuration.saveSettings('shortcutKeys', ['ctrl', 'shift']);
     };
    mainWindow = new BrowserWindow({frame: false,
            height: 500,
            // show: true,
            resizable: false,
            width: 338});
     setGlobalShortcuts();
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
  mainWindow.loadUrl(path.join('file://', __dirname, options.views_dir, options.root_view));
  if(options.debug) { mainWindow.openDevTools(); }
    mainWindow.on('closed', function() { mainWindow = null; });

    var folderWatcher = function(object) {
            fs.readdir(dir, function(err, items) {
            // console.log(items);
            var count=items.length;
            if(count=count+1)
            {
            notifier.notify({
                title: items.length+ 'Files by now!',
                message: 'You have added some Files',
                icon: path.join(__dirname, '/dist/img/app-icon.png'), // Absolute path (doesn't work on balloons) 
                sound: true, // Only Notification Center or Windows Toasters 
                wait: true // Wait with callback, until user action is taken against notification 
                }, function (err, response) {
                // Response is response from notification 
                });

                notifier.on('timeout', function (notifierObject, options) {
                // Triggers if `wait: true` and notification closes 
                }); 
            }


        });
    };
    fs.watch("/home/StreamUpBox", { persistent: true }, function (event, fileName) {
        folderWatcher();
    });
    //Creating the Directory and watch it.
    var dir = '/home/StreamUpBox';
    if (!filessystem.existsSync(dir)){
        filessystem.mkdirSync(dir);
        console.log("Folder created Successfully!");
    }
    else
    {
        console.log("Folder already exist!");
    }
     var destination='files';
    ncp.limit = 16;
    ncp(dir, destination, function (err) {
    if (err) {
        return console.error(err);
    }else{
        //apply the logic of sending files to server
        console.log('done copying!');
    }
  
 });  
});


