import mongoose = require('mongoose');
import { Context } from '../models/context';

import { RedisPubSub } from 'graphql-redis-subscriptions';
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
}