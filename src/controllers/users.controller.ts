import { ApolloError } from 'apollo-server-express';
import { Model } from 'mongoose';
import { errors } from '../errors';
import { Context } from '../models/context';

const Users: Model<any> = require('../models/users');
const Phone: Model<any> = require('../models/phone');

export class UsersController {
  async addUser(inputObject: any, ctx: Context) {
    try {
      const { phone, ...input } = inputObject.input;
      const userInfo = await Users.create(input);
      const _phone = await Phone.create({
        phone: phone,
        primary: true,
        user: userInfo._id,
      });
      await Users.updateOne({ _id: userInfo._id }, {
        $set: {
          phone: _phone._id,
        }
      });

      return { ...userInfo._doc, phone: _phone.phone };
    } catch (error) {
      return new ApolloError('User with same email already exist.', errors.EMAIL_ALREADY_EXISTS);
    }
  }

  async updateUser(inputObject: any, ctx: Context) {
    const userInfo = await Users.findOneAndUpdate({ _id: inputObject.id }, inputObject.input, { new: true });
    return userInfo;
  }
}
