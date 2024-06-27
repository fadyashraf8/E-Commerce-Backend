
import  express  from 'express';
import * as coupon from '../coupon/coupon.controller.js'


import { allowedTo, protectedRoutes } from '../auth/auth.controller.js';
import { validation } from './../../middleware/validation.js';
import { createCouponSchema, deleteCouponSchema, updateCouponSchema } from './coupon.validation.js';


const couponRouter=express.Router()

couponRouter
.route('/')
.post(protectedRoutes,allowedTo('user'),validation(createCouponSchema),coupon.createCoupon)
.get(coupon.getAllCoupons)

couponRouter
.route('/:id')
.get(coupon.getCoupon)
.put(protectedRoutes,allowedTo('user'),validation(updateCouponSchema),coupon.updateCoupon)
.delete(protectedRoutes,allowedTo('admin','user'),validation(deleteCouponSchema),coupon.deleteCoupon)


export default couponRouter

