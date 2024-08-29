

const card_controller = require("../controller/cart.controller")
const card_product = (app) =>{
    app.get("/api/card_product",card_controller.getlist)
    app.post("/api/card_product",card_controller.addCart)
    app.put("/api/card_product",card_controller.update)
    app.delete("/api/card_product",card_controller.remove)
}

module.exports = card_product