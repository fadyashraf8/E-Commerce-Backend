
import express from 'express'
import { createCategory, deleteCategory, getAllCategories, getCategory, updateCategory } from './category.controller.js'
import subCategoryRouter from '../subCategory/subCategory.router.js'
import { validation } from '../../middleware/validation.js'
import { createCategorySchema, deleteCategorySchema, getCategorySchema, updateCategorySchema } from './category.validation.js'
import { uploadSingleFile } from '../../middleware/fileUpload.js'
import { allowedTo, protectedRoutes } from './../auth/auth.controller.js';

const categoryRouter=express.Router()

categoryRouter.use('/:categoryId/subCategories',subCategoryRouter)

categoryRouter
.route('/')
.post(protectedRoutes, allowedTo('admin','user'),uploadSingleFile("image","category"),validation(createCategorySchema),createCategory)
.get(protectedRoutes, allowedTo('admin','user'),getAllCategories)

categoryRouter
.route('/:id')
.get(protectedRoutes, allowedTo('admin','user'),validation(getCategorySchema),getCategory)
.put(protectedRoutes, allowedTo('admin','user'),uploadSingleFile("image","category"),validation(updateCategorySchema),updateCategory)
.delete(protectedRoutes, allowedTo('admin','user'),validation(deleteCategorySchema),deleteCategory)


export default categoryRouter   