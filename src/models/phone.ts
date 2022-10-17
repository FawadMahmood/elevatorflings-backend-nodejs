import mongoose = require("mongoose");
const User = require('./users');

const PhoneSchema = new mongoose.Schema(
    {
        phone: {
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

module.exports = mongoose.model('Phone', PhoneSchema);
