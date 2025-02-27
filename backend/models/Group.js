const mongoose = require('mongoose');
const { Schema } = mongoose;

const GroupSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    userlist: [{
        type: Schema.Types.ObjectId,
        ref: 'user', 
        required: true
    }],
    date: {
        type: Date,
        default: Date.now
    }
});

const Group = mongoose.model('group', GroupSchema);

module.exports = Group;