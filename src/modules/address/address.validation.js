


import Joi from "joi";

export const addToAddressSchema=Joi.object({
    city:Joi.string().min(2).max(20).required(),
    street:Joi.string().min(2).max(20).required(),
    phone:Joi.number().required(),

})


export const removeFromAddressSchema=Joi.object({
    address:Joi.string().hex().length(24).required()
})

