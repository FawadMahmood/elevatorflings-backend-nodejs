import mongoose = require("mongoose");
const User = require('./users');


const pointSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ['Point'],
        required: true
    },
    coordinates: {
        type: [Number],
        required: true
    }
});

const FeedSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },
        interests: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Interest' }],
        location: {
            type: pointSchema,
            required: true
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        ref_user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        gender: {
            type: String,
        },
        ignored: {
            type: Boolean,
            default: false
        },
        match: {
            type: Boolean,
            default: false
        },
        status: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Status',
        },
        state: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'State',
        },
        country: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Country',
        },
        buildingId:{
            type: String
          }
    },
    {
        timestamps: true,
    }
);


FeedSchema.index({location:'2dsphere'});
module.exports = mongoose.model('Feed', FeedSchema);
