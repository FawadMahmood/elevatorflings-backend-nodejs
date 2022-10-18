import mongoose = require("mongoose");
import bcrypt from 'bcrypt';

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
      unique: true,
    },
    googleId: {
      type: String,
      unique: true,
    },
    appleId: {
      type: String,
      unique: true,
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
    }
  },
  {
    timestamps: true,
  }
);

UserSchema.pre('save', function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  bcrypt.genSalt((err, salt) => {
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

module.exports = mongoose.model('User', UserSchema);
