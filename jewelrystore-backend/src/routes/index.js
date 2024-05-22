const UserRouter = require('./UserRouter')
const ProductRouter = require('./ProductRouter')
const OrderRouter = require("./OrderRouter")
const PaymentRouter = require("./PaymentRouter")

const routes = (app) => {
    app.use('/user', UserRouter)
    app.use('/product', ProductRouter)
    app.use("/api/order", OrderRouter)
  app.use("/api/payment", PaymentRouter)
}

module.exports = routes
