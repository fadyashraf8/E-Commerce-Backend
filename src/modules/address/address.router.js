
import  express  from 'express';
import * as address from '../address/address.controller.js'


import { allowedTo, protectedRoutes } from '../auth/auth.controller.js';
import { validation } from './../../middleware/validation.js';
import { addToAddressSchema, removeFromAddressSchema } from './address.validation.js';


const addressRouter=express.Router()

addressRouter
.route('/')
.patch(protectedRoutes,allowedTo('user'),validation(addToAddressSchema),address.addToAddress)
.delete(protectedRoutes,allowedTo('user'),validation(removeFromAddressSchema),address.removeFromAddress)
.get(protectedRoutes,allowedTo('user'),address.getUserAddress)





export default addressRouter

