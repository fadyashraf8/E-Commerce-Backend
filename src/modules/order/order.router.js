
import express from 'express';
import * as order from '../order/order.controller.js'


import { allowedTo, protectedRoutes } from '../auth/auth.controller.js';
import { validation } from './../../middleware/validation.js';
import { createCashOrderSchema, inputSchema } from './order.validation.js';


const orderRouter = express.Router()

orderRouter
    .route('/')
    .get(protectedRoutes, allowedTo('user'), order.getUserOrder)
   
    orderRouter
    .route('/getAllOrders')
    .get(protectedRoutes, allowedTo('admin','user'), order.getAllOrder)

orderRouter
    .route('/:id')
    .post(protectedRoutes, allowedTo('admin', 'user'),validation(inputSchema) ,order.createCashOrder)

    orderRouter.route('/checkout/:id').post(protectedRoutes, allowedTo('admin', 'user'),validation(inputSchema) ,order.createVisaOrder)


export default orderRouter

