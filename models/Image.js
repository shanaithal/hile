var mongoose = require('mongoose');

var imageSchema = mongoose.Schema({
    data: {
        type: Buffer
    },
    content_type: {
        type: String
    },
    entity_type: {
    	type: String
    },
    entity_id: {
    	type: String
    }
});

module.exports = mongoose.model('Image', imageSchema);
