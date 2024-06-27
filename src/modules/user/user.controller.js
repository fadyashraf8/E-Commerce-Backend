



import { userModel } from '../../../database/models/user.model.js';
import { deleteOne } from '../../handlers/factor.handler.js';
import { catchAsyncError } from '../../middleware/catchAsyncError.js';

import { ApiFeatures } from '../../utils/ApiFeatures.js';
import { AppError } from '../../utils/AppError.js';









const createUser = catchAsyncError(
    async (req, res, next) => {
        let user = await userModel.findOne({ email: req.body.email })
        if (user) return next(new AppError(`Account Already Exists`, 409))

        let result = new userModel(req.body)
        await result.save()
        res.status(200).json({ message: "success", result })
    }
)

const getAllUsers = catchAsyncError(
    async (req, res, next) => {
        let apifeatures = new ApiFeatures(userModel.find({}), req.query)
            .paginate().sort().fields().filter().search()
        let result = await apifeatures.mongooseQuery
        res.status(200).json({ message: "success", page: apifeatures.page, result })
    }
)

const getUser = catchAsyncError(
    async (req, res, next) => {
        const { id } = req.params
        let result = await userModel.findById(id)

        !result && next(new AppError(`User not found`, 404))
        result && res.status(200).json({ message: "success", result })

    }
)
const updateUser = catchAsyncError(
    async (req, res, next) => {
        const { id } = req.params

        let result = await userModel.findByIdAndUpdate(id, req.body, { new: true })

        !result && next(new AppError(`User not found`, 404))
        result && res.status(200).json({ message: "success", result })
    }
)

const changeUserPassword = catchAsyncError(
    async (req, res, next) => {
        const { id } = req.params
        req.body.passwordChangedAt = Date.now()
        let result = await userModel.findByIdAndUpdate(id, req.body, { new: true })
        !result && next(new AppError(`User not found`, 404))
        result && res.status(200).json({ message: "success", result })
    }
)

const deleteUser = deleteOne(userModel)


export {
    createUser, getAllUsers, getUser, updateUser, deleteUser, changeUserPassword
}