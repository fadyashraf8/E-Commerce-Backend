


import Joi from "joi";

export const createReviewSchema=Joi.object({
    comment:Joi.string().min(2).max(500).required(),
    ratings:Joi.number().required(),
    product:Joi.string().hex().length(24).required(),
   
})




