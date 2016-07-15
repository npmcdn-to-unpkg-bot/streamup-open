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
// var server = require('graphQl-Mysql-Server');
// var Schema = require('graphQl-Mysql-Server').Schema;
// const app=require('electron');
const child_process = require('child_process');
var graphql = require ('graphql').graphql;
var chokidar= require('chokidar');
 var mkdirp = require('mkdirp');
var filessystem = require('fs');


var mainWindow = null;
// var options = {
// 	"debug": true   ,
// 	"version": "1.0.0",
// 	"views_dir": "views",
// 	"root_view": "index.html"
// };

// options = _.extend({
// 	// ADDITIONAL CUSTOM SETTINGS
// }, options);

// //how ti run a script in background forever
// //understanding the app from electron!
// app.on('window-all-closed', function() {
//   if(process.platform !== 'darwin') { app.quit(); }
// });


require('crash-reporter').start();


app.on('ready', function() {
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

 
//        // Create the browser window and disable integration with node
//         mainWindow = new BrowserWindow({
//           width: 800,
//           height: 600,
//           nodeIntegration: false
//         });
//         // and load the index.html of the app.
//         mainWindow.loadURL('file://'  , __dirname  , '/public/index.html');
 
//       var mkdirp = require('mkdirp');
//       var dir=shell.exec('./dir.sh',{async:false}).output;
//       mkdirp ('dir', function(err) {
//       shell.echo(dir);
        
//     });
//       // Emitted when the window is closed.
//     mainWindow.on('closed', function() {
//       // Dereference the window object, usually you would store windows
//       // in an array if your app supports multi windows, this is the time
//       // when you should delete the corresponding element.
//       mainWindow = null;
//     });
 
});

