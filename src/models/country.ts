import mongoose = require("mongoose");

const CountryScheema = new mongoose.Schema(
    {
        name: {
            type: String,
        },
        phone_code:{
            type:Number,
        },
        short_name:{
            type: String,
        },
        enable:{
            type:Boolean,
            default:false,
        }
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('Country', CountryScheema);
