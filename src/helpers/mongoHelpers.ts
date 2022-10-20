const User: mongoose.Model<any> = require('../models/users');
import mongoose = require('mongoose');
import * as jwt from 'jsonwebtoken';
import { Config } from '../config';
import Queue from 'bull';

const feedsQueue = new Queue('Home Page Feeds Queue', { redis: { port: 6379, host: '127.0.0.1', password: '' } });


feedsQueue.process(function (job, done) {
  // transcode image asynchronously and report progress
  // job.progress(42);

  console.log("queue job ran", job.data);


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
    mongoose
      .connect(Config.mongoUrl, {
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
