



import { deleteOne } from '../../handlers/factor.handler.js';
import { catchAsyncError } from '../../middleware/catchAsyncError.js';
import { ApiFeatures } from '../../utils/ApiFeatures.js';
import { AppError } from '../../utils/AppError.js';



import { reviewModel } from './../../../database/models/review.model.js';




const createReview = catchAsyncError(
    async (req, res, next) => {
        req.body.user = req.user._id

        let isReview = await reviewModel.findOne({ user: req.user._id, product: req.body.product })
        if (isReview) return next(new AppError(`you have created a review before`, 409))
        let result = new reviewModel(req.body)
        await result.save()
        res.status(200).json({ message: "success", result })
    }
)

const getAllReviews = catchAsyncError(
    async (req, res, next) => {
        let apifeatures = new ApiFeatures(reviewModel.find(), req.query)
            .paginate().sort().fields().filter().search()
        let result = await apifeatures.mongooseQuery
        res.status(200).json({ message: "success", page: apifeatures.page, result })
    }
)

const getReview = catchAsyncError(
    async (req, res, next) => {
        const { id } = req.params
        let result = await reviewModel.findById(id)

        !result && next(new AppError(`Review not found`, 404))
        result && res.status(200).json({ message: "success", result })

    }
)
const updateReview = catchAsyncError(
    async (req, res, next) => {
        const { id } = req.params
        let result = await reviewModel.findOneAndUpdate({ _id: id, user: req.user._id }, req.body, { new: true })
        !result && next(new AppError(`Review not found or You Are Not Authorized`, 404))
        result && res.status(200).json({ message: "success", result })
    }
)

const deleteReview = deleteOne(reviewModel)


export {
    createReview, getAllReviews, getReview, updateReview, deleteReview
}