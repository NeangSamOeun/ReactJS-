

const productController = require("../controller/product.controller")

   const product = (app) =>{
        app.get("/api/product",productController.getlist)
        app.get("/api/product/:id",productController.getlone)
        app.post("/api/product",productController.create)
        app.put("/api/product",productController.update)
        app.delete("/api/product",productController.remove)
        app.put("/api/product/change_status",productController.changeProductStatus)
   }

module.exports = product


   