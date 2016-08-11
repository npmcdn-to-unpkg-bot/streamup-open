var notifier = require('node-notifier');

function send(message) {
    console.log(message);
};
module.exports = {
    send: send
};