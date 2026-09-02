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

// =============================================
// GET MY ORDERS (Customer)
// =============================================
export const getMyOrders = catchAsync(async (req, res, next) => {
  const page  = Math.max(1, parseInt(req.query.page)  || 1);
  const limit = Math.min(50, parseInt(req.query.limit) || 10);
  const skip  = (page - 1) * limit;

  const filter = { user: req.user._id };
  if (req.query.status) filter.status = req.query.status;

  const [orders, total] = await Promise.all([
    Order.find(filter)
      .sort("-createdAt")
      .skip(skip)
      .limit(limit)
      .populate("items.product", "name images slug")
      .populate("items.seller", "name sellerProfile.shopName"),
    Order.countDocuments(filter),
  ]);

  res.status(200).json({
    success: true,
    pagination: {
      currentPage: page,
      totalPages:  Math.ceil(total / limit),
      totalCount:  total,
      limit,
    },
    data: { orders },
  });
});

// =============================================
// GET SINGLE ORDER
// =============================================
export const getOrder = catchAsync(async (req, res, next) => {
  const order = await Order.findById(req.params.id)
    .populate("user",           "name email phone")
    .populate("items.product",  "name images slug")
    .populate("items.seller",   "name sellerProfile.shopName");

  if (!order) return next(new AppError("Order not found.", 404));

  // Customer can only see their own orders
  if (
    req.user.role === "customer" &&
    order.user._id.toString() !== req.user._id.toString()
  ) {
    return next(new AppError("Not authorized to view this order.", 403));
  }

  res.status(200).json({ success: true, data: { order } });
});

// =============================================
// GET ORDER BY ORDER NUMBER
// =============================================
export const getOrderByNumber = catchAsync(async (req, res, next) => {
  const order = await Order.findOne({ orderNumber: req.params.orderNumber })
    .populate("user",          "name email phone")
    .populate("items.product", "name images slug")
    .populate("items.seller",  "name sellerProfile.shopName");

  if (!order) return next(new AppError("Order not found.", 404));

  if (
    req.user.role === "customer" &&
    order.user._id.toString() !== req.user._id.toString()
  ) {
    return next(new AppError("Not authorized to view this order.", 403));
  }

  res.status(200).json({ success: true, data: { order } });
});

// =============================================
// CANCEL ORDER (Customer)
// =============================================
export const cancellOrder = catchAsync(async (req,res,next) =>{
    const order = await Order.findById(req.params.id);
    if(!order) return next(new AppError("Order not found.",404));
    if (order.user.toString() !== req.user._id.toString()) {
    return next(new AppError("Not authorized.", 403));
  }
       
  const cancellableStatuses = ["pending", "confirmed", "processing"];
  if (!cancellableStatuses.includes(order.status)) {
    return next(new AppError(`Cannot cancel order with status: ${order.status}`, 400));
  }

  await order.updateStatus("cancelled", req.body.reason || "Cancelled by customer", req.user._id);

  // Restore stock
  for (const item of order.items){
    await Product.findByIdAndUpdate(item.product,{
        $inc:{stock:item.quantity, salesCount: -item.quantity},
    });
  }
   res.status(200).json({
    success: true,
    message: "Order cancelled successfully.",
    data:    { order },
  });
})

// =============================================
// REQUEST RETURN (Customer)
// =============================================
export const requestReturn = catchAsync(async (req, res, next) => {
    const {reason} = req.body;
    const order = await Order.findById(req.params.id);

    if(!order) return next(new AppError("Order not found.",404))
       
     if(order.user.toString() !== req.user._id.toString()){
        return next(new AppError("Not authorized.",403));

     }  
     
     if(order.status !== "delivered"){
        return next(new AppError("Only delivered orders can be returned.",400));
     }

     //10 day return window
     const deliveredAt = new Date(order.deliveredAt);
     const daySince = (Date.now() - deliveredAt) / (1000 * 60 * 60 *24);
     if (daysSince > 10){
        return next(new AppError("Return window of 10 days has expired.",400));
     }
      
     order.returnRequestedAt = new Date();
     order.returnReason = reason;
     await order.updateStatus("returned" , `Return requested: ${reason}`, req.user._id);

    res.status(200).json({
    success: true,
    message: "Return request submitted.",
    data:    { order },
  });

  // =============================================
// GET ALL ORDERS (Admin)
// =============================================

})