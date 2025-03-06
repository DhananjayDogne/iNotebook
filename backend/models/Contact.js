    const mongoose = require('mongoose');
    const { Schema } = mongoose;

    const ContactSchema = new Schema({
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user',
            
        },
        group: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'group',
        },
        name: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true
        },
        mobile: {
            type: Number,
            required: true,
        
        },
        address: {
            type: String,
            default: "General"
        },
        mother: {
            type: String,
            default: "General"
        },
        father: {
            type: String,
            default: "General"
        },
        date: {
            type: Date,
            default: Date.now
        }

    });

    const Contact = mongoose.model('contacts', ContactSchema);
    module.exports=Contact;