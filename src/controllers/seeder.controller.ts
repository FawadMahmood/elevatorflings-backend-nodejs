import mongoose = require('mongoose');
import { Context } from '../models/context';
import { CountryType, StateType, CityType } from '../utils/types';
import axios from 'axios';


const Country: mongoose.Model<CountryType> = require('../models/country');
const State: mongoose.Model<StateType> = require('../models/state');
const City: mongoose.Model<CityType> = require('../models/city');



export class SeederController {

    TokenData = async (country:string) => {
        const data1 = await axios.get(`https://www.universal-tutorial.com/api/getaccesstoken`, {
            headers: {
                "Accept": "application/json",
                "api-token": `${country}`,
                "user-email": "zaeem.zafar@binatedigital.com"
            }
        });
        const response = await data1.data;
        return response;
    }

     sleep(ms:number) {
        return new Promise(resolve => setTimeout(resolve, ms));
     }


    async generateCountryData(args:any, ctx: Context) {

        try{
            const access_token = 'HKRUQbh-ZAJw5gB6TGD9hhqBfjvfna2S5xgQRd25BB54j8lCYLIw0X7pWMbvU4M-3_0';
            const token = await this.TokenData(access_token);
         
            
            const bearer = token?.auth_token;
            const fetch_country = await axios.get(`https://www.universal-tutorial.com/api/countries/`, {
                headers: {
                    "Accept": "application/json",
                    "Authorization": "Bearer " + `${bearer}`
                }
            })
        
            const countries:any[] = await fetch_country.data;
    
            for(let i=0;i<countries.length;i++){
                const con = countries[i];
    
                const _cc = new Country({
                    name:con.country_name,
                    short_name:con.country_short_name ||"",
                    phone_code:con.country_phone_code ||"",
                    enable:false,
                });
    
                await _cc.save();
    
                // console.log("country got",con);
    
                const fetch_state = await axios.get(`https://www.universal-tutorial.com/api/states/${con.country_name}`, {
                    headers: {
                        "Accept": "application/json",
                        "Authorization": "Bearer " + `${bearer}`
                    }
                }).catch(err=>{
                    console.log("err at state",err);
                    
                });

                if(fetch_state?.data){
                    for(let p=0;p<fetch_state.data.length;p++){
                        const state = fetch_state.data[p];
                        
                        const _s = new State({
                            name:state.state_name ? state.state_name : "",
                            country_id:_cc._id
                        });
    
                        await _s.save();
    
                        const fetch_city = await axios.get(`https://www.universal-tutorial.com/api/cities/${state.state_name}`, {
                            headers: {
                                "Accept": "application/json",
                                "Authorization": "Bearer " + `${bearer}`
                            }
                        }).catch(err=>{
                            console.log("err at city",err);
                            
                        });;
                        
                        if(fetch_city?.data){
                            const cities:any[] = fetch_city.data;
    
    
                            for(let w=0;w<cities.length;w++){
                                const _cc = cities[w];
                                const ci = new City({
                                    name:_cc.city_name ? _cc.city_name  : "",
                                    state_id:_s._id,
                                });
        
                                await ci.save();
                                // console.log("sumped city" ,ci);
        
                            }
        
                            console.log("all cities dmped for" ,_s.name,_cc.name);
                            
                        }
                       
    
                        // await this.sleep(2000);
                }
    
                }
    
        
            }
    
        }catch(error){
            console.log("error has been occured", error);
            
        }
  
        return {
            success:true
        }
        
    }
}