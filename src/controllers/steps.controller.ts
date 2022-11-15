import mongoose = require('mongoose');
import { Context } from '../models/context';
import { CompleteStatusType, StatusType, UserType } from '../utils/types';

const Status: mongoose.Model<StatusType> = require('../models/status');
const User: mongoose.Model<UserType> = require('../models/users');


export class StepsController {
    async completeStep(args: { input: CompleteStatusType }, ctx: Context) {
        const { input } = args;
        console.log("came to process step", input);

        switch (input.step) {
            case 1:

                break;
        }

    }
}