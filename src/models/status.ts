import mongoose = require("mongoose");

const StatusSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },
        imageUrl: {
            type: String,
        }
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('Status', StatusSchema);
