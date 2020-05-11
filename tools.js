const request = require('request');
const mysql = require('mysql');

module.exports = {
  // Updated SQL Database Connection
  createConnection: function () {
    var conn = mysql.createConnection({
      host: "35.222.88.211",
      user: "root",
      password: "csumb2020",
      database: "team_final"
    })
    return conn;
  },

  
  //    create session variable
  findSession: function (conn) {
    return new Promise(function (resolve, reject) {
      var sql;
      sql = "SELECT id FROM order_status WHERE status = 'unpaid'";
      conn.connect(function (err) {
        if (err) throw (err);
        conn.query(sql, function (err, results, fields) {
          if (err) throw (err);
          if (results == "") {
            sql = "INSERT INTO order_status (status) Values('unpaid')";
            if (err) throw (err);
            conn.query(sql, function (err, results, fields) {
              if (err) throw (err);
              sql = "SELECT id FROM order_status WHERE status = 'unpaid'";
              conn.query(sql, function (err, results, fields) {
                if (err) throw (err);
                resolve(results[0].id);
              })
            })
          } else {
            resolve(results[0].id);
          }
        })
      })
    })
  },
  getTotal: function (conn, sessionId) {
    return new Promise(function (resolve, reject) {
      var sql = "SELECT SUM(a.price) as total FROM aircraft a, shopping_cart b WHERE b.orderID = ? and b.product_id = a.id";
      var sqlParams = sessionId;
      conn.query(sql, sqlParams, function (err, results, fields) {
        if (err) throw (err);
        resolve(results[0].total);
      })
    })
  }
}
