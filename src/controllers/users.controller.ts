import { ApolloError } from 'apollo-server-express';
import { Error, Model } from 'mongoose';
import { errors } from '../errors';
import { Context } from '../models/context';
import Joi from 'Joi'
// @ts-ignore
import otpGenerator from 'otp-generator'
// var otpGenerator = require("otp-generator");
import { VerifyAuthorization } from '../decorators/auth.decorator';

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

  hasNumber(myString: string) {
    return /\d/.test(myString);
  }

  @VerifyAuthorization
  resetPassword(inputObject: any, ctx: Context) {
    console.log("yes can reset password", inputObject, ctx);

    return {

    } as any;
  }

  async verifyOtp(inputObject: any, ctx: Context) {
    const user = await Users.findOne({ email: inputObject.email });
    if (user) {
      var date: Date = new Date();
      var date_otp: Date = new Date(user.otpTime);
      var FIVE_MIN = 15 * 60 * 1000;

      // @ts-ignore
      if (date - date_otp > FIVE_MIN) {
        return {
          error: {
            message: "Oops! lookslike otp is incorrect or expired.",
            code: errors.OTP_EXPIRED
          },
          user: null,
        }
      } else {
        if (parseInt(inputObject.otp) === parseInt(user.otp)) {
          return {
            otpResponse: {
              accessToken: user.generateToken()
            }
          }
        } else {
          return {
            error: {
              message: "Oops! lookslike otp is incorrect or expired.",
              code: errors.OTP_EXPIRED
            },
            user: null,
          }
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

  async requestOtp(inputObject: any, ctx: Context) {
    const phone = this.hasNumber(inputObject.email) ? await Phone.findOne({ phone: inputObject.email }) : false;
    let user;
    if (phone) {
      user = await Users.findOne({ _id: phone.user });
    } else {
      user = await Users.findOne({
        $or: [{ email: inputObject.email }, { username: inputObject.email }],
      });
    }

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

      const message = `${otp_generate} is your One Time Password (OTP) for logging into account. (otp visible for development purposes)`;

      return {
        otpResponse: {
          message: message,
          code: errors.OTP_SENT_PHONE,
          name: user.name,
          email: user.email
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
