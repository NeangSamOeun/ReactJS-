const { TOKEN_KEY } = require("../util/service");
const jwt = require("jsonwebtoken");
const database = require("../util/db");

exports.userGuard = (paramerter) => {
  return (req, res, next) => {
    var authorization = req.headers.authorization;
    var token_from_client = null;
    if (authorization != null && authorization != "") {
      token_from_client = authorization.split(" ");
      token_from_client = token_from_client[1];
    }
    if (token_from_client == null) {
      res.status(401).send({
        message: "Unauthorized",
      });
    } else {
      jwt.verify(token_from_client, TOKEN_KEY, (error, result) => {
        if (error) {
          res.status(401).send({
            message: "Unauthorized",
            error: error,
          });
        } else {
          //check is permission
          var permission = result.data.permission; // get permission array from verify token
          req.user = result.data;
          req.user_id = result.data.user.customer_id;
          if(paramerter == null){
            next();
          }else if (permission.includes(paramerter)){
            next();
          }else{
            res.status(401).send({
              message: "Unauthorized",
            });
          }
        }
      })
    }
  }
}
// userGuardV1
exports.userGuardV1 = (req, res, next) => {
  var authorization = req.headers.authorization;
  var token_from_client = null;
  if (authorization != null && authorization != "") {
    token_from_client = authorization.split(" ");
    token_from_client = token_from_client[1];
  }
  if (token_from_client == null) {
    res.status(401).send({
      message: "Unauthorized",
    });
  } else {
    jwt.verify(token_from_client, TOKEN_KEY, (error, result) => {
      if (error) {
        res.status(401).send({
          message: "Unauthorized",
        });
      } else {
        //check is permission
        var permission = result.data.permission; // get permission array from verify token

        req.user = result.data;
        req.user_id = result.data.user.customer_id;
        next();
      }
    });
  }
};
exports.getPermissionByCustomer = async (id) => {
  var sql =
    " SELECT " +
    " p.code " +
    " FROM employee c " +
    " INNER JOIN role r ON  c.role_id = r.role_id " +
    " INNER JOIN role_permission rp ON r.role_id = rp.role_id " +
    " INNER JOIN permission p ON rp.permission_id = p.permission_id " +
    " WHERE c.employee_id = ?";
  var list = await database.query(sql, [id]);
  var tmp = [];
  list.map((item, index) => {
    tmp.push(item.code);
  });
  return tmp;
};
