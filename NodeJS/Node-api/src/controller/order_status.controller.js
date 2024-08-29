

const database = require("../util/db")

const getAll = async (req,res)=>{
    // var sql = "SELECT * FROM order_status"
      const list = await database.query("SELECT * FROM order_status")
        res.json({
            data :list
        })
    
}


const create = async (req,res) =>{
    var {name,message, sort_order}=req.body
    var sql = "INSERT INTO order_status (name,message,sort_order) VALUES (?,?,?)"
    var params = [name,message, sort_order]
    var data = await database.query(sql,params)
    res.json({
        message : "product added success!",
        data : data
    })

}
const remove = async (req,res) =>{
    const {order_status_id}=req.body
    var sql = "SELECT FROM order_status WHERE order_status_id = ?"
    var data = await database.query(sql,[order_status_id])
        res.json({
            message : "Remove success!",
            data : data
        })

}

module.exports ={
    getAll,
    create,
    remove
}