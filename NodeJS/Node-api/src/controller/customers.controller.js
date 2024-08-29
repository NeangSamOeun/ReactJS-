// const employee = require("../route/employee.route");
const jwt = require("jsonwebtoken")
const database = require("../util/db");
const { isEmptyOneNull, TOKEN_KEY } = require("../util/service");
// const { update } = require("./employee.controller");
const bcrypt = require("bcrypt");
const { getPermissionByCustomer } = require("./auth.controller");


const getcostomer = (req, res) => {
  sql = "SELECT customer_id, firstname, lastname, gender, username, is_active ,create_at FROM customer";
  database.query(sql, (err, row) => {
    if (err) {
      res.json({
        message: err,
        err: true,
      });
    } else {
      res.json({
        message: row,
      });
    }
  });
};

// getOne

const customerOne = (req, res) => {
  var id = req.params.id;
  var sql = "SELECT customer_id, firstname, lastname, gender, username, is_active ,create_at FROM customer WHERE customer_id = ?";
  database.query(sql, [id], (err, row) => {
    if (!err) {
      res.json({
        message: row,
      });
    } else {
      res.json({
        message: err,
        err: true,
      });
    }
  });
};

//--getpermissionbycustomer

//login customer 

const login = async (req ,res) =>{
  var {username , password } = req.body
  var message = {}
  if(isEmptyOneNull(username)){message.username = "Please fill in username!"}
  if(isEmptyOneNull(password)){message.password = "Please fill in password!"}
  if(Object.keys(message).length > 0){
    res.json({
      data : true,
      message : message
    })
    return 
  }
  var user = await database.query("SELECT * FROM customer WHERE username = ?", [username])
  if(user.length){
    var passDb = user[0].password
    //bcrypt password
    var isCorrect = bcrypt.compareSync(password,passDb)
    if(isCorrect){
      var user = user[0]
      delete user.password
      var permission = await getPermissionByCustomer(user.customer_id)
      var obj ={
        user : user,
        permission : permission,
        token : ""
      }
      // const KEY_TOKEN = "lLEJDEIRNCUEHREUCVE)@#$)FKWRUJD@#!FW@3WEW_WEW@3%^WEWEWE"
      var access_token = jwt.sign({data :{...obj}},TOKEN_KEY,{expiresIn:"1h"}) 
      res.json({
        ...obj,
        access_token : access_token
      })
    }else{
      res.json({
        message : "Password incorrect!",
        err : true
      })
    }
  }else{
    res.json({
      message : "Acount deosn't exist!. Please goto register!",
      err : true
    })
  }
}

// create

const customerCreate = (req, res) => {
  //------
  database.beginTransaction()
  //----------
  var {
    username,
    password,
    firstname,
    lastname,
    gender,
    province_id,
    address_des,
  } = req.body;
  
  var message = {};
  if (isEmptyOneNull(username)) { message.username = "username required!"}
  if (isEmptyOneNull(password)) {message.password = "password required!"}
  if (isEmptyOneNull(firstname)) { message.firstname = "firstname required!" }
  if (isEmptyOneNull(lastname)) {message.lastname = "lastname required!"}
  if (isEmptyOneNull(gender)) { message.gender = "gender required!" }
  if (isEmptyOneNull(province_id)) {message.province_id = "province_id required!"}

  if (Object.keys(message).length > 0) {
    res.json({
      err: true,
      message: message
    });
    return false;
  }

  //  var sql = "INSERT INTO employee (`fistname`, `lastname`, `tel`, `email`, `base_salary`, `address`, `province`, `country`) VALUES (?, ?, ?, ?, ?, ?, ?, ?)"
  // var data_params = [fistname,lastname,tel,email,base_salary,address,province,country,]
  
    var sqlFind = "SELECT customer_id FROM customer WHERE username = ?";
    database.query(sqlFind,[username], (error1, result1) => {
        if (result1.length > 0) {
            res.json({
                error: true,
                message: "Account already exist!",
            });
            return false;
        } else {
          //bcrypt password
            password = bcrypt.hashSync(password, 10);
            var sqlCustomer = "INSERT INTO customer (firstname, lastname, gender, username, password) VALUES (?, ?, ?, ?, ?)";
            var paramCustomer = [firstname, lastname, gender, username, password];
            database.query(sqlCustomer, paramCustomer, (error2, result2) => {
        if (!error2) {
            var sqlCustomerAdd = "INSERT INTO customer_address (customer_id, province_id, firstname, lastname, tel, address_des) VALUES (?, ?, ?, ?, ?, ?)";
            var paramCustomerAdd = [result2.insertId, province_id, firstname, lastname, username, address_des];
            database.query(sqlCustomerAdd, paramCustomerAdd,(error3, result3) => {
              if(!error3){
                res.json({
                    message: "account created!",
                    data: result3,
                });
                //-----
                database.commit()
                    } else {
                      //rollback error
                      database.rollback()
                        res.json({
                            error: true,
                            message: error3,
                            });
                        }
                    });
                }
            });
        }
    })
};

// update

// username,
// password,
// // firstname,
// lastname,
// gender,
// province_id,
// email = ?, base_salary = ?, address = ?, province = ?, country = ?

const customerUpdat = (req, res) => { //update profile
  var {
    // username,
    customer_id,
    firstname,
    lastname,
    gender,
    // tel,
  } = req.body;

  var message = {}
  if (isEmptyOneNull(firstname)) { message.firstname = "firstname required!"}
  if (isEmptyOneNull(lastname)) { message.lastname = "lastname required!"}
  if (isEmptyOneNull(gender)) { message.gender = "gender required!"}

  if(Object.keys(message).length > 0){
    res.json({
      err : true ,
      message : message
    })
    return;
  }


  var sql ="UPDATE customer SET firstname = ?, lastname = ?, gender= ? WHERE customer_id = ?";
  var data_params = [
    firstname,
    lastname,
    gender,
    customer_id,
    // email,
    // base_salary,
    // address,
    // province,
    // country,
    // employee_id,
  ];

  database.query(sql, data_params, (err, row) => {
    if (!err) {
      res.json({
        alert: "Updata Seccessfully!",
        message: row,
      });
    } else {
      res.json({
        message: err,
        err: true,
      });
    }
  });
};

// delete

const customerRemove = (req, res) => {
  // var sql = "DELETE FROM customer WHERE customer_id = ?";
  // var id = req.params.id;
  var sqls = "UPDATE customer SET is_active = 1 WHERE customer_id = ?"
  database.query(sqls,[req.params.id], (err, row) => {
    if (!err) {
      res.json({
        message: (row.affectedRows) ? "Delete Susseccfully!" : "Data not in system",
        data: row,
      });
    } else {
      res.json({
        err: true,
        message: err
      });
    }
  });
};


//customer address

const listAddress = (req, res) =>{
  var {
    customer_id
  } = req.body
  var sql = "SELECT * FROM customer_address WHERE customer_id = ?"
  database.query(sql,[customer_id],(err,row)=>{
    if(!err){
      res.json({
        list : row
      })
    }
  })
}

const listOneAddress = (req, res) =>{
  var {
    customer_id
  }= req.params
  var sql = "SELECT * FROM customer_address WHERE address_id = ?"
  database.query(sql,[customer_id],(err,row)=>{
    if(!err){
      res.json({
        list : row
      })
    }
  })
}

const newAddress = (req, res)=>{
  var {
    customer_id,
    firstname,
    lastname,
    tel,
    province_id,
    address_des
  } = req.body
  var message = {}

  if(isEmptyOneNull(customer_id)){message.customer_id = "customer_id required!"}
  if(isEmptyOneNull(firstname)){message.firstname = "firstname required!"}
  if(isEmptyOneNull(lastname)){message.lastname = "lastname required!"}
  if(isEmptyOneNull(tel)){message.tel = "tel required!"}
  if(isEmptyOneNull(province_id)){message.province_id = "provice_id required!"}
  if(isEmptyOneNull(address_des)){message.address_des = "address_des reqired!"}

  if(Object.keys(message).length > 0){
    res.json({
      err : true, 
      message : message
    })
    return
  }

  var sql = "INSERT INTO customer_address (customer_id, province_id, firstname, lastname, tel, address_des) VALUES (?, ?, ?, ?, ?, ?)"
  var params = [customer_id, province_id, firstname, lastname, tel, address_des]
  database.query(sql,params,(err,row)=>{
    if(!err){
      res.json({
        message: (row.affectedRows) ? "Create successfully!" : "Data not in system!",
        data :row
      })
    }else{
      res.json({
        err : true,
        message : err
      })
    }
  })
}
//update address
const updateAddress = (req, res)=>{
  var {
    address_id,
    customer_id,
    firstname,
    lastname,
    tel,
    province_id,
    address_des
  } = req.body
  var message = {}

  if(isEmptyOneNull(address_id)){message.address_id = "address_id required!"}
  if(isEmptyOneNull(customer_id)){message.customer_id = "customer_id required!"}
  if(isEmptyOneNull(firstname)){message.firstname = "firstname required!"}
  if(isEmptyOneNull(lastname)){message.lastname = "lastname required!"}
  if(isEmptyOneNull(tel)){message.tel = "tel required!"}
  if(isEmptyOneNull(province_id)){message.province_id = "provice_id required!"}
  if(isEmptyOneNull(address_des)){message.address_des = "address_des reqired!"}

  if(Object.keys(message).length > 0){
    res.json({
      err : true, 
      message : message
    })
    return
  }

  var sql = "UPDATA customer_address SET customer_id =?, province_id =?, firstname =?, lastname =?, tel =?, address_des=? WHERE address_id=?"
  var params = [customer_id, province_id, firstname, lastname, tel, address_des, address_id]
  database.query(sql,params,(err,row)=>{
    if(!err){
      res.json({
        message: (row.affectedRows) ? "Update successfully!" : "Data is not in the update!",
        data :row
      })
    }else{
      res.json({
        err : true,
        message : err
      })
    }
  })
}



//remove tabledata
const removeAddress = (req, res)=>{
  var {
    customer_id
  } = req.params
  var sql = "DELETE FROM customer_address WHERE address_id = ?"
  database.query(sql,[customer_id],(err,row)=>{
    if(!err){
      res.json({
        message : row.affectedRows ? "Delete success!" : "Data not is system!",
        list : row
      })
    }
  })
}


module.exports = {
  getcostomer,
  customerOne,
  customerCreate,
  customerUpdat,
  customerRemove,
  listAddress,
  listOneAddress,
  newAddress,
  updateAddress,
  removeAddress,
  login,
  getPermissionByCustomer
};
