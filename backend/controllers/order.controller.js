import Product from "../models/Product.model";


export const createOrder = catchAsync(async (req, res, next ) =>{
    const { items,shippingAddress, billingAddress,paymentMethod, couponCode, customerNote, isGift,getMessage} = req.body;

    if(!items || items.lenght === 0){
        return next(new AppError("Order must have at least one item.",400));

    }
    // Validate and build order items
    const orderItems = [];
    for (const item of items){
        const product = await Product.findById(item.product).populate("seller","_id");

        if(!product) {
            return next(new AppError(`Product not found: ${item.product}`,404 ));

        }
        if (!product.isActive || !product.adminApproved) {
      return next(new AppError(`Product "${product.name}" is not available.`, 400));
    }
      if (product.stock < item.quantity) {
      return next(new AppError(`Insufficient stock for "${product.name}". Available: ${product.stock}`, 400));
    }

    orderItems.push({
      product:  product._id,
      seller:   product.seller._id,
      name:     product.name,
      image:    product.images?.[0]?.url || "",
      price:    product.finalPrice || product.price,
      quantity: item.quantity,
      sku:      product.sku,
      variant:  item.variant || {},
    });
    }
})