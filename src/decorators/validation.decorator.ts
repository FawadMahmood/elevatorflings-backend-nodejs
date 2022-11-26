import { ApolloError } from "apollo-server-express";
import { validations } from "../validations";
import Joi from 'joi'
import { ErrorConstants } from "../constants/errors.constants";


export function ValidateUserInput(_target: any,
    _propertyKey: string,
    descriptor: TypedPropertyDescriptor<(...args: any[]) => Promise<void>>) {


    const fn = descriptor.value!;
    descriptor.value = async function DescriptorValue(...args: any[]) {
        try {
            // @ts-ignore
            const scheema = validations[_propertyKey] ? validations[_propertyKey] as unknown as Joi.ObjectSchema<any> : Joi.object();
            const input = args[0].input ? args[0].input : args[0];
            const validate = scheema.validate(input);
            if (validate.error) {
                return {
                    error: {
                        message: validate.error.message,
                        code: ErrorConstants.INCORRECT_INPUT
                    },
                } as any
                // throw new ApolloError(validate.error.message, ErrorConstants.INCORRECT_INPUT);
            } else {
                return await fn.apply(this, args);
            }
        } catch (error) {
            throw new ApolloError(error as unknown as string);
        }
    };
    return descriptor;
}