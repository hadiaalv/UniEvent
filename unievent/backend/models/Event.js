const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    date: { type: Date, required: true },
    category: { type: String, required: true },
    organizer: { type: String, required: true },
    status: { 
        type: String, 
        enum: ['pending', 'approved', 'rejected'], 
        default: 'pending',
        required: true
    },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    interested: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    going: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
}, {
    timestamps: true
});

module.exports = mongoose.model('Event', eventSchema);

