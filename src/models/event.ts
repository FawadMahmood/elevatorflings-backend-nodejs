import mongoose = require("mongoose");

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

const EventScheema = new mongoose.Schema(
    {
        name: {
            type: String,
        },
        description: {
            type: String,
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
        },
        status: {
            type: String
        },
        interests: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Interest' }],
        start_date:{
            type: Date,
        },
        end_date:{
            type: Date,
        },
        createdBy:{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
        photoUrl: {
            type: String,
        },
        photos: [{ type: String}],
        location: {
            type: pointSchema,
        },
        available:{
            type:Boolean,
            default:true,
        }
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('Event', EventScheema);
