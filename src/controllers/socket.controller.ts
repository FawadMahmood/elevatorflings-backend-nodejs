import mongoose = require('mongoose');
import { Context } from '../models/context';
const User: mongoose.Model<UserType> = require('../models/users');

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
        console.log("want to emit message update", thread.attachments);
        const user = await User.findById(thread.sender);
        pubsub.publish(
          `${'USER_EVENT'}.${thread.user}`, 
          { userEvent:
             {
              type:"MESSAGE",
              payload:{
                from:thread.sender,
                resource_id:
                thread.conversation,
                extraData:{
                    resource_name:user?.name,
                    message:thread.message,
                },
                attachments:thread.attachments
              },
             }
      });

    }
}