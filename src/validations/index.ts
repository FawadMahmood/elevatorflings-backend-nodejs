import Joi from 'Joi'

const locationValidation = Joi.object({
    type: Joi.string().valid('Point'),
    coordinates: Joi.array(),
});

const addUserValidationScheema = Joi.object({
    email: Joi.string().email().required(),
    username: Joi.string().min(3).required(),
    password: Joi.string().min(8).required(),
    name: Joi.string().min(3).required(),
    provider: Joi.string().valid('self', 'facebook', 'google', 'apple').required(),
    location: locationValidation,
    phone: Joi.string().required(),
    age: Joi.number().min(18).required(),
});


export const validations = {
    "addUser": addUserValidationScheema as Joi.ObjectSchema<any>
}