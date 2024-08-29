
const { userGuard } = require("../controller/auth.controller")
const Cstomer = require("../controller/customers.controller")

const costomers = (app) =>{
    app.get("/api/customer",userGuard,Cstomer.getcostomer)
    app.get("/api/customer/:id",userGuard("customer.read"),Cstomer.customerOne)
    app.post("/api/customer",userGuard("customer.Create"),Cstomer.customerCreate)
    app.post("/api/customer/auth/login",userGuard,Cstomer.login)
    app.put("/api/customer",userGuard,Cstomer.customerUpdat)
    app.delete("/api/customer/:id",userGuard,Cstomer.customerRemove)


    app.get("/api/customeraddress",userGuard,Cstomer.listAddress)
    app.get("/api/customeraddress/:id",userGuard,Cstomer.listOneAddress)
    app.post("/api/customeraddress",userGuard,Cstomer.newAddress)
    app.put("/api/customeraddress",userGuard,Cstomer.customerUpdat)
    app.delete("/api/customeraddress/:id",userGuard,Cstomer.removeAddress)
}

module.exports = costomers