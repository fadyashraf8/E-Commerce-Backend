



import { brandModel } from '../../../database/models/brand.model.js';
import { deleteOne } from '../../handlers/factor.handler.js';
import { catchAsyncError } from '../../middleware/catchAsyncError.js';
import { ApiFeatures } from '../../utils/ApiFeatures.js';
import { AppError } from '../../utils/AppError.js';



import slugify from 'slugify'




const createBrand = catchAsyncError(
    async (req, res, next) => {
        req.body.slug = slugify(req.body.name)
        req.body.logo = req.file.filename
        let result = new brandModel(req.body)
        await result.save()
        res.status(200).json({ message: "success", result })
    }
)

const getAllBrands = catchAsyncError(
    async (req, res, next) => {
        let apifeatures = new ApiFeatures(brandModel.find({}), req.query)
            .paginate().sort().fields().filter().search()
        let result = await apifeatures.mongooseQuery
        res.status(200).json({ message: "success", page: apifeatures.page, result })
    }
)

const getBrand = catchAsyncError(
    async (req, res, next) => {
        const { id } = req.params
        let result = await brandModel.findById(id)

        !result && next(new AppError(`Brand not found`, 404))
        result && res.status(200).json({ message: "success", result })

    }
)
const updateBrand = catchAsyncError(
    async (req, res, next) => {
        const { id } = req.params
        req.body.slug = slugify(req.body.name)
        req.body.logo = req.file.filename
        let result = await brandModel.findByIdAndUpdate(id, req.body, { new: true })

        !result && next(new AppError(`Brand not found`, 404))
        result && res.status(200).json({ message: "success", result })
    }
)

const deleteBrand = deleteOne(brandModel)


export {
    createBrand, getAllBrands, getBrand, updateBrand, deleteBrand
}