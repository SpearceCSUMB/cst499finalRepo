const request = require('request');
const mysql = require('mysql');
const bcrypt = require('bcrypt')
const tools = require("./tools.js")
const session = require('express-session')

module.exports = {
  
  //TODO: validate the admin session
 addAircraft: function(req, res) {
   //Get the parameters from the request
   var year = req.body.year;
   var manufacturer = req.body.manufacturer;   
   var model = req.body.model;
   var price = req.body.price;
   var serialNumber = req.body.serialNumber;
   var totalTime = req.body.totalTime;
   var engineType = req.body.engineType;
   var smoh = req.body.smoh;
   var inspection = req.body.inspection;  
   var numberSeats = req.body.numberSeats;
   var imageURL = req.body.imageURL;

   
   var sqlParams = [
     year,manufacturer,model,price,serialNumber,totalTime,
     engineType,smoh,inspection,numberSeats,imageURL     
   ] ;
   var sql = "INSERT INTO aircraft (year,manufacturer,model,price," + 
       "serialNumber,totalTime,engineType,smoh,inspection,numberSeats,imageURL) " +
       "VALUES(?,?,?,?,?,?,?,?,?,?,?)";
   var conn = tools.createConnection();
   conn.connect(function(err) {
     
        if(err) 
          throw(err);
     console.log("connected.");
        conn.query(sql,sqlParams,function(err,results) {
          if(err)
            console.log(err);
          return res.redirect('/adminList');
        });
    });
   
   // push them to the db
 },

//   Update Aircraft
 updateAircraft: function(req, res) {
   //Get the parameters from the request
   var id = req.body.form;
   var year = req.body.year;
   var manufacturer = req.body.manufacturer;   
   var model = req.body.model;
   var price = req.body.price;
   var serialNumber = req.body.serialNumber;
   var totalTime = req.body.totalTime;
   var engineType = req.body.engineType;
   var smoh = req.body.smoh;
   var inspection = req.body.inspection;  
   var numberSeats = req.body.numberSeats;
   var imageURL = req.body.imageURL;

   
   var sqlParams = [
     year,manufacturer,model,price,serialNumber,totalTime,
     engineType,smoh,inspection,numberSeats,imageURL,id     
   ] ;
   var sql = "UPDATE `aircraft` SET `year`=?,`manufacturer`=?,`model`=?,`price`=?,`serialNumber`=?,`totalTime`=?," + "`engineType`=?,`smoh`=?,`inspection`=?,`numberSeats`=?,`imageURL`=? WHERE `id` = ?"
   
   var conn = tools.createConnection();
   conn.connect(function(err) {
     
        if(err) 
          throw(err);
     console.log("connected.");
        conn.query(sql,sqlParams,function(err,results) {
          if(err)
            console.log(err);
          return res.redirect('/adminList');
        });
    });
   
   // push them to the db
 },
  
//   Delete Aircraft
   deleteAircraft: function(req, res) {
   //Get the parameters from the request
   var id = req.body.id;
   
   var sqlParams = id ;
   console.log(sqlParams);
   var sql = "DELETE FROM aircraft WHERE id = ?"
   var conn = tools.createConnection();
   conn.connect(function(err) {
     
        if(err) throw(err);
     console.log("connected.");
       conn.query(sql,sqlParams,function(err,results) {
          if(err) throw err;
            console.log(err);
          res.send("true");
          });
     
    });
   
   // push them to the db
 },
  
userLogin : function(req, res, adminLogin) {
  return new Promise( function(resolve,reject) {
    //Query if the username/password match  
    req.session.isAdmin = false;
    
    var conn = tools.createConnection();
    var sql;
    var sqlParams;
    //We login with username for admin, email for regular users
    if(adminLogin) {
      sql = "SELECT id,firstName,lastName,email,passwordHash,adminUser from users where username=?";
      sqlParams = [req.body.username]
    }
    else {
      sql = "SELECT id,firstName,lastName,email,passwordHash,adminUser from users where email=?";
      sqlParams = [req.body.email]
    }    
    conn.connect(function(err) {     
        if(err) 
          throw(err);
        conn.query(sql,sqlParams,function(err,results) {
          if(err)
            console.log(err);
          if(!results || results.length<1) {
            resolve(false);
            return;
          }
          if(err)
            console.log(err);
          bcrypt.compare(req.body.password, results[0].passwordHash, function(err, res) {
            if(res) {   
              if(adminLogin) {
                if(results[0].adminUser==1) {
                  req.session.isAdmin = true;
                  req.session.firstName = results[0].firstName;
                  req.session.lastName = results[0].lastName;
                  req.session.email = results[0].email;
                  req.session.userid = results[0].id;
                  resolve(true);
                  return;
                }
                else {
                  resolve(false);
                  return;
                }
              }
              req.session.firstName = results[0].firstName;
              req.session.lastName = results[0].lastName;
              req.session.email = results[0].email;
              req.session.userid = results[0].id;
              resolve(true);
            }
            else {
              resolve(false);
            }
          });
        });
    });
    
  });
},
userAlreadyExists: function(email) {
  return new Promise( function(resolve,reject) {
    var conn = tools.createConnection();
    sql = "SELECT id from users where email=?";
    sqlParams = [email];
    conn.connect(function(err) {     
      if(err) 
        throw(err);
      conn.query(sql,sqlParams,function(err,results) {
        if(err)
          console.log(err);
        if(results && results.length<1) {
          resolve(false);
          return;
        }
        else {
          resolve(true);
        }
      });//query
    });//connect
    
  });//Promise
},

createUser: function(firstName,lastName,email,password,agreeSpam) {
  return new Promise( function(resolve,reject) {
    var conn = tools.createConnection();

    sql = "INSERT INTO `users` (`firstName`, `lastName`, `agreeSpam`, `username`, `email`, `passwordHash`,`adminUser`) VALUES" + 
          "(?,?,?,'',?,?,0)";
    //Hash the password
    var passwordHash = bcrypt.hashSync(password,10);
    if(!agreeSpam) 
      agreeSpam = 0;

    sqlParams = [firstName,lastName,agreeSpam,email,passwordHash];
    conn.connect(function(err) {     
      if(err) 
        throw(err);
      conn.query(sql,sqlParams,function(err,results) {
        if(err)
          console.log(err);
        if(results && results.length<1) {
          resolve(false);
          return;
        }
        else {
          resolve(true);
        }
      });//query
    });//connect
    
  });//Promise
}

}