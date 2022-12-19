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
            refPath: 'type'
        },
        type:{
            type:String,
            require:true
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
        },
        active:{
            type:Boolean,
            default:false
        }
    },
    {
        timestamps: true,
    }
);

ChatScheema.index( { user: 1, ref_user: 1 });
ChatScheema.index( { user: 1});

module.exports = mongoose.model('Chat', ChatScheema);
