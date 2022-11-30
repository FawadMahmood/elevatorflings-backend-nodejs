import mongoose = require('mongoose');
import { VerifyAuthorization } from '../decorators/auth.decorator';
import { Context } from '../models/context';
import {  EventType,EventTypeInput, GetEventsVariables } from '../utils/types';


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


    @VerifyAuthorization
    async getEventInfo(args: { id:string }, ctx: Context) {
        const event = await Event.findOne({_id:args.id}).populate('interests').populate('state').populate('country').populate('createdBy');
        
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

    @VerifyAuthorization
    async getEvents(args:{input:GetEventsVariables}, ctx: Context){
        console.log("events asked", args);
        
        const {input} = args;

        let conditions: any[] = [
            {
                location: {
                    $near:
                    {
                        $geometry: {
                            type:'Point',
                            coordinates:[input.location.longitude,input.location.latitude]
                        },
                        $minDistance: 0,
                        $maxDistance:500
                    }
                }
            },
            {
                available:true
            },
        ];

        let applied_filters = {
            $and: [
                ...conditions,
            ]
        };

        const events = await Event.find(applied_filters).populate('interests').populate('state').populate('country').populate('createdBy');
        console.log("events rec", events);
        

        return {
            events: events
        } as any;

    }

}