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
            type: String,
            default:"AVAILABLE",
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
            required:true,
        },
        photoUrl: {
            type: String,
            required:true
        },
        photos: [{ type: String}],
        location: {
            type: pointSchema,
        },
        address:{
            type:String,
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

EventScheema.index({location:"2dsphere"})

module.exports = mongoose.model('Event', EventScheema);
