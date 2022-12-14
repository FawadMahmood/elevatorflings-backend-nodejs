import mongoose = require('mongoose');
import { Context } from '../models/context';
const User: mongoose.Model<UserType> = require('../models/users');
const Thread: mongoose.Model<any> = require('../models/thread');

import { RedisPubSub } from 'graphql-redis-subscriptions';
import { UserType } from '../utils/types';
const pubsub = new RedisPubSub({
  connection:{
    port: 6379, 
    host: '127.0.0.1', 
    password: ''
  }
});

export class SocketController {
    registerSocket(args: { userId: string }, ctx: Context) {
       return pubsub.asyncIterator(`${'USER_EVENT'}.${args.userId}`)
    }

    async emitMessageUpdate(thread:any, ctx: Context) {
        console.log("want to emit message update", thread.user);
        // const _thread = await Thread.findById(thread._id).populate('sender','_id name photoUrl').populate('reactions.user','_id name photoUrl');
        const user = await User.findById(thread.sender);
      
        console.log("thread got",{
          type:"MESSAGE",
          payload:{...thread,sender:user},
      });
        
        pubsub.publish(
          `${'USER_EVENT'}.${thread.user}`, 
          { userEvent:
             {
              type:"MESSAGE",
              payload:{...thread._doc,sender:user},
          }
      });

    }
}