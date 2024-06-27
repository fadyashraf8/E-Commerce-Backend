



import { cartModel } from '../../../database/models/cart.model.js';
import { productModel } from '../../../database/models/product.model.js';
import { deleteOne } from '../../handlers/factor.handler.js';
import { catchAsyncError } from '../../middleware/catchAsyncError.js';
import { ApiFeatures } from '../../utils/ApiFeatures.js';
import { AppError } from '../../utils/AppError.js';
import { couponModel } from './../../../database/models/coupon.model.js';


function calcTotalPrice(cart) {
    let totalPrice = 0
    cart.cartItems.forEach(el => {
        totalPrice += el.quantity * el.price
    });
    cart.totalPrice = totalPrice
}

const addToCart = catchAsyncError(
    async (req, res, next) => {
        let product = await productModel.findById(req.body.product)
        if (!product) return next(AppError("Product Not Found", 401))
        req.body.price = product.price
        let isExist = await cartModel.findOne({ user: req.user._id })
        if (!isExist) {
            let result = new cartModel({
                user: req.user._id,
                cartItems: [req.body]
            })
            calcTotalPrice(result)
            await result.save()
            return res.status(200).json({ message: "success", result })
        }
        let item = isExist.cartItems.find((el) => el.product == req.body.product)
        if (item) {
            item.quantity += req.body.quantity || 1
        } else {
            isExist.cartItems.push(req.body)
        }
        calcTotalPrice(isExist)

        if (isExist.discount) {
            isExist.totalPriceAfterDiscount = isExist.totalPrice - (isExist.totalPrice * isExist.discount) / 100
        }

        await isExist.save()
        res.json({ message: "success", isExist })
    }
)
const removeFromCart = catchAsyncError(
    async (req, res, next) => {

        let result = await cartModel.findOneAndUpdate({ user: req.user._id },
            { $pull: { cartItems: { _id: req.params.id } } }, { new: true })

        if (result.discount) {
            result.totalPriceAfterDiscount = result.totalPrice - (result.totalPrice * result.discount) / 100
        }
        !result && next(new AppError(`Product not found `, 401))
        result && res.status(200).json({ message: "success", result })
    }
)

const updateQuantity = catchAsyncError(
    async (req, res, next) => {
        let product = await productModel.findById(req.params.id)
        if (!product) return next(new AppError("Product Not Found", 401))
        let isExist = await cartModel.findOne({ user: req.user._id })
        if (!isExist) return next(new AppError("user cart Not Found", 401))

        console.log(isExist);
        let item = isExist.cartItems.find((el) => el.product == req.params.id)

        if (item) {
            item.quantity = req.body.quantity
        }
        calcTotalPrice(isExist)
        if (isExist.discount) {
            isExist.totalPriceAfterDiscount = isExist.totalPrice - (isExist.totalPrice * isExist.discount) / 100
        }
        await isExist.save()
        res.json({ message: "success", isExist })
    }
)



const applyCoupon = catchAsyncError(
    async (req, res, next) => {
        let coupon = await couponModel
            .findOne({ code: req.body.code, expires: { $gt: Date.now() } })
        let cart = await cartModel.findOne({ user: req.user._id })
        cart.totalPriceAfterDiscount = cart.totalPrice - (cart.totalPrice * coupon.discount) / 100
        cart.discount = coupon.discount
        await cart.save()
        res.status(200).json({ message: "success", cart })
    }
)

const getLoggedUsercart = catchAsyncError(
    async (req, res, next) => {

        let cartUser = await cartModel.findOne({ user: req.user._id }).populate('cartItems.product')

        res.json({ message: "success", cartUser })
    }
)


export {
    addToCart, removeFromCart, updateQuantity, applyCoupon, getLoggedUsercart
}