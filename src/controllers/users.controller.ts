import { ApolloError } from 'apollo-server-express';
import { Error, Model } from 'mongoose';
import { errors } from '../errors';
import { Context } from '../models/context';
import Joi from 'Joi'
// @ts-ignore
import otpGenerator from 'otp-generator'
// var otpGenerator = require("otp-generator");


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
  age: Joi.number().min(18),
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
      const userInfo = new Users(input);
      const _phone = new Phone({ phone: phone, primary: true, user: userInfo._id, accessToken: userInfo.generateToken() });
      userInfo.phone = _phone._id;
      const promises = await Promise.all([await userInfo.save(), _phone.save()]).then(() => console.log("adding user success"));
      return { user: { ...userInfo._doc, phone: _phone }, error: null };
    } catch (error) {
      return {
        error: {
          message: "User with same email already exist.",
          code: errors.EMAIL_ALREADY_EXISTS
        },
        user: null,
      }
    }
  }

  async updateUser(inputObject: any, ctx: Context) {
    const userInfo = await Users.findOneAndUpdate({ _id: inputObject.id }, inputObject.input, { new: true });
    return userInfo;
  }

  async requestOtp(inputObject: any, ctx: Context) {
    const phone = await Phone.findOne({ phone: inputObject.email });

    if (phone) {
      console.log("oh its a phone number?");

    } else {
      let user = await Users.findOne({
        $or: [{ email: inputObject.email }, { username: inputObject.email }],
      });

      if (user) {
        let otp_generate = otpGenerator.generate(6, {
          lowerCaseAlphabets: false,
          upperCaseAlphabets: false,
          specialChars: false,
          digits: true,
        });

        user.otp = otp_generate;
        user.otpTime = new Date();
        user.save();

        const message = `${otp_generate} is your One Time Password (OTP) for logging into account.`;

        return {
          otpResponse: {
            message: message,
            code: errors.OTP_SENT_PHONE
          }
        }
      } else {
        return {
          error: {
            message: "Oops! we are unable to assosiate any account with this Email/Username/Phone.",
            code: errors.INVALID_CREDENTIALS
          },
          user: null,
        }
      }


    }

  }

  async authenticateUser(args: any, ctx: Context) {
    let user = await Users.findOne({
      $or: [{ email: args.email }, { username: args.email }],
    }).populate('phone', 'phone primary');

    if (user) {
      const authenticate = await user.authenticate(args.password);
      if (authenticate) {
        // @ts-ignore
        return { user: { ...authenticate._doc, accessToken: user.generateToken() } };
      } else {
        return {
          error: {
            message: "Invalid Credentials.",
            code: errors.INVALID_CREDENTIALS
          },
          user: null,
        }
      }
    } else {
      return {
        error: {
          message: "Oops! we are unable to assosiate any account with this Email/Username.",
          code: errors.INVALID_CREDENTIALS
        },
        user: null,
      }
    }
  }
}
