import mongoose = require('mongoose');
import { VerifyAuthorization } from '../decorators/auth.decorator';
import { Context } from '../models/context';
import { CompleteStatusType, StatusType, UserType } from '../utils/types';

const Status: mongoose.Model<StatusType> = require('../models/status');
const Image: mongoose.Model<StatusType> = require('../models/image');

const User: mongoose.Model<UserType> = require('../models/users');


export class StepsController {
    @VerifyAuthorization
    async completeStep(args: { input: CompleteStatusType }, ctx: Context) {
        const { input } = args;
        console.log("came to process step", input);

        switch (input.step) {
            case 1:
                let primateImage: any;
                input.images.map((_, i) => {
                    const image = new Image({ ..._, user: ctx._id });
                    image.save();
                    if (_.primary) {
                        primateImage = image;
                    }
                });

                User.findOneAndUpdate({ _id: ctx._id }, {
                    $set: {
                        photoUrl: primateImage.imageUrl,
                        status: input.status,
                        step: 2,
                    }
                }).then(response => {
                    console.log("image default updated, user status updated, step no updated.");
                });

                return {
                    success: true,
                } as any
                break;
            default:
                return {
                    error: {
                        code: "UNKNOWN STEP",
                        message: "Step # is required"
                    },
                    success: false
                } as any
        }

    }
}