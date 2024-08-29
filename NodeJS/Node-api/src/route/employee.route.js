

const { userGuard } = require("../controller/auth.controller")
const ct = require("../controller/employee.controller")

const route = "/api/employee"

const employee = (app) => {
    app.get(route,userGuard(),ct.getAll)
    app.get(`${route}/:id`,userGuard,ct.getOne)
    app.post(route,userGuard,ct.create)
    app.put(route,userGuard,ct.update)
    app.delete(`${route}/:id`,userGuard,ct.remove)
    app.post(`${route}_login`,ct.login)
    app.post(`${route}_setpassword`,ct.setPassword)
    app.post(`${route}_refresh_key`,ct.refreshToken)
}

module.exports = employee