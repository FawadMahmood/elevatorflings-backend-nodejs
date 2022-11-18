import mongoose = require('mongoose');
import { Context } from '../models/context';
import { StateType, CountryType, UserType } from '../utils/types';

const State: mongoose.Model<StateType> = require('../models/state');
const Country: mongoose.Model<CountryType> = require('../models/country');


export class LocalizationController {
    async getStatesByCountryCode(args: { countryCode: string }, ctx: Context) {
        console.log("getStatesByCountryCode", args);

        const country = await Country.findOne({ short_name: args.countryCode });
        const states = await State.find({ country_id: country?._id });

        return {
            success: true,
            states: states,
        } as any;
    }
}