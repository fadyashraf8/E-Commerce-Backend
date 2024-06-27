



import { catchAsyncError } from '../../middleware/catchAsyncError.js';
import { AppError } from '../../utils/AppError.js';
import { subCategoryModel } from './../../../database/models/subcategory.model.js';



import slugify from 'slugify'




const createSubCategory = catchAsyncError(
    async (req, res, next) => {
        const { name,category } = req.body
        let result = new subCategoryModel({ name, slug: slugify(name),category })
        await result.save()
        res.status(200).json({ message: "success", result })
    }
)

const getAllSubCategories = catchAsyncError(
    async (req, res, next) => {
        console.log(req.params);
        let filter={}
        if(req.params.categoryId){
            filter={category:req.params.categoryId}
        }
        let result = await subCategoryModel.find(filter)
        res.status(200).json({ message: "success", result })
    }
)

const getSubCategory = catchAsyncError(
    async (req, res, next) => {
        const { id } = req.params
        let result = await subCategoryModel.findById(id)

        !result && next(new AppError(`subcategory not found`, 404))
        result && res.status(200).json({ message: "success", result })

    }
)
const updateSubCategory = catchAsyncError(
    async (req, res, next) => {
        const { id } = req.params
        const { name,category } = req.body
        let result = await subCategoryModel.findByIdAndUpdate(id, { name,category, slug: slugify(name) },{new:true})

        !result && next(new AppError(`subcategory not found`, 404))
        result && res.status(200).json({ message: "success", result })
    }
)

const deleteSubCategory = catchAsyncError(
    async (req, res, next) => {
        const { id } = req.params
        let result = await subCategoryModel.findByIdAndDelete(id)

        !result && next(new AppError(`subcategory not found`, 404))
        result && res.status(200).json({ message: "success", result })
    }
)


export {
    createSubCategory, getAllSubCategories, getSubCategory, updateSubCategory, deleteSubCategory
}