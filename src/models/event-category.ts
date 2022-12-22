import mongoose = require("mongoose");
const User = require('./users');

const EventCategoryScheema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true
        },
        imageUrl: {
            type: String,
        },
        addedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        }
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('EventCategory', EventCategoryScheema);
