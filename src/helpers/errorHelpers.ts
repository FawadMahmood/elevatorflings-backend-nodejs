import { errors } from "../errors"

type method = "authenticateUser";
type status = "INVALID" | "ERROR";


type ErrorType = {
    [key in method]: {
        [key in status]:{
           error:{
                message:string;
                code:string;
           }
        }
    };
};

const _errors:ErrorType={
    authenticateUser:{
        "INVALID":{
            error:{
                message:"Invalid Credentials.",
                code:errors.INVALID_CREDENTIALS
            }
        },
        "ERROR":{
            error:{
                message:"Oops! we are unable to assosiate any account with this Email/Username.",
                code:errors.INVALID_CREDENTIALS
            }
        }
    }
}


export const resolveError=(method:method,status:status,key:string)=>{
    return {..._errors[method][status],[key]:null};
}