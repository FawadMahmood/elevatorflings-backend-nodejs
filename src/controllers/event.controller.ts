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
        const {input} = args;

        let conditions: any[] = [
           
        ];

        input.filters?.map((_,i)=>{
            conditions.push({
                [_.key]:_.value
            });
        });

        if(input.after){
            conditions.push({
                _id: { $gt: new mongoose.Types.ObjectId(input.after) }
            });
        }

        if(input.location){
            if(input.sortBy && input.sortBy.includes('location')){
                
                conditions.push(
                    {
                        location: {
                            $near:
                            {
                                $geometry: {
                                    type:'Point',
                                    coordinates:[input.location?.longitude,input.location?.latitude]
                                },
                                $minDistance: 0,
                                $maxDistance:900000000
                            }
                        }
                    },
                );
            }else{
                conditions.push(
                    {
                        location: {
                            $near:
                            {
                                $geometry: {
                                    type:'Point',
                                    coordinates:[input.location?.longitude,input.location?.latitude]
                                },
                                $minDistance: 0,
                                $maxDistance:500
                            }
                        }
                    },
                );
            }
            
        }


        if(input.cursor){
            conditions.push({
                _id: { $gt: new mongoose.Types.ObjectId(input.cursor) }
            });
        }


        if(input.userId){
            conditions.push({
                createdBy:input.userId
            });
        }
      

        let applied_filters = {
            $and: [
                ...conditions,
            ]
        };
        
        let query = Event.find(applied_filters).populate('interests').populate('participants','_id name photoUrl').populate('state').populate('country').populate('createdBy'); //.catch(error=> console.log("error occured", error));
        
        if(input.limit){
            query = query.limit(input.limit);
        }

        if(input.skip){
            query = query.skip(input.skip);
        }
        
        const events =await  query.exec().catch(err=>console.log("error occured", err)); 

        console.log("user got event", events);
        
        return {
            events: events
        } as any;

    }

}