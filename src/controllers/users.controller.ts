import { ApolloError } from 'apollo-server-express';
import { Model } from 'mongoose';
import { errors } from '../errors';
import { Context } from '../models/context';
import Joi from 'Joi'


const Users: Model<any> = require('../models/users');
const Phone: Model<any> = require('../models/phone');


const locationValidation = Joi.object({
  type: Joi.string().valid('Point'),
  coordinates: Joi.array(),
});

const addUserValidationScheema = Joi.object({
  email: Joi.string().email().required(),
  username: Joi.string().min(3).required(),
  password: Joi.string().min(8).required(),
  name: Joi.string().min(3).required(),
  provider: Joi.string().valid('self', 'facebook', 'google', 'apple').required(),
  location: locationValidation,
  phone: Joi.string().required(),
});

export class UsersController {
  async addUser(inputObject: any, ctx: Context) {
    try {


      const validate = addUserValidationScheema.validate(inputObject.input);

      if (validate.error) {
        return {
          error: {
            message: validate.error.message,
            code: errors.MISSING_FIELDS
          },
          user: null,
        }
      }


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

      return { user: { ...userInfo._doc, phone: _phone.phone }, error: null };
    } catch (error) {
      return {
        error: {
          message: "User with same email already exist.",
          code: errors.EMAIL_ALREADY_EXISTS
        },
        user: null,
      } //new ApolloError('User with same email already exist.', errors.EMAIL_ALREADY_EXISTS);
    }
  }

  async updateUser(inputObject: any, ctx: Context) {
    const userInfo = await Users.findOneAndUpdate({ _id: inputObject.id }, inputObject.input, { new: true });
    return userInfo;
  }
}
