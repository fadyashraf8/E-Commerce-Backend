

import express from "express"
import { createSubCategory, deleteSubCategory, getAllSubCategories, getSubCategory, updateSubCategory } from "./subCategory.controller.js"
import { validation } from './../../middleware/validation.js';
import { createSubCategorySchema, deleteSubCategorySchema, getSubCategorySchema, updateSubCategorySchema } from "./subCategory.validation.js";

const subCategoryRouter=express.Router({mergeParams:true})

subCategoryRouter
.route('/')
.post(validation(createSubCategorySchema),createSubCategory)
.get(getAllSubCategories)

subCategoryRouter
.route("/:id")
.get(validation(getSubCategorySchema),getSubCategory)
.put(validation(updateSubCategorySchema),updateSubCategory)
.delete(validation(deleteSubCategorySchema),deleteSubCategory)




export default subCategoryRouter