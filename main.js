// var shell = require('shelljs');
// shell.exec('bash ./commands/dir.sh', {silent:false,async:true}).output;
// if (shell.exec('bash cd ~/Desktop && sudo git init && sudo git commit -am "Auto-commit"').code !== 0) {
'use strict';
var _ = require('lodash');
var fs = require('file-system');
var app = require('app');
var path = require('path');
var shell = require('shelljs');
var BrowserWindow = require('browser-window');

// var server = require('graphQl-Mysql-Server');
// var Schema = require('graphQl-Mysql-Server').Schema;

const child_process = require('child_process');
var graphql = require ('graphql').graphql;
var chokidar= require('chokidar');
 var mkdirp = require('mkdirp');
var filessystem = require('fs');

    	
	var dir = '/home/StreamUpBox';
    if (!filessystem.existsSync(dir)){
        filessystem.mkdirSync(dir);
		console.log("Folder created Successfully!");
    }else
    {
        console.log("Folder already exist!");
    }


require('crash-reporter').start();
fs.watch("/home/StreamUpBox", { persistent: true }, function (event, fileName) {
      console.log("Event: " + event);
      console.log(fileName + "\n");
});

// 	var dir=shell.exec('./dir.sh',{async:false}).output;
// 	mkdirp ('dir', function(err) {
// 	shell.echo(dir);
	
// });
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


// app.on('ready', function() {


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

   

// });

