import mongoose = require("mongoose");
const User = require('./users');

const ImageSchema = new mongoose.Schema(
    {
        imageUrl: {
            type: String,
            required: true
        },
        primary: {
            type: Boolean,
            default: false,
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('Image', ImageSchema);
