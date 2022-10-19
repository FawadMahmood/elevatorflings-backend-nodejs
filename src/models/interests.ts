import mongoose = require("mongoose");
const User = require('./users');

const InterestSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true
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

module.exports = mongoose.model('Interest', InterestSchema);
