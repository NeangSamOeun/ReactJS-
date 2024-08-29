
const { userGuard } = require("../controller/auth.controller")
const order = require("../controller/order.controller")
const order_api = (app) =>{
    app.get("/api/order",userGuard,order.getAll)
    // app.get("/api/order",order.getnerateInvoiceNo)
    app.get("/api/order/:id",userGuard,order.getOne)
    app.post("/api/order",userGuard,userGuard,order.create)
    app.put("/api/order",userGuard,order.update)
    app.delete("/api/order/:id",userGuard,order.remove)
}

module.exports = order_api