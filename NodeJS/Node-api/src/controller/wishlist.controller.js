

const database = require("../util/db")

const getAll = async (req,res)=>{
    var {customer_id} = req.body
    var sql = "SELECT * FROM wislist WHERE customer_id = ? "
    // var sql = "SELECT wl.id,p.* PROM wislist wl"
    // sql += "INNER JON product p ON (p.product_id = wl.product_id)"
    // sql += "WHERE wl.customer_id = ?"
    const list = await database.query(sql,[customer_id])
        res.json({
            list
        })
    // database.query(sql,[customer_id],(err,row)=>{
    //     if(!err){
    //         res.json({
    //             list : row
    //         })
    //     }else{
    //         res.json({
    //             err : true,
    //             message : err
    //         })
    //     }
    // })
}
const create = async (req,res) =>{
    var {customer_id,product_id} = req.body
    var sql = "INSERT INTO wislist (customer_id,product_id) VALUES (?,?)"
    var params = [customer_id,product_id]
    var data = await database.query(sql,params)
    res.json({
        message : "product added success!",
        data : data
    })

}
const remove = async (req,res) =>{
    const {wislist_id}=req.body
    var sql = "SELECT FROM wislist_id WHERE wislist_id = ?"
    var data = await database.query(sql,[wislist_id])
        res.json({
            message : "Product remove from your wishlist"
        })

}

module.exports ={
    getAll,
    create,
    remove
}