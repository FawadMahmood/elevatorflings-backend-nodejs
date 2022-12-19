import mongoose = require("mongoose");

import Chat = require('../models/chat')
import Conversation = require('../models/conversation')


const pointSchema = new mongoose.Schema({
    type: {
      type: String,
      enum: ['Image',"Video"],
      required: true
    },
    path: {
      type: String,
      required: true
    }
  });

const reactionSchema = new mongoose.Schema({
    type: {
      type: String,
      required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
});


const seenSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    photoUrl:{
        type:String
    },
    name:{
        type:String 
    },
    createdAt:{
        type: Date,
        default: () => Date.now(),
    }
});

const ThreadScheema = new mongoose.Schema(
    {
        conversation:{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Conversation',
        },
        user:{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
        sender:{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
        unique_id:{
            type: String,
        },
        message:{
            type:String
        },
        attachments:[
            {
               type: pointSchema
            }
        ],
        reactions:[
            {
                    type:reactionSchema,
            }
        ],
        reference_id:{
            type: String,
        },
        deliveredAt:{
            type:Date
        },
        participants:[{type:mongoose.Schema.Types.ObjectId,ref:"User"}],
        seenBy:[
            {
                type:seenSchema
            }
        ],
        deliveredTo:[
            {
                type:seenSchema
            }
        ]
    },
    {
        timestamps: true,
    }
);

ThreadScheema.index({conversation:1,user:1});
ThreadScheema.index({unique_id:1,conversation:1});
ThreadScheema.index({participants:1});
ThreadScheema.index({unique_id:1,conversation:1,participants:1});
ThreadScheema.index({unique_id:1});

module.exports = mongoose.model('Thread', ThreadScheema);
