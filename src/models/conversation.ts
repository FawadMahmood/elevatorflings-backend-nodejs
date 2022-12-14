import mongoose = require("mongoose");

import Chat = require('../models/chat')
import Thread = require('../models/thread')

const ConversationScheema = new mongoose.Schema(
    {
        participants:[{type:mongoose.Schema.Types.ObjectId,ref:"User"}] ,
        last_message:{
            type:String,
        },
        event:{type:mongoose.Schema.Types.ObjectId,ref:"Event"}
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('Conversation', ConversationScheema);
