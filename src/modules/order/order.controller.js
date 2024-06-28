



import { cartModel } from '../../../database/models/cart.model.js';
import { orderModel } from '../../../database/models/order.model.js';
import { productModel } from '../../../database/models/product.model.js';
import { userModel } from '../../../database/models/user.model.js';

import { catchAsyncError } from '../../middleware/catchAsyncError.js';
import { AppError } from '../../utils/AppError.js';
import Stripe from 'stripe';
const stripe = new Stripe('sk_test_51P5eHuP3E6MDFeyINxXfmn2AKruo7kyRglWpHIxY1vYqFyRLpNJEFdLVZyRZY62uReWEqxro0jPKmTSiJdKn38DZ00CxV1Et90');



const createCashOrder = catchAsyncError(
    async (req, res, next) => {

        const cart = await cartModel.findById(req.params.id)
        if (!cart) return next(new AppError(`cart not found`, 404))

        const totalOrderPrice = cart.totalPriceAfterDiscount ? cart.totalPriceAfterDiscount : cart.totalPrice

        const order = new orderModel({
            user: req.user._id,
            cartItems: cart.cartItems,
            totalOrderPrice,
            shippingAddress: req.body.shippingAddress
        })
        await order.save()

        if (order) {
            let options = cart.cartItems.map(item => ({
                updateOne: {
                    filter: { _id: item.product },
                    update: { $inc: { quantity: -item.quantity, sold: item.quantity } }
                }
            }))
            await productModel.bulkWrite(options)
            await cartModel.findByIdAndDelete(req.params.id)

            return res.status(200).json({ message: "success", order })
        } else {
            return next(new AppError(`order not found`, 404))
        }



    }
)

const getUserOrder = catchAsyncError(
    async (req, res, next) => {

        const order = await orderModel.findOne({ user: req.user._id }).populate('cartItems.product')
        res.status(200).json({ message: "success", order })
    }
)
const getAllOrder = catchAsyncError(
    async (req, res, next) => {

        const orders = await orderModel.find({}).populate('cartItems.product')
        res.status(200).json({ message: "success", orders })
    }
)

const createVisaOrder = catchAsyncError(
    async (req, res, next) => {
        const cart = await cartModel.findById(req.params.id)
        if (!cart) return next(new AppError(`cart not found`, 404))

        const totalOrderPrice = cart.totalPriceAfterDiscount ? cart.totalPriceAfterDiscount : cart.totalPrice
        let session = await stripe.checkout.sessions.create({
            line_items: [
                {
                    price_data: {
                        currency: 'egp',
                        unit_amount: totalOrderPrice * 100,
                        product_data: {
                            name: req.user.name
                        }
                    },
                    quantity: 1
                }
            ],
            mode: 'payment',
            success_url: "https://fadyashraf8.github.io/Fresh-Cart-E-commerce/",
            cancel_url: 'https://fadyashraf8.github.io/Fresh-Cart-E-commerce/cartItems',
            customer_email: req.user.email,
            client_reference_id: req.params.id,
            metadata: req.body.shippingAddress,

        })

        return res.status(200).json({ message: "success", session })


    }
)
const createSessionOrder = catchAsyncError((request, response) => {
    const sig = request.headers['stripe-signature'].toString()

    let event;

    try {
        event = stripe.webhooks.constructEvent(request.body, sig, 'whsec_NgKHUUmbghBXOUFG0EC5AcLxTKDcSAwr');
    } catch (err) {
        return response.status(400).send(`Webhook Error: ${err.message}`);

    }

    // Handle the event

    if (event.type === 'checkout.session.completed') {
        console.log('order here');
        card(event.data.object)
    } else {
        console.log(`Unhandled event type ${event.type}`);

    }

}
)

export {
    createCashOrder, getUserOrder, getAllOrder, createVisaOrder, createSessionOrder
}


async function card(e,res) {
    const cart = await cartModel.findById(e.client_reference_id)
    if (!cart) return next(new AppError(`cart not found`, 404))
    let user = await userModel.findOne({email:e.customer_email})


    const order = new orderModel({
        user: user._id,
        cartItems: cart.cartItems,
        totalOrderPrice:e.amount_total/100,
        shippingAddress: e.metadata.shippingAddress,
        paymentMethod:'visa',
        isPaid:true,
        paidAt:Date.now(),
    })
    await order.save()

    if (order) {
        let options = cart.cartItems.map(item => ({
            updateOne: {
                filter: { _id: item.product },
                update: { $inc: { quantity: -item.quantity, sold: item.quantity } }
            }
        }))
        await productModel.bulkWrite(options)
        await cartModel.findByIdAndDelete({user:user._id    })

        return res.status(200).json({ message: "success", order })
    } else {
        return next(new AppError(`order not found`, 404))
    }
}