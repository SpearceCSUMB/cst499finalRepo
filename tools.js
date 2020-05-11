const request = require('request');
const mysql = require('mysql');

module.exports = {

//  createConnection: function() {

//     var conn = mysql.createConnection({
//         host:"cst336.ddns.net", 
//         user: "cst2", 
//         password:"3UaIr2cyEPJD81u", 
//         database: "team_final"});
    
//     return conn;
//  },

  // Updated SQL Database Connection
  createConnection: function() {
        var conn = mysql.createConnection({
            host: "35.222.88.211",
            user: "root",
            password: "csumb2020",
            database: "team_final"
        })
        return conn;
    },
// createConnection: function() {

//     var conn = mysql.createConnection({
//         host:"localhost", 
//         user: "root", 
//         password:"", 
//         database: "team_final"});
    
//     return conn;
// },
// createConnection: function() {

//    var conn = mysql.createConnection({
//     host: "us-cdbr-iron-east-02.cleardb.net",
//     user: "bfc4587d6ac1fc",
//     password: "0aba13ee",
//     database: "heroku_ac67da2a0817b59"
//    })
// //     var conn = mysql.createConnection({
//         host:"localhost", 
//         user: "root", 
//         password:"", 
//         database: "team_final"});
    
//     return conn;
// },
//    create session variable
  findSession: function(conn){
    return new Promise( function(resolve,reject) {
    var sql; 
    sql = "SELECT id FROM order_status WHERE status = 'unpaid'";
    conn.connect(function(err) {
      
      if(err) throw(err);
      
            conn.query(sql, function(err,results,fields) {
              if(err) throw(err);
              if(results == "") {
                sql = "INSERT INTO order_status (status) Values('unpaid')"; 
                  if(err) throw(err);
                 conn.query(sql, function(err,results,fields) {
                  if(err) throw(err);
                  sql = "SELECT id FROM order_status WHERE status = 'unpaid'";  
                  conn.query(sql, function(err,results,fields) {
                  if(err) throw(err);   
                       resolve(results[0].id);
//                     resolve(true);
//                     return(results[0].id);  
                         
                  })
              })
      
    } else {
      
//       resolve(true);
      resolve(results[0].id);
//       return(results[0].id);   
      
    }
      
    }) 
 })}) 
  },


getTotal: function(conn,sessionId){
    return new Promise( function(resolve,reject) {
    var sql = "SELECT SUM(a.price) as total FROM aircraft a, shopping_cart b WHERE b.orderID = ? and b.product_id = a.id";
    var sqlParams = sessionId;
        conn.query(sql, sqlParams, function(err,results,fields) {
              if(err) throw(err);
                   resolve(results[0].total);
       
        
        })//72
        })//70
    
} // 65
                       } //top
                       