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


require('crash-reporter').start();

fs.watch("/home/StreamUpBox", { persistent: true }, function (event, fileName) {
      console.log("Event: " + event);
      console.log(fileName + "\n");
});

var mainWindow = null;
var options = {
	"debug": true   ,
	"version": "1.0.0",
	"views_dir": "views",
	"root_view": "index.html"
};

options = _.extend({
	// ADDITIONAL CUSTOM SETTINGS
}, options);

//how ti run a script in background forever
//understanding the app from electron!
app.on('window-all-closed', function() {
  if(process.platform !== 'darwin') { app.quit(); }
});


// app.on('ready', function() {

//       var mkdirp = require('mkdirp');
//       var dir=shell.exec('./dir.sh',{async:false}).output;
//       mkdirp ('dir', function(err) {
//       shell.echo(dir);
        
//     });


   

// });

