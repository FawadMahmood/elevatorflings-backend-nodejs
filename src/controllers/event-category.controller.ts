import { Context } from '../models/context';
import { VerifyAuthorization } from '../decorators/auth.decorator';
import { Model, ObjectId } from 'mongoose';

const EventCategory: Model<any> = require('../models/event-category');



const interests = [
    "Night Life",
    "Halloween",
    "Eat Street",
    "Exhibition",
    "Education",
    "Programming",
    "Comedy",
]

export class EventCategoryController {
    @VerifyAuthorization
    async getCategories(args: any, ctx: Context) {
        const interests = await EventCategory.find();
        return {
            categories: interests,
            error: null
        } as any
    }


    // @VerifyAuthorization
    async addCategoryAdmin(args: { input: { input: string; imageUrl: string; addedBy: string; } }, ctx: Context) {
        const { input } = args;
        const interest = new EventCategory(input);
        await interest.save();

        return {
            error: null,
            success: true,
        } as any
    }
}