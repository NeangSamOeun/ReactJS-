
const express = require('express') // import
const app = express() // extend express

// allow origin (npm i cors)  allow go to from client
const cors = require("cors")

app.use(cors({
    origin : "*"
}))

app.use(express.json())

app.get("/",(req,res)=>{res.send("Hello API")})




require("./src/route/product.route")(app)
require("./src/route/category.route")(app)
require("./src/route/employee.route")(app)
require("./src/route/customers.route")(app)
require("./src/route/wishlist.route")(app)
require("./src/route/payment_methode.route")(app)
require("./src/route/order_status.route")(app)
require("./src/route/cart.route")(app)
require("./src/route/order.route")(app)





app.listen(8081,()=>{
    console.log("localhost : 8081")
})