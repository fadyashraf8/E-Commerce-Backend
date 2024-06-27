


import Joi from "joi";

export const createCouponSchema=Joi.object({
    code:Joi.string().min(2).max(20).required(),
    discount:Joi.string().min(2).max(20).required(),
    expires:Joi.date().required(),

})


export const updateCouponSchema=Joi.object({
    id:Joi.string().hex().length(24).required(),

    code:Joi.string().min(2).max(20).required(),
    discount:Joi.string().min(2).max(20).required(),
    expires:Joi.date().required(),

})
export const deleteCouponSchema=Joi.object({
    id:Joi.string().hex().length(24).required(),
})

