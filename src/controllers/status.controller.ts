import mongoose = require('mongoose');
import { Context } from '../models/context';
import { StatusType, UserType } from '../utils/types';

const Status: mongoose.Model<StatusType> = require('../models/status');

export class StatusController {
    async addStatus(args: { status: StatusType }, ctx: Context) {
        const status = new Status(args.status);
        status.save();
        return {
            success: true
        }
    }

    async getStatuses(args: any, ctx: Context) {
        const statuses = await Status.find();

        return {
            statuses,
        }
    }
}