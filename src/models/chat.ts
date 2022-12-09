import mongoose = require("mongoose");
import Conversation = require('../models/conversation')
import Thread = require('../models/thread')

const ChatScheema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
        ref_user:{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
        conversation:{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Conversation',
        },
        canReply:{
            type:Boolean,
            default:true,
        },
        reason:{
            type:String
        }
    },
    {
        timestamps: true,
    }
);

ChatScheema.index( { user: 1, ref_user: 1 });

module.exports = mongoose.model('Chat', ChatScheema);
