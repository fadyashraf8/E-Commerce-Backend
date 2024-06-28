import { userModel } from "../../../database/models/user.model.js";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { catchAsyncError } from "../../middleware/catchAsyncError.js";
import { AppError } from "../../utils/AppError.js";


export const signup = catchAsyncError(
    async (req, res, next) => {
        let isFound = await userModel.findOne({ email: req.body.email })
        if (isFound) return next(new AppError(`email already exists`, 404))
        let user = new userModel(req.body)
        await user.save()
        res.status(200).json({ message: "success", user })
    }
)

export const signin = catchAsyncError(async (req, res, next) => {
    const { email, password } = req.body
    let isFound = await userModel.findOne({ email })
    if (!isFound) return next(new AppError(`Email Not Found`, 404))
    const match = await bcrypt.compare(password, isFound.password);
    if (isFound && match) {
        let token = jwt.sign({ name: isFound.email, userId: isFound._id, role: isFound.role }, process.env.JWT_KEY)
        return res.status(200).json({ message: "success", token })
    }
    next(new AppError(`incorrect email or password`, 401))
})

export const protectedRoutes = catchAsyncError(async (req, res, next) => {
    const { token } = req.headers
    if (!token) return next(new AppError("Token Not Provided", 401))

    let decoded = await jwt.verify(token, process.env.JWT_KEY)
    let user = await userModel.findById(decoded.userId)
    if (!user) return next(new AppError("invalid token", 401))

    if (user.passwordChangedAt) {
        let changePasswordDate = parseInt(user.passwordChangedAt.getTime() / 1000)
        if (changePasswordDate > decoded.iat) return next(new AppError("invalid token", 401))
    }
    req.user = user
    next()
})

export const allowedTo = (...roles) => {

    return catchAsyncError(async (req, res, next) => {
        
        if (!roles.includes(req.user.role))
            return next(new AppError(`You Are Not Authorized to access.You Are ${req.user.role}`, 401))
        next()
    })

}

