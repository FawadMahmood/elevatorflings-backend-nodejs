const User: mongoose.Model<any> = require('../models/users');
import mongoose = require('mongoose');
import * as jwt from 'jsonwebtoken';
import { Config } from '../config';
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
            return { isUserLogged: true, _id: response._id, email: response.email };
          }

          return { isUserLogged: false };
        });
      } catch (error) {
        return { isUserLogged: false };
      }
    } else {
      return { isUserLogged: false };
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
