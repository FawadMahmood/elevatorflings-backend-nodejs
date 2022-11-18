import mongoose = require("mongoose");

const CityScheema = new mongoose.Schema(
    {
        name: {
            type: String,
        },
        state_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Country',
          },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('City', CityScheema);
