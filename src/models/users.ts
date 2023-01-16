const dotenv = require('dotenv');
dotenv.config();
import mongoose = require("mongoose");
import bcrypt from 'bcrypt';
const saltRounds = 10;
import * as jwt from 'jsonwebtoken';


const pointSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['Point'],
    required: true
  },
  coordinates: {
    type: [Number],
    required: true
  }
});

const UserSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true
    },
    photoUrl: {
      type: String,
      default: "https://loremflickr.com/500/500/boy,girl/all"
    },
    gender: {
      type: String,
    },
    phone: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Phone',
    },
    age: {
      type: Number,
    },
    facebookId: {
      type: String,
    },
    googleId: {
      type: String,
    },
    appleId: {
      type: String,
    },
    location: {
      type: pointSchema,
    },
    provider: {
      type: String,
      required: true
    },
    password: {
      type: String,
      required: true,
    },
    lastLogin: {
      type: Date
    },
    otp: {
      type: Number,
    },
    otpTime: {
      type: Date,
    },
    interests: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Interest' }],
    completed: {
      type: Boolean,
      default: false,
    },
    initialCompletion: {
      type: Boolean,
      default: false,
    },
    step: {
      type: Number,
      default: 1,
    },
    dob: {
      type: Date,
      required: true
    },
    address: {
      type: String
    },
    status: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Status',
    }],
    looking: [{
      type: String,
    }],
    state: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'State',
    },
    country: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Country',
    },
    buildingId:{
      type: String
    }
  },
  {
    timestamps: true,
  }
);

UserSchema.methods = {
  async authenticate(password) {
    const valid = await bcrypt // @ts-ignore
      .compare(password, this.password);
    return (valid ? this : false);
  },

  generateToken() {
    // @ts-ignore
    return jwt.sign({ email: this.email, _id: this._id }, process.env.JWT_SECRET, {
      expiresIn: "24h", // expires in 24 hours
    });
  },
}

UserSchema.pre('save', function (next) {
  if (!this.isModified('password')) {
    return next();
  }

  bcrypt.genSalt(saltRounds, (err, salt) => {
    if (err) {
      return next(err);
    }
    // @ts-ignore
    bcrypt.hash(this.password, salt, (err, hash) => {
      if (err) {
        return next(err);
      }
      // @ts-ignore
      this.password = hash;
      next();
    });
  });


});

UserSchema.index({location:'2dsphere'});

module.exports = mongoose.model('User', UserSchema);
