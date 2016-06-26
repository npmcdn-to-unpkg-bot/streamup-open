'use strict';
var _ = require('lodash');
var fs = require('file-system');
var app = require('app');
var path = require('path');
var shell = require('shelljs');
var BrowserWindow = require('browser-window');

// ####################################################
// ####################################################

// Report crashes to our server.
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

app.on('ready', function() {

  // shell.mkdir('-p','/home/$USER/Desktop','/home/echo $USER/Desktop/Me');

	// var child = shell.exec('cd bash && ./dir.sh', {async:true});
	// shell.echo(child);
  if (shell.exec('git commit -am "Auto-commit"').code !== 0) {
  shell.echo('Error: Git commit failed');
  exit(1);
}


  //get os home path and create folder there with the permission read,write


  // mainWindow = new BrowserWindow({width: 600, height: 600});
  // mainWindow.loadUrl(path.join('file://', __dirname, options.views_dir, options.root_view));
  // if(options.debug) { mainWindow.openDevTools(); }
  // mainWindow.on('closed', function() { mainWindow = null; });
});

// ############################################################################################
// ############################################################################################
