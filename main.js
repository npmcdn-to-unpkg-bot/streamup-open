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
const notifier = require('node-notifier');
const child_process = require('child_process');
var graphql = require ('graphql').graphql;
var chokidar= require('chokidar');
 var mkdirp = require('mkdirp');
var filessystem = require('fs');


var mainWindow = null;
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


mainWindow = new BrowserWindow({width: 800, height: 600});
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
            message: 'You have added some Items',
            icon: path.join(__dirname, 'coulson.jpg'), // Absolute path (doesn't work on balloons) 
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
       
});


