

// =============================================
// CART CONTROLLER

import { AppError, catchAsync } from "../middlewares/errorHandler";
import { Cart } from "../models/extra.models";
import Product from "../models/Product.model";
import { calculateCartTotals } from "../utils/apiFeatures";

// =============================================
export const getCart = catchAsync(async (req, res, next) =>{
    let cart = await Cart.findOne({user:req.user._id}).populate({
        path:"items.product",
        select:"name price comparePrice discount discountType images stock status seller brand",
        populate:{path:"seller",select:"sellerProfile.shopName"},

    });

    if(!cart){
        cart = await Cart.create({user:req.user._id,item:[]});

    }
    //Filter out unavaiabl products 
    const validItems = cart.items.filter((item) => item.product && item.product.isActive !== false && item.product.status === "active");

    const totals = calculateCartTotals(validItems);

    res.status(200).json({
        success:true,
        data:{cart:{...cart.toObject(),item:validItems},totals},
    });
});

export const addToCart = catchAsync(async(req,res,next)=>{
    const {productId,quantity = 1 , variant={}} = req.body;

    const product = await Product.findById(productId);
    if(!product) return next(new AppError("Product not found.",404));
    if(product.stock < 1) return next(new AppError("Product is out of Stock.",400));
    if(!product.isActive || product.status !== "active"){
        return next(new AppError("Product is not available",400));
    }

    const requestedQty = Main.min(parseInt(quantity), Math.min(product.stock,20));
    if (requestedQty < 1) return next(new AppError("Invalid quantity.", 400));

    let cart = await Cart.findOne({user:req.user._id});
    if (!cart) cart = await Cart.create({user:req.user._id,item:[]});

    await cart.addItem(productId, requestedQty,variant);

    await cart.populate({
        path:"item.product",
        select:"name price comparePrice discount images stock",
    });

    res.status(200).json({
        success:true,
        message:"Item added to cart.",
        data:{cart, totalItems:cart.totalItems},
    });
});

export const updateCartItem = catchAsync(async (req,res,next)=>{
    const {productId, quantity, variant = {}} = req.body;

    const product = await Product.findById(productId);
    if(!product) return next(new AppError("Product not found.",404));

    if(quantity > product.stock){
        return next(new AppError(`Only ${product.stock} units available.`,400));

        const cart = await Cart.findOne({user:req.user._id});
        if (!cart) return next(new AppError("Cart not found.",404));

        if(quantity <= 0){
            await cart.removeItem(productId,variant);
        }else{
            await cart.updateQuantity(productId,quantity,variant);
        }

        res.status(200).json({success:true, message: "Cart updated." ,data: {cart}});
    }
});

export const removeFromCart = catchAsync(async(req,res,next) => {
    
})