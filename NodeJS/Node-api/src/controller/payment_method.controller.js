

const database = require("../util/db")

const getAll = async (req,res)=>{
    var {payment_methode_id} = req.body
    var sql = "SELECT * FROM payment_methode WHERE payment_methode_id = ? "
    const list = await database.query(sql,[payment_methode_id])
        res.json({
            data: list
        })
}
const create = async (req,res) =>{
    var {name,code} = req.body
    var sql = "INSERT INTO wislist (payment_methode_id,name,code) VALUES (?,?,?)"
    var params = [name,code]
    var data = await database.query(sql,params)
    res.json({
        message : "Create success!",
        data : data
    })

}
const remove = async (req,res) =>{
    const {payment_methode_id}=req.body
    var sql = "SELECT FROM ayment_methode WHERE payment_methode_id = ?"
    var data = await database.query(sql,[payment_methode_id])
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