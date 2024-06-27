
import  express  from 'express';
import * as product  from './product.controller.js';
import { allowedTo, protectedRoutes } from '../auth/auth.controller.js';
import { validation } from './../../middleware/validation.js';
import { createProductSchema } from './product.validation.js';
import { uploadMultipleFile } from '../../middleware/fileUpload.js';

const productRouter=express.Router()
let filedsArray=[{ name: 'imgCover', maxCount: 1 }, { name: 'images', maxCount: 10 }]

productRouter
.route('/')
.post(protectedRoutes,allowedTo('admin','user'),uploadMultipleFile(filedsArray,"product"),validation(createProductSchema),product.createProduct)
.get(product.getAllProducts)


productRouter
.route("/:id")
.get(product.getProduct)
.put(protectedRoutes,allowedTo('admin'),product.updateProduct)
.delete(protectedRoutes,allowedTo('admin'),product.deleteProduct)



export default productRouter
