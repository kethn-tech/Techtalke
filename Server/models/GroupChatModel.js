const mongoose = require('mongoose');

const groupChatSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide a group name'],
        trim: true
    },
    description: {
        type: String,
        default: ''
    },
    avatar: {
        type: String,
        required: false
    },
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    admins: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    members: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }],
    createdAt: {
        type: Date,
        default: Date.now
    },
    lastMessage: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Message'
    }
});

module.exports = mongoose.model('GroupChat', groupChatSchema);