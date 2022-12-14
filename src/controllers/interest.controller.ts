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


    // @VerifyAuthorization
    async addInterestAdmin(args: { input: { input: string; imageUrl: string; addedBy: string; } }, ctx: Context) {
        const { input } = args;
        const interest = new Interests(input);
        await interest.save();

        return {
            error: null,
            success: true,
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
                    step: 4
                }
            }).then(response => {
            });
        }


        return {
            error: null,
            success: true,
        } as any
    }
}