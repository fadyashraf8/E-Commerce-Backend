




import { productModel } from '../../../database/models/product.model.js';
import { deleteOne } from '../../handlers/factor.handler.js';
import { catchAsyncError } from '../../middleware/catchAsyncError.js';
import { ApiFeatures } from '../../utils/ApiFeatures.js';
import { AppError } from '../../utils/AppError.js';



import slugify from 'slugify'




    const createProduct = catchAsyncError(
        async (req, res, next) => {
            req.body.slug = slugify(req.body.title)
            req.body.imgCover = req.files.imgCover[0].filename
            req.body.images = req.files.images.map(obj => obj.filename)
            let result = new productModel(req.body)
            await result.save()
            res.status(200).json({ message: "success", result })
  
        }
    )

const getAllProducts = catchAsyncError(
    async (req, res, next) => {

        let apifeatures = new ApiFeatures(productModel.find(), req.query)
            .paginate().sort().fields().filter().search()

        let result = await apifeatures.mongooseQuery
        res.status(200).json({ message: "success", page: apifeatures.page, result })
    }
)

const getProduct = catchAsyncError(
    async (req, res, next) => {
        const { id } = req.params
        let result = await productModel.findById(id)

        !result && next(new AppError(`Product not found`, 404))
        result && res.status(200).json({ message: "success", result })

    }
)
const updateProduct = catchAsyncError(
    async (req, res, next) => {
        const { id } = req.params
        if (req.body.title) req.body.slug = slugify(req.body.title)

        let result = await productModel.findByIdAndUpdate(id, req.body, { new: true })

        !result && next(new AppError(`Product not found`, 404))
        result && res.status(200).json({ message: "success", result })
    }
)

const deleteProduct = deleteOne(productModel)


export {
    createProduct, getAllProducts, getProduct, updateProduct, deleteProduct
}