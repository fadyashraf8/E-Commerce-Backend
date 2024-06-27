import { createCategorySchema } from "../modules/category/category.validation.js"


export const validation = (schema) => {
    return (req, res, next) => {
        let inputs = { ...req.body, ...req.params, ...req.query }
        let { error } = schema.validate(inputs, { abortEarly: false })
        if (error) {
            let errors = error.details.map(e => e.message)
            res.json(errors)
        } else {
            next()
        }

    }

}