
import  express  from 'express';
import * as review from '../review/review.controller.js'


import { allowedTo, protectedRoutes } from '../auth/auth.controller.js';
import { validation } from './../../middleware/validation.js';
import { createReviewSchema } from './review.validation.js';


const reviewRouter=express.Router()

reviewRouter
.route('/')
.post(protectedRoutes,allowedTo('user'),validation(createReviewSchema),review.createReview)
.get(review.getAllReviews)

reviewRouter
.route('/:id')
.get(review.getReview)
.put(protectedRoutes,allowedTo('user'),review.updateReview)
.delete(protectedRoutes,allowedTo('admin','user'),review.deleteReview)


export default reviewRouter

