import mongoose = require("mongoose");

const MatchScheema = new mongoose.Schema(
    {
        participants:[{type:mongoose.Schema.Types.ObjectId,ref:"User"}],
    },
    {
        timestamps: true,
    }
);


MatchScheema.index({participants:1})

module.exports = mongoose.model('Match', MatchScheema);
