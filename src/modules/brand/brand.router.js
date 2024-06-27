
import  express  from 'express';
import { createBrand, deleteBrand, getAllBrands, getBrand, updateBrand } from './brand.controller.js';
import { validation } from './../../middleware/validation.js';
import { createBrandSchema, deleteBrandSchema, getBrandSchema, updateBrandSchema } from './brand.validation.js';
import { uploadSingleFile } from '../../middleware/fileUpload.js';
import { allowedTo, protectedRoutes } from '../auth/auth.controller.js';


const brandRouter=express.Router()

brandRouter
.route('/')
.post(protectedRoutes,allowedTo('admin'),uploadSingleFile('logo','brand'),validation(createBrandSchema),createBrand)
.get(getAllBrands)

brandRouter
.route('/:id')
.get(validation(getBrandSchema),getBrand)
.put(protectedRoutes,allowedTo('admin'),validation(updateBrandSchema),updateBrand)
.delete(protectedRoutes,allowedTo('admin'),validation(deleteBrandSchema),deleteBrand)


export default brandRouter

