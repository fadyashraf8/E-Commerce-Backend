


import Joi from "joi";

export const createCashOrderSchema=Joi.object({
    city:Joi.string().min(2).max(20).required(),
    street:Joi.string().min(2).max(20).required(),
    phone:Joi.number().required(),
})

export const inputSchema = Joi.object({
    id:Joi.string().hex().length(24).required(),

    shippingAddress: createCashOrderSchema.required(),
  });



