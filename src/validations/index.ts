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
    dob: Joi.date().required(),
    gender: Joi.string().valid('MALE', 'FEMALE', 'TRANS', 'NONE').required(),
});


const resetPassword = Joi.object({
    password: Joi.string().min(8).required(),
    confirm_password: Joi.string().required().valid(Joi.ref('password')),
})


export const validations = {
    "addUser": addUserValidationScheema as Joi.ObjectSchema<any>,
    "resetPassword": resetPassword as Joi.ObjectSchema<any>,
}