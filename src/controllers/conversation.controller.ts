import mongoose = require('mongoose');
import { VerifyAuthorization } from '../decorators/auth.decorator';
import { Context } from '../models/context';
import { StatusType, UserType } from '../utils/types';
import { SocketController } from './socket.controller';
const uuid = require('uuid');


const Status: mongoose.Model<StatusType> = require('../models/status');
const Chat: mongoose.Model<any> = require('../models/chat');
const Conversation: mongoose.Model<any> = require('../models/conversation');
const Thread: mongoose.Model<any> = require('../models/thread');

const socketController = new SocketController();

export class ConversationController {
    @VerifyAuthorization
    async getConversations(args:{cursor:string}, ctx: Context) {
            const {cursor} = args;
            let queries:any = [
                {user:ctx._id},
                {active:true}
            ];


            if(cursor){
                queries.push({
                  _id: { $gt: new mongoose.Types.ObjectId(cursor)}
                })
            }

            const chat =await Chat.find({$and:queries}).populate('conversation').populate('ref_user','_id name photoUrl').limit(5);

            return{
                chats:chat
            } as any;
    }
}