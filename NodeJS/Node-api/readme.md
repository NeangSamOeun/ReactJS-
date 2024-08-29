
const express = require('express')
const app = express()

app.use(express.json())

app.get("/",(req,res)=>{
    // console.log("Hello")
    res.send("Home")
})

// app.post("/",(req,res)=>{
//     console.log(req.body)
//     res.send("test req object")
// })

app.get("/api/product",(req,res)=>{
    res.send("Your request /api/peoduct")
})

// req object 
app.get("/test_req_object",(req,res)=>{
    console.log(req.originalUrl)
    console.log(req.protocol)
    console.log(req.path)
    console.log(req.subdomains)
    console.log(req.ip)
    console.log(req.baseUrl)
    res.send("test req object")
})

//rep.query
app.get("/api/user",(req,res)=>{
    res.json({
        data : req.query
    })
})

// req.param
app.get("/api/product/:id",(req,res)=>{
    res.json({
        data : req.params
    })
})
// get.body
app.get("/api/cotegory",(req,res)=>{
    res.json({
        data : req.body
    })
})

// method get ,post ,put ,delete ,http method

app.get("/api/costomer",(req,res)=>{
    res.json({
        message : "method get"
    })
})

app.post("/api/costomer",(req,res)=>{
    res.json({
        message : "method post"
    })
})

app.put("/api/costomer",(req,res)=>{
    res.json({
        message : "method pus"
    })
})

app.delete("/api/costomer", (req,res)=>{
    res.json({
        message : "method delete"
    })
})

app.listen(8081,()=>{
    console.log("run : 8081")
})




app.get("/employee",(req,res)=>{
    var base_salary = req.query.base_salary
    var province = req.query.province
    var sql= ("SELECT * FROM employee WHERE province = ? OR base_salary = ?")
    database.query(sql,[province,base_salary],(err,row)=>{
        if(err){
            res.json({
                message:err,
            })
        }else{
            res.json({
                list:row,
                // id:id
            })
        }
    })
})





customer // one
    customer_id //PK
    firstname
    lastname
    gender
    username
    password
    is_active
    create_at

customer_address // mony
    address_id //PK
    customer_id //FK
    province_id //FK
    firstname 
    lastname
    tel
    address_des
     

provice
    province_id // PK
    name
    description
    date_modified
    date_addes

product
    product_id //KP
    category_id //FK
    barcode
    name
    quantity
    price
    image
    description
    is_active
    create_at
    create_by
product_image
    product_image_id Pk
    product_id
    image
    is_active

cart
    cart_id Pk
    customer_id FK
    product_id Fk  
    create_at



1 - install mysql
2 - install util