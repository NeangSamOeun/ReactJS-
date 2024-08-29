
const database = require("../util/db")
const { isEmptyOneNull } = require("../util/service")



// api getall
const getlist = async (req,res) =>{
    var sql = "SELECT * FROM product"
    const list = await database.query(sql)
        res.json({
            list : list
        })
}

//api get one

const getlone = async (req,res) =>{
     var sql = "SELECT * FROM product WHERE product_id = ?"
     var {id}=req.params
     const list = await database.query(sql,[id])
    res.json({
        list : list,
    })
}

//api create

const create = async (req,res) =>{
    // product_id,	category_id,	barcode,	name,	quantity,	price,	image,	description,	is_active,	create-at,	create_by	
    var {
        category_id,
        barcode,
        name,
        quantity,
        price,
        image,
        description,

    }=req.body
    var message = {}

    if(isEmptyOneNull(category_id)){message.category_id = "category_id required!"}
    if(isEmptyOneNull(barcode)){message.barcode = "barcode required!"}
    if(isEmptyOneNull(name)){message.name = "name required!"}
    if(isEmptyOneNull(quantity)){message.quantity = "quantity required!"}
    if(isEmptyOneNull(price)){message.price = "price required!"}

    if(Object.keys(message).length > 0){
        res.json({
            error : true,
            message : message
        })
        return false
    }

    var sql = "INSERT INTO product (category_id, barcode, name,	quantity, price, image,	description ) VALUES (?, ?, ?, ?, ?, ?, ?)"
    var params = [category_id, barcode, name, quantity, price, image, description]
    const data = await database.query(sql,params)
    res.json({
        list : "Create successfully!",
        data : data
    })
}


// api update 

const update = async(req,res) =>{
    var {
        product_id,
        category_id,
        barcode,
        name,
        quantity,
        price,
        image,
        description,
        is_active,	
        create_at,	
        create_by

    }=req.body
    var message = {}

    if(isEmptyOneNull(product_id)){message.product_id = "product_id required!"}
    if(isEmptyOneNull(category_id)){message.category_id = "category_id required!"}
    if(isEmptyOneNull(barcode)){message.barcode = "barcode required!"}
    if(isEmptyOneNull(name)){message.name = "name required!"}
    if(isEmptyOneNull(quantity)){message.quantity = "quantity required!"}
    if(isEmptyOneNull(price)){message.price = "price required!"}

    if(Object.keys(message).length > 0){
        res.json({
            error : true,
            message : message
        })
        return false
    }

    var sql = "UPDATE product SRT category_id = ?,	barcode = ?, name = ?,	quantity = ?,	price = ?,	image = ?,	description = ? WHERE product_id = ?"
    var params = [category_id, barcode, name, quantity, price, image, description,product_id]
    const data = await database.query(sql,params)
    res.json({
        list : "Update successfully!",
        data : data
    })
}

    //api remove
const remove = async (req,res) =>{
    const {id} = req.body
    var sql = "DELETE * FROM product WHERE product_id = ?"
    const list = await database.query(sql,[id])
    res.json({
        message: "Delete success!",
        data : list
    })
}

const changeProductStatus = async (req,res) =>{
    const {is_active} = req.body;
    var sql = "UPDATA product SET is_active = ? WHERE product_id = ?"
    const data = await database.query(sql,[is_active])
    res.json({
        message : "Update prodct to" + (is_active == 0 ? "inactive" : "active"),
        data : data
    })

}
module.exports = {
    getlist,
    getlone,
    create,
    update,
    remove,
    changeProductStatus
}