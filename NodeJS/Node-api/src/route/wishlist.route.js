

const contWL = require("../controller/wishlist.controller")

const wishlist = (app) =>{
    app.get("/api/wishlist",contWL.getAll)
    app.post("/api/wishlist",contWL.create)
    app.delete("/api/wishlist",contWL.remove)
}

module.exports = wishlist
