import mongoose = require("mongoose");

const StateScheema = new mongoose.Schema(
    {
        name: {
            type: String,
        },
        country_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Country',
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('State', StateScheema);
