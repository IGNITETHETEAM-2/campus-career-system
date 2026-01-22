const mongoose = require('mongoose');

const loginHistorySchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    loginTime: {
        type: Date,
        default: Date.now
    },
    ipAddress: {
        type: String,
        default: 'unknown'
    },
    userAgent: {
        type: String,
        default: 'unknown'
    },
    status: {
        type: String,
        enum: ['Success', 'Failed'],
        default: 'Success'
    }
});

module.exports = mongoose.model('LoginHistory', loginHistorySchema);
