const UserRouter = require('./UserRouter')
const ProductRouter = require('./ProductRouter')

const routes = (app) => {
    app.use('/user', UserRouter)
    app.use('/product', ProductRouter)
}

module.exports = routes
