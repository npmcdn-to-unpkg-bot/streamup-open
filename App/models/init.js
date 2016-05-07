var mongoose = require('mongoose');

module.exports = mongoose.model('Init', {
    text: {
        type: String,
        default: ''
    }
});
