
import { catchAsyncError } from '../../middleware/catchAsyncError.js';
import { ApiFeatures } from '../../utils/ApiFeatures.js';
import { AppError } from '../../utils/AppError.js';
import { categoryModel } from './../../../database/models/category.model.js';
import slugify from 'slugify'






const createCategory = catchAsyncError(
    async (req, res, next) => {

        req.body.image=req.file.filename
        req.body.slug=slugify(req.body.name)
        let result = new categoryModel(req.body)
        await result.save()
        res.status(200).json({ message: "success", result })
    }
)

const getAllCategories = catchAsyncError(
    async (req, res, next) => {
        let apifeatures = new ApiFeatures(categoryModel.find({}), req.query)
            .paginate().sort().fields().filter().search()
        let result = await apifeatures.mongooseQuery
        res.status(200).json({ message: "success", page: apifeatures.page, result })
    }
)

const getCategory = catchAsyncError(
    async (req, res, next) => {
        const { id } = req.params
        let result = await categoryModel.findById(id)

        !result && next(new AppError(`category not found`, 404))
        result && res.status(200).json({ message: "success", result })

    }
)
const updateCategory = catchAsyncError(
    async (req, res, next) => {
        const { id } = req.params
        if(req.body.image){

            req.body.image=req.file.filename
        }
        req.body.slug=slugify(req.body.name)
        let result = await categoryModel.findByIdAndUpdate(id, req.body, { new: true })

        !result && next(new AppError(`category not found`, 404))
        result && res.status(200).json({ message: "success", result })
    }
)

const deleteCategory = catchAsyncError(
    async (req, res, next) => {
        const { id } = req.params
        let result = await categoryModel.findByIdAndDelete(id)

        !result && next(new AppError(`category not found`, 404))
        result && res.status(200).json({ message: "success", result })
    }
)


export {
    createCategory, getAllCategories, getCategory, updateCategory, deleteCategory
}