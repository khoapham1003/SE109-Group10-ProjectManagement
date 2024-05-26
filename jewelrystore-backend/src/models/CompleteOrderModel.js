const mongoose = require('mongoose');

const completeOrderSchema = new mongoose.Schema({
    orderProduct: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'OrderProduct',
        required: true,
    },
    shippingAddress: {
        fullName: { type: String, required: true},
        address: { type: String, required: true},
        city: { type: String, required: true},
        phone: { type: Number, required: true},
    },
    isPaid: { type: Boolean, default: false },
    paidAt: { type: Date },
    isDelivered: { type: Boolean, default: false },
    deliveredAt: { type: Date },
}, {
    timestamps: true,
});

const CompleteOrder = mongoose.model('CompleteOrder', completeOrderSchema);
module.exports = CompleteOrder;
