const mongoose = require('mongoose');

const LetterSchema = new mongoose.Schema({
    username: {
        type: String, 
        required: true
    }, 
    title: {
        type: String, required: false,
    }, 
    date: {
        type: Date, 
        default: Date.now
    }, 
    content: {
        type: String, 
        required: true
    },
    pin : {
        type: Boolean,
        default: false
    },
    favourite: {
        type: Boolean, 
        default: false
    }, 
    public: {
        type: Boolean, 
        default: false
    },
    images: [{
        type: String, 
        required: false
    }],
    isEncrypted : {
        type: Boolean, 
        default: false
    }
})

module.exports = mongoose.model('Letter', LetterSchema);