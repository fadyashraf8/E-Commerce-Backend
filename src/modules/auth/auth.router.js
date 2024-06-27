


import express from 'express';
import { signin, signup } from './auth.controller.js';
import { validation } from './../../middleware/validation.js';
import { signInSchema, signUpSchema } from './auth.validation.js';



const authRouter = express.Router()

authRouter.post('/signup', validation(signUpSchema), signup)
authRouter.post('/signin', validation(signInSchema), signin)





export default authRouter

