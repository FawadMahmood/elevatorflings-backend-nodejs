import { Context } from '../models/context';
import { VerifyAuthorization } from '../decorators/auth.decorator';
import { Model, ObjectId } from 'mongoose';

const Interests: Model<any> = require('../models/interests');
const Users: Model<any> = require('../models/users');


const interests = [
    "Night Life",
    "Halloween",
    "Eat Street",
    "Exhibition",
    "Education",
    "Programming",
    "Comedy",
]

export class InterestsController {
    @VerifyAuthorization
    async getInterests(args: any, ctx: Context) {
        const interests = await Interests.find();
        return {
            interests: interests,
            error: null
        } as any
    }


    @VerifyAuthorization
    async setInterests(inputObject: any, ctx: Context) {
        const input = inputObject;

        const user = await Users.findOneAndUpdate({ _id: ctx._id }, {
            $set: {
                interests: input.interests
            }
        });

        ctx.update.add({ _id: ctx._id as string, key: 'interests', value: input.interests });
        if (!user.completed) {
            Users.findOneAndUpdate({ _id: ctx._id }, {
                $set: {
                    step: 3
                }
            }).then(response => {
                console.log("completed updated.");
            });
        }


        return {
            error: null,
            success: true,
        } as any
    }
}