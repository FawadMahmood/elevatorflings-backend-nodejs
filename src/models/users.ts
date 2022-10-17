import mongoose = require("mongoose");


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
  },
  {
    timestamps: true,
  }
);



module.exports = mongoose.model('User', UserSchema);
