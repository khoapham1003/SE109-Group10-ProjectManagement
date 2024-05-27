const mongoose = require('mongoose')

const orderSchema = new mongoose.Schema({
    orderItems: [
        {
            name: { type: String, required: true },
            amount: { type: Number, required: true },
            image: { type: String, required: true },
            price: { type: Number, required: true },
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product',
                required: true,
            },
        },
    ],
    shippingAddress: {
        fullName: { type: String },
        address: { type: String },
        city: { type: String },
        phone: { type: Number },
    },
    //paymentMethod: { type: String}, 
    itemsPrice: { type: Number, required: true },
    shippingPrice: { type: Number}, 
    totalPrice: { type: Number, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    isPaid: { type: Boolean, default: false },
    paidAt: { type: Date },
    isDelivered: { type: Boolean, default: false },
    deliveredAt: { type: Date },
},
    {
        timestamps: true,
    }
);
const Order = mongoose.model('Order', orderSchema);
module.exports = Order