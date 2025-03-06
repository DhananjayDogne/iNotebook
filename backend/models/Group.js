const mongoose = require('mongoose');
const { Schema } = mongoose;

const GroupSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    createdBy:{
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    userlist: [{
        type: Schema.Types.ObjectId,
        ref: 'user', 
        required: true
    }],
    contacts: [{
        type: Schema.Types.ObjectId,
        ref: 'contacts', 
        required: true
    }],
    date: {
        type: Date,
        default: Date.now
    }
});

const Group = mongoose.model('group', GroupSchema);

module.exports = Group;