


import Joi from "joi";

export const createProductSchema=Joi.object({
    title:Joi.string().min(2).max(20).required(),
    price:Joi.number().required(),
    ratingAvg:Joi.number().required(),
    ratingCount:Joi.number().required(),
    description:Joi.string().min(2).max(100).required(),
    quantity:Joi.number().required(),
    priceAfterDiscount:Joi.number(),
    sold:Joi.number(),
    category:Joi.string().hex().length(24).required(),
    subCategory:Joi.string().hex().length(24).required(),
    brand:Joi.string().hex().length(24).required(),
})




