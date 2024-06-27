
import express from 'express';
import * as cart from '../cart/cart.controller.js'


import { allowedTo, protectedRoutes } from '../auth/auth.controller.js';
import { validation } from './../../middleware/validation.js';
import { addToCartSchema, updateCartSchema } from './cart.validation.js';


const cartRouter = express.Router()

cartRouter
    .route('/')
    .post(protectedRoutes, allowedTo('user'), validation(addToCartSchema),cart.addToCart)
    .get(protectedRoutes, allowedTo('user'), cart.getLoggedUsercart)


    cartRouter.post('/applyCoupon', protectedRoutes, allowedTo('user'), cart.applyCoupon)


cartRouter
    .route('/:id')
    .delete(protectedRoutes, allowedTo('admin', 'user'), cart.removeFromCart)
    .put(protectedRoutes, allowedTo('admin', 'user'), validation(updateCartSchema),cart.updateQuantity)


export default cartRouter

