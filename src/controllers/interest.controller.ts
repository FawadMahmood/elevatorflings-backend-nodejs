import { Context } from '../models/context';
import { VerifyAuthorization } from '../decorators/auth.decorator';
import { Model, ObjectId } from 'mongoose';

const Interests: Model<any> = require('../models/interests');


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
}