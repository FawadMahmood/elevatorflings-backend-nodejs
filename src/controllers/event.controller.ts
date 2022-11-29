import mongoose = require('mongoose');
import { VerifyAuthorization } from '../decorators/auth.decorator';
import { Context } from '../models/context';
import {  EventType,EventTypeInput } from '../utils/types';


const Event: mongoose.Model<EventType> = require('../models/event');


export class EventController {
    @VerifyAuthorization
    async addEvent(args: { input: EventTypeInput }, ctx: Context) {
        const { input } = args;
        const event = new Event({...input,createdBy:ctx._id});
        await event.save();
        return {
            success: true,
            resource_id:event._id,
        } as any
    }


    // @VerifyAuthorization
    async getEventInfo(args: { id:string }, ctx: Context) {
        console.log("event found",args );
        const event = await Event.findOne({_id:args.id}).populate('interests').populate('state').populate('country').populate('createdBy');
        console.log("event found", event);
        
        if(event){
            return{
                event
            } as any;
        }else{
            return {
                error: {
                    code: "NO_EVENT_FOUND",
                    message: "Unable to find event."
                },
                success: false
            } as any
        }


    }
}