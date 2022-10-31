const User: mongoose.Model<any> = require('../models/users');
const Feed: mongoose.Model<any> = require('../models/feed');

import mongoose = require('mongoose');
import * as jwt from 'jsonwebtoken';
import { Config } from '../config';
import Queue from 'bull';

const feedsQueue = new Queue('Home Page Feeds Queue', { redis: { port: 6379, host: '127.0.0.1', password: '' } });


feedsQueue.process(async function (job, done) {
  // transcode image asynchronously and report progress
  // job.progress(42);

  const { _id, new: isNew } = job.data;
  console.time("feedJobQueue");
  // const { _id, new } = job.data;
  const user = await User.findById(_id);
  const nearUsers = await User.find({
    location: {
      $near:
      {
        $geometry: user.location,
        $minDistance: 0,
        $maxDistance: 1000
      }
    }
  })


  for (let i = 0; i < nearUsers.length; i++) {
    const user_ref = nearUsers[i]._doc;
    if (user_ref._id.toString() !== _id) {
      const check_if_exists = await Feed.findOne({
        $and: [
          { user: _id },
          { ref_user: user_ref._id },
        ]
      });

      if (!check_if_exists && user_ref.location) {
        const feed = new Feed({
          name: user_ref.name,
          interests: user_ref.interests,
          user: _id,
          ref_user: user_ref._id,
          location: user_ref.location,
        });
        console.log("adding feed", feed);
        feed.save();
      }
    }
  }


  console.log("queue job ran completed");
  console.timeEnd("feedJobQueue");



  // call done when finished
  done();

  // or give an error if error
  // done(new Error('error transcoding'));

  // or pass it a result
  // done(null, { width: 1280, height: 720 /* etc... */ });

  // If the job throws an unhandled exception it is also handled correctly
  // throw new Error('some unexpected error');
});


export class MongoHelper {
  /**
   * This function returns either true of false based information present in the database
   * @param req
   */
  public async validateUser(req: any) {
    const token = req.headers.authorization || '';
    if (token) {
      try {
        const payload = <{ email: string, iat: number, _id: string, }>(
          jwt.verify(token, <string>process.env.JWT_SECRET)
        );
        const id = payload._id;
        return await User.findById(id).then((response: any) => {
          if (response) {
            return { isUserLogged: true, _id: response._id, email: response.email, queue: feedsQueue };
          }

          return { isUserLogged: false, queue: feedsQueue };
        });
      } catch (error) {
        return { isUserLogged: false, queue: feedsQueue };
      }
    } else {
      return { isUserLogged: false, queue: feedsQueue };
    }
  }

  /**
   * This function will initiate the Mongo Database connection
   */
  public initiateMongoConnection(): void {
    (<any>mongoose).Promise = global.Promise;
    mongoose.connect(Config.mongoUrl, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    })
      .then(() => {
        console.log('Connected to MongoDb');
      })
      .catch((err: Error) => {
        throw `There is error in connecting Mongo DB ${err.message}`;
      });
  }
}
