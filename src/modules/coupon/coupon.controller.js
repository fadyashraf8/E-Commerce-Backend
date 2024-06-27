



import { deleteOne } from '../../handlers/factor.handler.js';
import { catchAsyncError } from '../../middleware/catchAsyncError.js';
import { ApiFeatures } from '../../utils/ApiFeatures.js';
import { AppError } from '../../utils/AppError.js';
import qrcode from 'qrcode'



import { couponModel } from './../../../database/models/coupon.model.js';




const createCoupon = catchAsyncError(
    async (req, res, next) => {
        let result = new couponModel(req.body)
        await result.save()
        res.status(200).json({ message: "success", result })
    }
)

const getAllCoupons = catchAsyncError(
    async (req, res, next) => {
        let apifeatures = new ApiFeatures(couponModel.find(), req.query)
            .paginate().sort().fields().filter().search()
        let result = await apifeatures.mongooseQuery
        res.status(200).json({ message: "success", page: apifeatures.page, result })
    }
)

const getCoupon = catchAsyncError(
    async (req, res, next) => {
        const { id } = req.params
        let result = await couponModel.findById(id)
        let url = await qrcode.toDataURL(result.code)
        !result && next(new AppError(`Coupon not found`, 404))
        result && res.status(200).json({ message: "success", result, url })

    }
)
const updateCoupon = catchAsyncError(
    async (req, res, next) => {
        const { id } = req.params
        let result = await couponModel.findOneAndUpdate({ _id: id }, req.body, { new: true })
        console.log(result);
        !result && next(new AppError(`Coupon not found or You Are Not Authorized`, 404))
        result && res.status(200).json({ message: "success", result })
    }
)

const deleteCoupon = deleteOne(couponModel)


export {
    createCoupon, getAllCoupons, getCoupon, updateCoupon, deleteCoupon
}