import { globalMiddleWare } from "./middleware/globalMiddleWare.js"
import addressRouter from "./modules/address/address.router.js"
import authRouter from "./modules/auth/auth.router.js"
import brandRouter from "./modules/brand/brand.router.js"
import cartRouter from "./modules/cart/cart.router.js"
import categoryRouter from "./modules/category/category.router.js"
import couponRouter from "./modules/coupon/coupon.router.js"
import orderRouter from "./modules/order/order.router.js"
import productRouter from "./modules/product/product.router.js"
import reviewRouter from "./modules/review/review.router.js"
import subCategoryRouter from "./modules/subCategory/subCategory.router.js"
import userRouter from "./modules/user/user.router.js"
import wishlistRouter from "./modules/wishlist/wishlist.router.js"
import { AppError } from "./utils/AppError.js"



export function init(app) {
    app.use('/api/v1/categories', categoryRouter)
    app.use('/api/v1/subCategories', subCategoryRouter)
    app.use('/api/v1/brands', brandRouter)
    app.use('/api/v1/products', productRouter)
    app.use('/api/v1/auth', authRouter)
    app.use('/api/v1/users', userRouter)
    app.use('/api/v1/review', reviewRouter)
    app.use('/api/v1/wishlist', wishlistRouter)
    app.use('/api/v1/address', addressRouter)
    app.use('/api/v1/coupon', couponRouter)
    app.use('/api/v1/cart', cartRouter)
    app.use('/api/v1/order', orderRouter)

    app.all('*', (req, res, next) => {
        next(new AppError(`can't find this route: ${req.originalUrl}`, 404))
    })

    app.use(globalMiddleWare)
}