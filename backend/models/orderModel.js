const mongoose= require('mongoose');

const OrderSchema = new mongoose.Schema({
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    productId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
    },
    status: { type: String, enum: ['Add to cart' ,'Ordered', 'Shipped', 'Delivered', 'Cancelled']},
    orderedDate:{ type: Date},
    shippedDate: { type: Date},
    deliveredDate: {type:Date},
    cancelledDate: { type:Date },
    cancelledReason: { type: String },
});

const Order = new mongoose.model('Order', OrderSchema, 'orders');
module.exports= Order;