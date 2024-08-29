const database = require("../util/db");
const { isEmptyOneNull, invoiceNumber } = require("../util/service");

const getnerateInvoiceNo = async () => {
  const data = database.query(" SELECT MAX(order_id) AS id FROM `order`; ");
  return invoiceNumber();
};

const getAll = async (req, res) => {
  const list = await database.query("SELECT * FROM `order`");
  res.json({
    data: list,
    // number : await getnerateInvoiceNo()
  });
};
const getOne = async (req, res) => {
  var sql = "SELECT * FROM `order` WHERE order_id = ?";
  var id = req.params.id;
  const list = await database.query(sql, [id]);
  res.json({
    data: list,
  });
};

const getOrderBycustomer = async (req, res) => {
  const { customer_id } = req.body;
  const sql = "SELCT * FROM order WHERE customer_id = ?";
  const list = await database.query(sql, [customer_id]);
  res.json({
    data: list,
  });
};
// customer_id	,
// order_status_id	,
// payment_methode_id	,
// invvoice_no	,
// order_total	,
// comment	,
// firstname	,
// lastname	,
// telelphone,
// address_des

const create = async (req, res) => {
  try {
    database.beginTransaction();
    var {
      customer_id,
      customer_address_id,
      payment_methode_id,
      order_total,
      comment,
    } = req.body;

    var message = {};
    if (isEmptyOneNull(customer_id)) {
      message.customer_id = "customer_id required!";
    }
    if (isEmptyOneNull(customer_address_id)) {
      message.customer_address_id = "address_id required!";
    }
    if (isEmptyOneNull(payment_methode_id)) {
      message.payment_methode_id = "payment_method_id required!";
    }

    if (Object.keys(message).length > 0) {
      res.json({
        message: message,
        error: true,
      });
      return 0;
    }

    // find address
    var address = await database.query(
      " SELECT * FROM `customer_address` WHERE customer_address_id = ?",
      [customer_address_id]
    );

    // address = address[0]
    if (address.length > 0) {
      const { firstname, lastname, tel, address_des } = address[0];
      if (address?.length > 0) {
        //find total order by customer
        var cart = await database.query(
          "SELECT c.*, p.price FROM cart c INNER JOIN product p ON c.product_id = p.product_id WHERE c.customer_id = ?;",
          [customer_id]
        );

        //find total amount base from cart by customer
        var order_total = 0;
        cart.map((item, index) => {
          order_total += item.quantity * item.price;
        });

        var order_status_id = 1; //padding
        var inv_no = await getnerateInvoiceNo();
        var sql =
          "INSERT INTO `order` (customer_id, payment_methode_id, inv_no, order_status_id, comment, order_total, firstname, lastname, tel, address_des) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        // var sql = "INSERT INTO `order` (customer_id, payment_methode_id, inv_no, order_status_id, comment, order_total, firstname, lastname, tel, address_des) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);"
        var param = [
          customer_id,
          payment_methode_id,
          inv_no,
          order_status_id,
          comment,
          order_total,
          firstname,
          lastname,
          tel,
          address_des,
        ];
        const order = await database.query(sql, param);

        //insert order detail
        cart.map(async (item, index) => {
          var sqlorderDetails ="INSERT INTO order_detail (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?);";
          var sqlorderDetailsParam = [
            order.insertId,
            item.product_id,
            item.quantity,
            item.price,
          ];
          const order_detail = await database.query(
            sqlorderDetails,
            sqlorderDetailsParam
          );

          //cut stock
          var sqlProduct ="UPDATE product SET quantity = (quantity-?) WHERE product_id = ?";
          var updateProduct = await database.query(sqlProduct, [
            item.quantity,
            item.product_id,
          ]);
        });

        // clear cart by customer
        await database.query("SELECT * FROM cart WHERE customer_id = ?;", [
          customer_id,
        ]);

        res.json({
          message: "Your order has been successfully!",
          data: order,
        });
        database.commit();
      } else {
        res.jaon({
          message: "You have cart is empty",
          data: true,
        });
      }
    } else {
      res.json({
        error: true,
        message: "Please select your address!",
      });
    }
  } catch (e) {
    database.rollback();
    res.json({
      message: e,
      data: true,
    });
  }
};

//update
const update = async (req, res) => {};

//remove
const remove = async (req, res) => {};

module.exports = {
  getAll,
  getOne,
  create,
  update,
  remove,
  getOrderBycustomer,
  getnerateInvoiceNo,
};
