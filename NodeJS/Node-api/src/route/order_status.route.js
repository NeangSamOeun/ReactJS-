

const orderS = require("../controller/order_status.controller")

const order_status = (app) =>{
    app.get("/api/order_status",orderS.getAll)
    app.post("/api/order_status",orderS.create)
    app.delete("/api/order_status",orderS.remove)
}

module.exports = order_status
