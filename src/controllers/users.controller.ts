import { ApolloError } from 'apollo-server-express';
import { Error, Model } from 'mongoose';
import { errors } from '../errors';
import { Context } from '../models/context';
// @ts-ignore
import otpGenerator from 'otp-generator'
import { VerifyAuthorization } from '../decorators/auth.decorator';
import { ValidateUserInput } from '../decorators/validation.decorator';
import { CountryType, StateType } from '../utils/types';
import { resolveError } from '../helpers/errorHelpers';


const Users: Model<any> = require('../models/users');
const Phone: Model<any> = require('../models/phone');
const State: Model<StateType> = require('../models/state');
const Country: Model<CountryType> = require('../models/country');
const ImageMod: Model<CountryType> = require('../models/image');



export class UsersController {
  @ValidateUserInput
  async addUser(inputObject: any, ctx: Context) {
    try {
      const { phone, ...input } = inputObject.input;
      const state = await State.findById(input.state);
      const country = await Country.findById(state?.country_id);

      const image = input.gender === "MALE" ? 'https://avatarairlines.com/wp-content/uploads/2020/05/Male-placeholder.jpeg':"https://www.csncare.co.uk/wp-content/uploads/2020/05/Team-Member-FeMale-Placeholder.jpg"

      const userInfo = new Users({ ...input, email: input.email.toLowerCase(),username:input.username.toLowerCase(),country: state?.country_id,photoUrl:image, });
      const _phone = new Phone({ phone: phone, primary: true, user: userInfo._id });
      userInfo.phone = _phone._id;
      const promises = await Promise.all([await userInfo.save(), _phone.save()]).then(() => console.log("adding user success"));
      return { user: { ...userInfo._doc, state, country, phone: _phone, accessToken: userInfo.generateToken() }, error: null } as any;
    } catch (error) {
      console.log("error has been occured", error);

      return {
        error: {
          message: "User with same email already exist.",
          code: errors.EMAIL_ALREADY_EXISTS
        },
        user: null,
      } as any;
    }
  }


  @ValidateUserInput
  async getUser(inputObject: {userId:string}, ctx: Context) {
    const profileInfo =await Promise.all([await Users.findById(inputObject.userId).populate('phone', '_id primary phone').populate('state').populate('country').populate('interests'),await ImageMod.find({user:inputObject.userId})])
    return { user: {...profileInfo[0]._doc,photos:profileInfo[1]} } as any;
  }

  async updateUser(inputObject: any, ctx: Context) {
    const userInfo = await Users.findOneAndUpdate({ _id: inputObject.id }, inputObject.input, { new: true });
    return userInfo;
  }

  @VerifyAuthorization
  async me(inputObject: any, ctx: Context) {
    let userInfo = await Users.findById(ctx._id).populate('phone', '_id primary phone').populate('state').populate('country');
    
    return { user:userInfo } as any;
  }

  @VerifyAuthorization
  async setLocation(inputObject: any, ctx: Context) {
    const input = inputObject.input;

    let userInfo;

    if (input.country) {
      userInfo = await Users.findOneAndUpdate({ _id: ctx._id }, {
        $set: {
          location: input.location,
          // country: input.country,
          // city: input.city,
        }
      });
    } else {
      userInfo = await Users.findOneAndUpdate({ _id: ctx._id }, {
        $set: {
          location: input.location,
        }
      });
    }

    if (!userInfo.completed && userInfo.step === 1) {
      Users.findOneAndUpdate({ _id: ctx._id }, {
        $set: {
          step: 3,
        }
      }).then(response => {
        console.log("step updated.");
      });

      ctx.queue.add({ _id: ctx._id as string, new: true });
    } else {
      ctx.queue.add({ _id: ctx._id as string, new: false });
    }

    return {
      error: null,
      success: true,
    } as any
  }

  hasNumber(myString: string) {
    return /\d/.test(myString);
  }

  @VerifyAuthorization
  @ValidateUserInput
  async resetPassword(inputObject: any, ctx: Context) {
    const input = inputObject.input;
    let user = await Users.findById(ctx._id);
    if (input.password === input.confirm_password) {
      user.password = input.password;
      await user.save();
      user.populate('phone', 'phone primary');
      return { user: { ...user._doc, accessToken: user.generateToken() } } as any;
    } else {
      return {
        error: {
          message: "Oops! password and confirm password does not match.",
          code: errors.PASSWORD_MISMATCH
        },
        user: null,
      } as any
    }
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
      $or: [{ email: args.email.toLocaleLowerCase() }, { username: args.email.toLocaleLowerCase() }],
    }).populate('phone', 'phone primary').populate('state').populate('country');

    if (user) {
      return await user.authenticate(args.password).then((user:any)=>{
          if(user) return { user: { ...user._doc, accessToken: user.generateToken() } };
          else return resolveError("authenticateUser","INVALID",'user');
      });
    }else{
      console.log(resolveError("authenticateUser","ERROR",'user'));
      
      return resolveError("authenticateUser","ERROR",'user');
    }
  }
}
