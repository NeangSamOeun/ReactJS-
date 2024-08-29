

const payment = require("../controller/payment_method.controller")

const payment_methods = (app) =>{
    app.get("/api/payment_method",payment.getAll)
    app.post("/api/payment_method",payment.create)
    app.delete("/api/payment_method/:id",payment.remove)
}

module.exports = payment_methods
