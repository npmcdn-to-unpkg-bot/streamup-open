var Todo = require('./models/init');
// var appConfig = require('./scripts/appConfig');
    //put some feature that are fully managed by node here
    
    // initate node to start working application -------------------------------------------------------------
  app.get('*', function (req, res) {
      res.sendFile(__dirname + '/index.html'); // load the single view file (angular will handle the page changes on the front-end)
  });
};
