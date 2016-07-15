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

    


// function sortDirectory(path, files, callback, i, dir) {
//     if (!i) {i = 0;}                                            //Init
//     if (!dir) {dir = [];}
//     if(i < files.length) {                                      //For all files
//         fs.lstat(path + '/home/StreamUpBox' + files[i], function (err, stat) { //Get stats of the file
//             if(err) {
//                 console.log(err);
//             }
//             if(stat.isDirectory()) {                            //Check if directory
//                 dir.push(files[i]);                             //If so, ad it to the list
//             }
//             sortDirectory(callback, i + 1, dir);                //Iterate
//         });
//     } else {
//         callback(dir);                                          //Once all files have been tested, return
//     }
// }
// listDirectory('C/home/StreamUpBox', function (dir) {
// console.log("Number of Directories and files in the folder are "+ dir);
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


app.on('ready', function() {


var dir = '/home/StreamUpBox';
    if (!filessystem.existsSync(dir)){
        filessystem.mkdirSync(dir);
		console.log("Folder created Successfully!");
    }
	else
    {
        console.log("Folder already exist!");
    }

var notify;
require('crash-reporter').start();
fs.watch("/home/StreamUpBox", { persistent: true }, function (event, fileName) {
      console.log("Event: " + event);
      console.log(fileName + "\n");
});

// var child = shell.exec('./dir.sh', {async:false}).output;
// 	shell.echo(child);

fs.readdir(dir, function(err, items) {
    console.log(items);
    // for (var i=0; i<items.length; i++) {
    //     console.log("Number of folders and files" + " " +items[i]);
		
    // }
	console.log("NUmber of items:"+items.length);
    // notify =  items.length;
    notifier.notify({
        title: 'In my Directory I have:',
        message: items.length+ " Items!",
        icon: path.join(__dirname, 'coulson.jpg'), // Absolute path (doesn't work on balloons) 
        sound: true, // Only Notification Center or Windows Toasters 
        wait: true // Wait with callback, until user action is taken against notification 
        }, function (err, response) {
        // Response is response from notification 
        });

        notifier.on('timeout', function (notifierObject, options) {
        // Triggers if `wait: true` and notification closes 
        });

        var count=items.length;
    if(count=count+1)
    {
    notifier.notify({
        title: 'Folder Modifications',
        message: 'You add some Items',
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








 
// notifier.on('click', function (notifierObject, options) {
//   // Triggers if `wait: true` and user clicks notification 
// });
 


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

