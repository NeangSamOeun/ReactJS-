const db = require("../util/db");
const { isEmptyOneNull, TOKEN_KEY, REFRESH_KEY } = require("../util/service");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { getPermissionByCustomer } = require("./auth.controller");

const getAll = (req, res) => {
  var sql = "SELECT * FROM  employee WHERE employee_id OR tel";
  db.query(sql, (err, row) => {
    if (err) {
      res.json({
        message: err,
        err: true,
      });
    } else {
      res.json({
        list: row,
      });
    }
  });
};

const getOne = (req, res) => {
  var id = req.params.id;
  var sql = "SELECT * FROM employee WHERE employee_id = ?";
  db.query(sql, [id], (err, row) => {
    if (err) {
      res.json({
        message: err,
        err: true,
      });
    } else {
      res.json({
        list: row,
      });
    }
  });
};
// create

const create = (req, res) => {
  var {
    fistname,
    lastname,
    tel,
    email,
    base_salary,
    address,
    province,
    country,
  } = req.body;

  // check which field require

  var message = {};

  if (isEmptyOneNull(fistname)) {
    message.fistname = "fistname required!";
  }
  if (isEmptyOneNull(lastname)) {
    message.lastname = "Lastname required!";
  }

  if (Object.keys(message).length > 0) {
    res.json({
      err: true,
      message: message,
    });
    return;
  }

  var sql =
    "INSERT INTO employee (`fistname`, `lastname`, `tel`, `email`, `base_salary`, `address`, `province`, `country`) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
  var param_data = [
    fistname,
    lastname,
    tel,
    email,
    base_salary,
    address,
    province,
    country,
  ];
  db.query(sql, param_data, (err, row) => {
    if (err) {
      res.json({
        err: true,
        message: err,
      });
    } else {
      res.json({
        message: "Employee create successfully!",
        list: row,
      });
    }
  });
};
//login employee
const login = async (req, res) => {
  var { username, password } = req.body;
  var message = {};
  if (isEmptyOneNull(username)) {
    message.username = "Please fill in username!";
  }
  if (isEmptyOneNull(password)) {
    message.password = "Please fill in password!";
  }
  if (Object.keys(message).length > 0) {
    res.json({
      data: true,
      message: message,
    });
    return;
  }
  var user = await db.query("SELECT * FROM employee WHERE tel = ?", [username]);
  if (user.length > 0) {
    var passDb = user[0].password;
    //bcrypt password
    var isCorrect = bcrypt.compareSync(password, passDb);
    if (isCorrect) {
      var user = user[0];
      delete user.password;
      var permission = await getPermissionByCustomer(user.employee_id);
      var obj = {
        user: user,
        permission: permission,
        // token : ""
      };
      // const KEY_TOKEN = "lLEJDEIRNCUEHREUCVE)@#$)FKWRUJD@#!FW@3WEW_WEW@3%^WEWEWE"
      var access_token = jwt.sign({ data: { ...obj } }, TOKEN_KEY, {
        expiresIn: "1h",
      });
      var refresh_token = jwt.sign({ data: { ...obj } }, REFRESH_KEY);
      res.json({
        ...obj,
        access_token: access_token,
        refresh_token: refresh_token,
      });
    } else {
      res.json({
        message: "Password incorrect!",
        err: true,
      });
    }
  } else {
    res.json({
      message: "Acount deosn't exist!. Please goto register!",
      err: true,
    });
  }
};

const refreshToken = async (req, res) => {
  var { refresh_key } = req.body;
  if (isEmptyOneNull(refresh_key)) {
    res.status(401).send({
      message: "Unauthorized",
    });
  } else {
    jwt.verify(refresh_key, REFRESH_KEY, async (error, result) => {
      if (error) {
        res.status(401).send({
          message: "Unauthorized",
          error: error,
        });
      } else {
        //------
        var username = result.data.user.tel
        var user = await db.query("SELECT * FROM employee WHERE tel = ?", [username])
        var user = user[0];
        delete user.password;
        var permission = await getPermissionByCustomer(user.employee_id);
        var obj = {
          user: user,
          permission: permission,
          // token : ""
        };
        // const KEY_TOKEN = "lLEJDEIRNCUEHREUCVE)@#$)FKWRUJD@#!FW@3WEW_WEW@3%^WEWEWE"
        var access_token = jwt.sign({ data: { ...obj } }, TOKEN_KEY, {expiresIn: "1h"});
        var refresh_token = jwt.sign({ data: { ...obj } }, REFRESH_KEY);
        res.json({
          ...obj,
          access_token: access_token,
          refresh_token: refresh_token,
        });
        // res.json({
        //   data_after_refresh: result,
        // });
      }
    });
  }
};

//setpassword
const setPassword = async (req, res) => {
  var { username, password } = req.body;

  var message = {};
  if (isEmptyOneNull(username)) {
    message.username = "Please fill in username!";
  }
  if (isEmptyOneNull(password)) {
    message.password = "Please fill in Password!";
  }
  if (Object.keys(message).length > 0) {
    res.json({
      error: true,
      message: message,
    });
    return;
  }
  var employee = await db.query("SELECT * FROM employee WHERE tel = ?", [
    username,
  ]);
  if (employee.length) {
    var passwordGenerate = bcrypt.hashSync(password, 10);
    var update = await db.query(
      "UPDATE employee SET password = ? WHERE tel = ?",
      [passwordGenerate, username]
    );
    res.json({
      message: "Update password!",
      data: update,
    });
  } else {
    res.json({
      message: "Acount deosn't exist!. Please goto register!",
      err: true,
    });
  }
};

//update

const update = (req, res) => {
  var {
    employee_id,
    fistname,
    lastname,
    tel,
    email,
    base_salary,
    address,
    province,
    country,
  } = req.body;

  var sql =
    "UPDATE employee SET  fistname=?, lastname=?, tel=?, email=?, base_salary=?, address=?, province=?, country=? WHERE  employee_id=?";
  var param_sql = [
    fistname,
    lastname,
    tel,
    email,
    base_salary,
    address,
    province,
    country,
    employee_id,
  ];
  db.query(sql, param_sql, (err, row) => {
    if (err) {
      res.json({
        err: true,
        message: err,
      });
    } else {
      res.json({
        message: "Update seccessfully!",
        date: row,
      });
    }
  });
};

//delete

const remove = (req, res) => {
  var id = req.params.id;
  var sql = "DELETE FROM employee WHERE employee_id = ?";
  db.query(sql, [id], (err, row) => {
    if (!err) {
      res.json({
        message: row.affectedRows
          ? "Delete Successfully!"
          : "Data not in System",
        data: row,
      });
    } else {
      res.json({
        message: err,
        err: true,
      });
    }
  });
};

module.exports = {
  getAll,
  getOne,
  create,
  update,
  remove,
  login,
  setPassword,
  refreshToken,
};
