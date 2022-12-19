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

export class ChatController {

    async getConversationId(args: { userId: string; }, ctx: Context) {
        const {userId} = args;
        const chat = await Chat.findOne({$and:[{user:ctx._id},{ref_user:userId}]});
        if(chat){
            return{
                conversation_id:chat.conversation,
            }
        }else{
            const conv = new Conversation({
                participants:[ctx._id,userId],
                last_message:"" 
            });
            const a = new Chat({
                user:ctx._id,
                ref_user:userId,
                conversation:conv._id,
            });
            const b = new Chat({
                ref_user:ctx._id,
                user:userId,
                conversation:conv._id,
            });

            conv.save();
            a.save();
            b.save();

            return{
                conversation_id:conv._id,
            }
        }
    }

    @VerifyAuthorization
    async getChats(args: { userId: string;cursor:string; }, ctx: Context) {
        const {userId} = args;
            let queries:any = [
                {conversation:userId},
                {participants:{$in:[ctx._id]}},
            ];

            console.log("getting chats query", queries);
            

            if(args.cursor){
                queries.push({
                  _id: { $lt: new mongoose.Types.ObjectId(args.cursor) }
                })
            }

            const threads =await Thread.find({$and:queries}).limit(15).populate('sender','_id name photoUrl').populate('reactions.user','_id name photoUrl').sort({createdAt:-1});



            console.log("recieved threads", threads);

            return{
                chats:threads,
                conversation_id:userId,
            } as any;
    }


    @VerifyAuthorization
    async sendMessage(args: { input:{userId: string;payload:{message:string,attachments:{type:"Image"|"Video",path:string;}[],reference_id:string}} }, ctx: Context) {
        const {password,...user}= ctx.userInfo as UserType;
        const {userId,payload} = args.input;
        const conversation = await Conversation.findById(userId);
        const unique_id = uuid.v4() +conversation._id;
        

        Chat.updateMany({
            conversation:conversation._id
        },{
            $set:{
                active:true,
            }
        }).then(res=>{
        });

        Conversation.updateOne({
            _id:conversation._id,
        },{
            $set:{
                last_message:payload.message
            }
        }).then(()=>{
            
        })
        


        const seenReaction={
            user:ctx._id,
            photoUrl:user.photoUrl,
            name:user.name,
            createdAt: new Date(),
        }

        const thread = new Thread({
            conversation:conversation._id,
            unique_id:unique_id,
            message:payload.message,
            attachments:payload.attachments,
            sender:ctx._id,
            reference_id:payload.reference_id,
            participants:conversation.participants,
            seenBy:[seenReaction],
            deliveredTo:[seenReaction],
        });

        await thread.save();
        socketController.emitMessageUpdate(thread,ctx);

        console.log("thread save here like",thread);
        
        // socketController.emitMessageUpdate(thread,ctx);
     
    //    await conversation.participants.forEach(async(element:string) => {
            // const thread = new Thread({
            //     conversation:conversation._id,
            //     user:element,
            //     unique_id:unique_id,
            //     message:payload.message,
            //     attachments:payload.attachments,
            //     sender:ctx._id,
            //     reference_id:payload.reference_id
            // });

    //         await thread.save();
    //         socketController.emitMessageUpdate(thread,ctx);
    //     });
        // const _thread = await Thread.findOne({$and:[{conversation:conversation._id},{user:ctx._id},{unique_id:unique_id}]});
  

        return {...thread._doc,sender:user,reference_id:payload.reference_id,conversation:conversation._id} as any;
    }
}