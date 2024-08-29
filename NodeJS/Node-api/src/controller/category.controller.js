
const category = require("../route/category.route")
const database = require("../util/db")
const { isEmptyOneNull } = require("../util/service")

const getlist = async (req,res) =>{ 
    const listcategory = await database.query("SELECT * FROM category")
    res.json({
        list : listcategory
    })
    // var sql = "SELECT * FROM category"
    // database.query(sql,(error,row)=>{
    //     if(error){
    //         res.json({
    //             message : error,
    //             error : true
    //         })
    //     }else{
    //         res.json({
    //             list : row
    //         })
        // }
    // })
}
const getlistone = (req,res) =>{
    var sql = "SELECT * FROM category WHERE category_id = ?"
    var id = req.params.id
    database.query(sql,[id],(error,row)=>{
        if(error){
            res.json({
                message : error,
                error : true
            })
        }else{
            res.json({
                list : row
            })
        }
    })
}

const create = (req,res) => {
    var {
        name,
        parent_id,
        status
    } = req.body 
    
    var message = {}

    if(isEmptyOneNull(name)){
        message.name = "Please enter name"
    }
    if(isEmptyOneNull(parent_id)){
        message.parent_id = "please enter parent_id"
    }
    if(isEmptyOneNull(status)){
        message.status = "Please enter status"
    }
    if(Object.keys(message).length > 0){
        res.json({
            error : true,
            message : message
        })
        return
    }
    
    var sql = "INSERT INTO category (name,parent_id,status) VALUES (?,?,?)"
    var paramter = [name,parent_id,status]
    database.query(sql,paramter,(error,row)=>{
        if(error){
            res.json({
                message : error,
                error : true
            })
        }else{
            res.json({

                message : "Category create successfully!",
                list : row
            })
        }
    })
}

const update = (req,res) =>{
    var {
        category_id,
        name,
        // parent_id,
        status
    } = req.body  

    var message = {}

    if(isEmptyOneNull(name)){
        message.name = "Please enter name"
    }
    // if(isEmptyOneNull(parent_id)){
    //     message.parent_id = "please enter parent_id" 
    // }
    if(isEmptyOneNull(status)){
        message.status = "Please enter status"
    }


    if(Object.keys(message).length > 0){
        res.json({
            error : true,
            message : message
        })
        return
    }
    

    var sql = "UPDATE category SET name=?, status=? WHERE category_id=?"
    var parameter = [name,status,category_id]
    database.query(sql,parameter,(error,row)=>{
        if(error){
            res.json({
                message : error,
                error : true
            })
        }else{
            res.json({
                message : "Category Update Successfully!",
                list : row
            })
        }
    })
}

const remove = (req,res) =>{
    var sql = "DELETE FROM category WHERE category_id =?"
    var id = req.params.id
    database.query(sql,[id],(error,row)=>{
        if(error){
            res.json({
                message : error,
                error : true
            })
        }else{
            res.json({
                message : row.affectedRows ?  "Delete successfully" : "Data not in System!",
                list : row
            })
        }
    })
}


module.exports = {
    getlist,
    getlistone,
    create,
    update,
    remove
}