
var express = require('express');
var app = express()	;				// create our app w/ express

  // io = require('socket.io').listen(app),
  // fs = require('fs');

var port = process.env.PORT || 9000; 				// set the port

var morgan = require('morgan');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');

// configuration ===============================================================
// mongoose.connect(database.localUrl); 	// Connect to local MongoDB instance. A remoteUrl is also available (modulus.io)

app.use(express.static(__dirname + '/App')); 		// set the static files location /public/img will be /img for users
app.use(morgan('dev')); // log every request to the console
app.use(bodyParser.urlencoded({'extended': 'true'})); // parse application/x-www-form-urlencoded
app.use(bodyParser.json()); // parse application/json
app.use(bodyParser.json({type: 'application/vnd.api+json'})); // parse application/vnd.api+json as json
app.use(methodOverride('X-HTTP-Method-Override')); // override with the X-HTTP-Method-Override header in the request


// routes ======================================================================
require('./App/routes.js')(app);

// listen (start app with node server.js) ======================================
app.listen(port);

// io.sockets.on('connection', function(socket) {

//   console.log('Number of connections:' + connectionsArray.length);
//   // starting the loop only if at least there is one user connected
//   if (!connectionsArray.length) {
//     // pollingLoop(); loading some data
//   }

//   socket.on('disconnect', function() {
//     var socketIndex = connectionsArray.indexOf(socket);
//     console.log('socket = ' + socketIndex + ' disconnected');
//     if (socketIndex >= 0) {
//       connectionsArray.splice(socketIndex, 1);
//     }
//   });

//   console.log('A new socket is connected!');
//   connectionsArray.push(socket);

// });

console.log("App listening on port " + port);
// Status API Training Shop
