// var shell = require('shelljs');
// shell.exec('bash ./commands/dir.sh', {silent:false,async:true}).output;
// if (shell.exec('bash cd ~/Desktop && sudo git init && sudo git commit -am "Auto-commit"').code !== 0) {
// 	shell.echo('Error: Git commit failed');

// };

'use strict';
var _ = require('lodash');
var fs = require('file-system');
var app = require('app');
var path = require('path');
var shell = require('shelljs');
var BrowserWindow = require('browser-window');
var server = require('graphQl-Mysql-Server');
var Schema = require('graphQl-Mysql-Server').Schema;
const child_process = require('child_process');
var graphql = require ('graphql').graphql;
var chokidar= require('chokidar');

// ####################################################
// ####################################################

// Report crashes to our server.
shell.exec('bash ./commands/dir.sh', {silent:false,async:true}).output;
require('crash-reporter').start();



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

// ############################################################################################
// ############################################################################################

// Quit when all windows are closed.
app.on('window-all-closed', function() {
  if(process.platform !== 'darwin') { app.quit(); }
});

var query = '{addFile{addFile(firstName:"richie",lastName:"Me",email:"m@gmail.com"){id}}}';
graphql(Schema, query).then( function(result) {
  console.log(result);
});
app.on('ready', function() {

	var mkdirp = require('mkdirp');
	var user=shell.exec('./dir.sh',{async:false}).output;
	mkdirp ('user', function(err) {
	shell.echo(user);
    // path exists unless there was an error

});
// Watch the /home/working directory
fs.watch("/home/bright", { persistent: true }, function (event, fileName) {
  console.log("Event: " + event);
  console.log(fileName + "\n");
});






// var watcher = chokidar.watch('file or dir', {ignored: /[\/\\]\./, persistent: true});

// watcher
//   .on('add', function(path) {
//     console.log('File', 'has been added');
//   })
//   .on('addDir', function(path) {
//     console.log('Directory', 'has been added');
//   })
// // 'add', 'addDir' and 'change' events also receive stat() results as second argument.
// // http://nodejs.org/api/fs.html#fs_class_fs_stats

// watcher.add('new-file');
// watcher.add(['new-file-2', 'new-file-3']);

// // Only needed if watching is persistent.
// watcher.close();

// // One-liner
// require('chokidar').watch('.', {ignored: /[\/\\]\./}).on('all', function(event, path) {
//   console.log(event, path);
// });


// var watcher = chokidar.watch(', /,', {
//   ignored: /[\/\\]\./, persistent: true
// });
//
// watcher
//   .on('add', function(path) { log('File', path, 'has been added'); });
// fs.watch('/home/working', function(event,filename){
// 	console.log(`event is: ${event}`);
//   if (filename) {
//     console.log(`filename provided: ${filename}`);
//   } else {
//     console.log('filename not provided');
//   }
// });


	//load a folder that a user defined to be a web
  // var user = shell.echo($USER);
  // child_process.exec('./dir.sh', ['mode=ALL'], {}, function(err, data) {
  //   // console.log(stdout);
	// 	shell.echo(err);
  // });
  // fs.mkdir('/home/richard/Desktop/Me');
    // var output = shell.exec("bash ./bash/dir.sh",{silent:true,async:false}).output;
    // shell.echo('Hello there');

});

// ############################################################################################
// ############################################################################################
