import Order from "../models/Order.model";
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

    //calculate totals
    const subtotal = orderItems.reduce((sum,i) => sum + i.price * i.quantity, 0);
    const shippingCharge = subtotal >= 499 ? 0 : 40;
    const taxRate = 18;
    const taxAmount = Math.round((subtotal * taxRate) / 100);
    const couponDiscount = 0;
    const discount = 0;
    const total = subtotal + shippingCharge + taxAmount - couponDiscount - discount;

    const order = await Order.create({
        user: req.user._id,
        items: orderItems,
        shippingAddress,
        billingAddress: billingAddress || {sameAsShipping:true},
        paymentMethod,
        subtotal,
        shippongCharge,
        taxAmount,
        taxRate,
        discount,
        couponDiscount,
        couponCode: couponCode || null,
        total,
        customenNote,
        isGift: isGift || false,
        giftMessage: isGift ? geftMessage: null

    


    })
         // Deduct stock
  for (const item of orderItems) {
    await Product.findByIdAndUpdate(item.product, {
      $inc: { stock: -item.quantity, salesCount: item.quantity },
    });
  }

  // Update user stats
  await User.findByIdAndUpdate(req.user._id, {
    $inc: { totalOrders: 1, totalSpent: total },
  });

  const populated = await Order.findById(order._id)
    .populate("user", "name email phone")
    .populate("items.product", "name images slug")
    .populate("items.seller", "name sellerProfile.shopName");

  res.status(201).json({
    success: true,
    message: "Order placed successfully.",
    data:    { order: populated },
  });

});

