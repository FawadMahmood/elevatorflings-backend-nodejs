import mongoose = require("mongoose");

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
      type: String,
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
      type: "Point",
      coordinates: [Number, Number]
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
