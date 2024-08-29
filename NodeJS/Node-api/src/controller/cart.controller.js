

const database = require("../util/db")
const { isEmptyOneNull } = require("../util/service")

const getlist = async (req,res) =>{
    // var sql = "SELECT * FROM cart WHERE customer_id = ?"
    
    var {customer_id} = req.body
    // var sql = " SELECT c.cart_id, c.quantity, p.* FROM cart c "
    // sql += " INNER JOIN product p ON (c.p = p.product_id) "
    // sql += " WHERE c.customer_id = ? "

    var sql = "SELECT c.cart_id, c.quantity, p.* FROM cart c INNER JOIN product p ON (c.product_id = p.product_id) WHERE c.customer_id = ?;"

    // var sql = "SELECT * FROM cart WHERE customer_id = ?"
    const list = await database.query(sql,[customer_id])
    res.json({
        data: list
    })
}

const addCart = async (req,res) =>{
    var {
        customer_id,
        product_id,
        quantity
    } = req.body

    var message ={}
    if(isEmptyOneNull(customer_id)){message.customer_id = "customer_id required!"}
    if(isEmptyOneNull(product_id)){message.product_id = "product_id required!"}
    if(isEmptyOneNull(quantity)){message.quantity = "quantity required!"}

    if(Object.keys(message).length > 0){
        res.json({
            error : true,
            message : message
        })
        return false
    }

    var sql = "INSERT INTO cart (customer_id,product_id,quantity) VALUES (?, ?, ?)"
    var params = [customer_id,product_id,quantity]
    
    const list = await database.query(sql,params)
    res.json({
        message : "Cart add successfully!",
        data : list
    })
} 

const update = async (req,res) =>{
    var {
        cart_id,
        quantity
    } = req.body

    var message ={}
    if(isEmptyOneNull(cart_id)){message.cart_id = "cart_id required!"}
    if(isEmptyOneNull(product_id)){message.product_id = "product_id required!"}
    // if(isEmptyOneNull(quantity)){message.quantity = "quantity required!"}

    if(Object.keys(message).length > 0){
        res.json({
            error : true,
            message : message
        })
        return false
    }

    var sql = "UPDATE cart SET quantity=(quantity+?) WHERE cart_id = ?"
    var params = [customer_id,product_id,quantity]
    
    const list = await database.query(sql,params)
    res.json({
        message : "Cart update success!",
        data : list
    })
}

const remove = async (req, res) =>{
    const {cart_id} = req.body
    var sql = "DELETE FROM cart WHERE cart_id = ?"
    var list = await database.query(sql,[cart_id])
    res.json({
        message : "Cart removed!",
        data : list
    })
}

module.exports = {
    getlist,
    addCart,
    update,
    remove
}