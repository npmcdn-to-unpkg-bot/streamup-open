// var Todo = require('./models/init');
// var appConfig = require('./scripts/appConfig');


    // initate node to start working application -------------------------------------------------------------


    module.exports = function (app) {
        // application -------------------------------------------------------------
        //put some feature that are fully managed by node here
        app.get('*', function (req, res) {
            res.sendFile(__dirname + '/public/index.html'); // load the single view file (angular will handle the page changes on the front-end)
        });
    };
