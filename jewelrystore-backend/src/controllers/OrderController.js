const OrderService = require('../services/OrderService')
const asyncHandler = require('express-async-handler');
const Cart = require('../models/CartModel');
const Product = require('../models/ProductModel');
const Order = require('../models/OrderProduct');
const User = require('../models/UserModel');

const createOrder = async (req, res) => {
    try { 
        const { paymentMethod, itemsPrice, shippingPrice, totalPrice, fullName, address, city, phone } = req.body
        if (!paymentMethod || !itemsPrice || !shippingPrice || !totalPrice || !fullName || !address || !city || !phone) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The input is required'
            })
        }
        const response = await OrderService.createOrder(req.body)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

const getAllOrderDetails = async (req, res) => {
    try {
        const userId = req.params.id
        if (!userId) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The userId is required'
            })
        }
        const response = await OrderService.getAllOrderDetails(userId)
        return res.status(200).json(response)
    } catch (e) {
        // console.log(e)
        return res.status(404).json({
            message: e
        })
    }
}

const getDetailsOrder = async (req, res) => {
    try {
        const orderId = req.params.id
        if (!orderId) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The userId is required'
            })
        }
        const response = await OrderService.getOrderDetails(orderId)
        return res.status(200).json(response)
    } catch (e) {
        // console.log(e)
        return res.status(404).json({
            message: e
        })
    }
}

const cancelOrderDetails = async (req, res) => {
    try {
        const data= req.body.orderItems
        const orderId= req.body.orderId
        if (!orderId) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The orderId is required'
            })
        }
        const response = await OrderService.cancelOrderDetails(orderId, data)
        return res.status(200).json(response)
    } catch (e) {
        // console.log(e)
        return res.status(404).json({
            message: e
        })
    }
}

const getAllOrder = async (req, res) => {
    try {
        const data = await OrderService.getAllOrder()
        return res.status(200).json(data)
    } catch (e) {
        // console.log(e)
        return res.status(404).json({
            message: e
        })
    }
}

const createOrderFromCart = asyncHandler(async (req, res) => {
    const userId = req.params.userId;
    const { selectedItems } = req.body; // Array of selected items with product ID and amount

    try {
        const user = await User.findById(userId);
        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }

        const cart = await Cart.findOne({ orderby: user._id }).populate('products.product');
        if (!cart) {
            res.status(404).json({ message: 'Cart not found' });
            return;
        }

        const orderItems = [];
        let itemsPrice = 0;

        for (let selectedItem of selectedItems) {
            const cartItem = cart.products.find(p => p.product._id.toString() === selectedItem._id);
            console.log('cartItem id', cartItem)
            if (cartItem && cartItem.amount >= selectedItem.amount) {
                const product = await Product.findById(cartItem.product._id);

                if (product) {
                    orderItems.push({
                        name: product.name,
                        amount: selectedItem.amount,
                        image: product.image,
                        price: product.price,
                        product: product._id,
                    });
                    itemsPrice += product.price * selectedItem.amount;

                    // Update product stock
                    product.countInStock -= selectedItem.amount;
                    await product.save();
                }
            } else {
                res.status(400).json({ message: `Invalid item or insufficient quantity for product ID: ${selectedItem._id}` });
                return;
            }
        }

        const shippingPrice = 5.0; // For simplicity, fixed shipping price
        const totalPrice = itemsPrice + shippingPrice;

        const newOrder = new Order({
            orderItems,
            shippingAddress: req.body.shippingAddress,
            paymentMethod: req.body.paymentMethod,
            itemsPrice,
            shippingPrice,
            totalPrice,
            user: user._id,
            isPaid: false,
        });

        const createdOrder = await newOrder.save();
        res.status(201).json(createdOrder);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = {
    createOrder,
    getAllOrderDetails,
    getDetailsOrder,
    cancelOrderDetails,
    getAllOrder,
    createOrderFromCart
}