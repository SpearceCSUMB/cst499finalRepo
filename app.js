const request = require("request");
const mysql   = require("mysql");
const express   = require("express");
const session   = require("express-session");
const admin = require("./admin.js");
const tools = require("./tools.js")

const app = express();

app.set('view engine', 'ejs');
app.use(express.static("public"));
app.use(express.urlencoded({extended:true}));

app.use(session({
  secret: "nwtech secret",
  resave: true,
  saveUninitialized: true
}));

function buildMenuBar(req) {
    var menuHTML = '<a class="navLink" id="navLinkHome" href="/">Home</a>';
    menuHTML += '<a class="navLink"id="navLinkAircraft" href="/airplaneSearch">Aircraft</a>';
    if(!req.session.authenticated) {
        menuHTML += '<a class="navLink"id="navLinkLogin" href="/userLoginAction">User log in</a>';
        // menuHTML += '<a class="navLink"id="navLinkSignUp" href="/signUp">Create a user account</a>';
    }
    else{
        if(!req.session.isAdmin) {
          menuHTML += '<a class="navLink"id="navPrevOrders" href="/prevOrderSearch">Previous orders</a>';
          menuHTML += '<a class="navLink"id="navLinkLogin" href="/userLogoutAction">Log out</a>';
        }
    }
    
    if(req.session.authenticated && req.session.isAdmin) {
      menuHTML += '<a class="navLink"id="navAdminHome" href="/adminHome">Admin home</a>';
        menuHTML +='<a class="navLink" id="navLinkAdminLogin" href="/adminLogoutAction">Admin log out</a>';
    }
    else{
        menuHTML +='<a class="navLink" id="navLinkAdminLogin" href="/adminLoginAction">Admin log in</a>';
    }

    menuHTML += '<a class="navLink" id="navLinkShoppingCart" href="/cart"><img src="img/shopping_cart.png"></a>';

    return menuHTML;
}

// routes =========================

// root route
app.get("/", function(req, res){
   res.render("index.ejs");
});

app.get("/game-stage", function(req, res) {
  res.render("game-stage.ejs")
});

app.get("/airplaneSearch", async function(req, res){
  
  var conn = tools.createConnection();
  var sql  = "SELECT DISTINCT manufacturer FROM `aircraft` ORDER BY manufacturer";
  var sql2 = "SELECT DISTINCT engineType FROM `aircraft` ORDER BY engineType";
  conn.connect(function(err) {

    if (err) throw err;
    conn.query(sql, function(err, result) {
       if (err) throw err;
       conn.query(sql2, function(err, results) {
         if (err) throw err;
         res.render("airplaneSearch", {"make": result, "engine": results, "menuBarHTML" : buildMenuBar(req)});
       })
    })
  });
}); // airplaneSearch route

app.get("/search", async function(req, res){
  console.log("In /Search")
  let make = req.query.make;
  let engine = req.query.engine;
  let priceStart = req.query.priceStart;
  let priceEnd = req.query.priceEnd;
  let hoursStart = req.query.hoursStart;
  let hoursEnd = req.query.hoursEnd;
  
  console.log("Creating connection");
  let sql = "";
  let conn = tools.createConnection();
  var sId = await tools.findSession(conn);
  
  console.log("Created connection");
//   conn.connect(function(err) {
//     if(err) throw(err);

    // search make -> engine -> price -> hours
    if (make != "" && engine != "" && priceStart != "" && priceEnd != "" && hoursStart != "" && hoursEnd != "") {
      sql  = "SELECT a.*, (SELECT product_id FROM shopping_cart WHERE product_id = a.id and orderID = "+sId+") as inCart FROM aircraft a WHERE manufacturer = '" + make + "' AND engineType = '" + engine + "' AND price BETWEEN " + priceStart + " AND " + priceEnd + " AND totalTime BETWEEN " + hoursStart + " AND " + hoursEnd + "";
    }
    // search make -> engine -> price
    else if (make != "" && engine != "" && priceStart != "" && priceEnd != "") {
      sql  = "SELECT a.*, (SELECT product_id FROM shopping_cart WHERE product_id = a.id and orderID = "+sId+") as inCart FROM aircraft a WHERE manufacturer = '" + make + "' AND engineType = '" + engine + "' AND price BETWEEN " + priceStart + " AND " + priceEnd + "";
    }
    // search make -> engine -> hours
    else if (make != "" && engine != "" && hoursStart != "" && hoursEnd != "") {
      sql  = "SELECT a.*, (SELECT product_id FROM shopping_cart WHERE product_id = a.id and orderID = "+sId+") as inCart FROM aircraft a WHERE manufacturer = '" + make + "' AND engineType = '" + engine + "' AND totalTime BETWEEN " + hoursStart + " AND " + hoursEnd + "";
    } 
    // search make -> price -> hours
    else if (make != "" && priceStart != "" && priceEnd != "" && hoursStart != "" && hoursEnd != "") {
      sql  = "SELECT a.*, (SELECT product_id FROM shopping_cart WHERE product_id = a.id and orderID = "+sId+") as inCart FROM aircraft a WHERE manufacturer = '" + make + "' AND price BETWEEN " + priceStart + " AND " + priceEnd + " AND totalTime BETWEEN " + hoursStart + " AND " + hoursEnd + "";
    }
    // search engine -> price -> hours
    else if (engine != "" && priceStart != "" && priceEnd != "" && hoursStart != "" && hoursEnd != "") {
      sql  = "SELECT a.*, (SELECT product_id FROM shopping_cart WHERE product_id = a.id and orderID = "+sId+") as inCart FROM aircraft a WHERE engineType = '" + engine + "' AND price BETWEEN " + priceStart + " AND " + priceEnd + " AND totalTime BETWEEN " + hoursStart + " AND " + hoursEnd + "";
    }
    // search make -> engine
    else if (make != "" && engine != "") {
      sql  = "SELECT a.*, (SELECT product_id FROM shopping_cart WHERE product_id = a.id and orderID = "+sId+") as inCart FROM aircraft a WHERE manufacturer = '" + make + "' AND engineType = '" + engine + "'";
    }
    // search make -> price
    else if (make != "" && priceStart != "" && priceEnd != "") {
      sql  = "SELECT a.*, (SELECT product_id FROM shopping_cart WHERE product_id = a.id and orderID = "+sId+") as inCart FROM aircraft a WHERE manufacturer = '" + make + "' AND price BETWEEN " + priceStart + " AND " + priceEnd + "";
    }
    // search make -> hours
    else if (make != "" && hoursStart != "" && hoursEnd != "") {
      sql  = "SELECT a.*, (SELECT product_id FROM shopping_cart WHERE product_id = a.id and orderID = "+sId+") as inCart FROM aircraft a WHERE manufacturer = '" + make + "' AND totalTime BETWEEN " + hoursStart + " AND " + hoursEnd + "";
    }
    // search engine -> price
    else if (engine != "" && priceStart != "" && priceEnd != "") {
      sql  = "SELECT a.*, (SELECT product_id FROM shopping_cart WHERE product_id = a.id and orderID = "+sId+") as inCart FROM aircraft a WHERE engineType = '" + engine + "' AND price BETWEEN " + priceStart + " AND " + priceEnd + ""; 
    }
    // search engine -> hours
    else if (engine != "" && hoursStart != "" && hoursEnd != "") {
      sql  = "SELECT a.*, (SELECT product_id FROM shopping_cart WHERE product_id = a.id and orderID = "+sId+") as inCart FROM aircraft a WHERE engineType = '" + engine + "' AND totalTime BETWEEN " + hoursStart + " AND " + hoursEnd + "";
    }
    // search price -> hours
    else if (priceStart != "" && priceEnd != "" && hoursStart != "" && hoursEnd != "") {
      sql  = "SELECT a.*, (SELECT product_id FROM shopping_cart WHERE product_id = a.id and orderID = "+sId+") as inCart FROM aircraft a WHERE price BETWEEN " + priceStart + " AND " + priceEnd + " AND totalTime BETWEEN " + hoursStart + " AND " + hoursEnd + "";
    }
    // search make
    else if (make != "") {
      sql  = "SELECT a.*, (SELECT product_id FROM shopping_cart WHERE product_id = a.id and orderID = "+sId+") as inCart FROM aircraft a WHERE manufacturer = '" + make + "'";
    }
    // search engine
    else if (engine != "") {
      sql  = "SELECT a.*, (SELECT product_id FROM shopping_cart WHERE product_id = a.id and orderID = "+sId+") as inCart FROM aircraft a WHERE engineType = '" + engine + "'";
    }
    // search hours
    else if (hoursStart != "" && hoursEnd != "") {
      sql  = "SELECT a.*, (SELECT product_id FROM shopping_cart WHERE product_id = a.id and orderID = "+sId+") as inCart FROM aircraft a WHERE totalTime BETWEEN " + hoursStart + " AND " + hoursEnd + "";
    }
    // search price
    else if (priceStart != "" && priceEnd != "") {
      sql  = "SELECT a.*, (SELECT product_id FROM shopping_cart WHERE product_id = a.id and orderID = "+sId+") as inCart FROM aircraft a WHERE price BETWEEN " + priceStart + " AND " + priceEnd + "";
    }
    else {
      sql  = "SELECT a.*, (SELECT product_id FROM shopping_cart WHERE product_id = a.id and orderID = "+sId+") as inCart FROM aircraft a ";
    }
      conn.query(sql,function(err,results,fields) {
//         console.log(results)
        if(err) throw(err);
        var columns = [];
        fields.forEach(function(field) {
          columns.push(field.name);
        })
        if (results.length == 0) {
          res.render("results", {"noResults": "Sorry, no results. Please ", "link": "/airplaneSearch", "linkText": " try again.", "rows":results,"columns":columns, "menuBarHTML" : buildMenuBar(req)});
        } 
        else {
        res.render("results", {"noResults": "", "link": "", "linkText": "", "rows":results,"columns":columns, "menuBarHTML" : buildMenuBar(req)});
        }
      });
    
//   });

}); // search route

app.get("/userLoginAction", function(req, res) {
   res.render("login.ejs", {"loginError":"","menuBarHTML" : buildMenuBar(req)});
})

app.get("/adminLogin", function(req, res) {
   res.render("adminLogin.ejs", {"menuBarHTML" : buildMenuBar(req)});
})

app.get("/adminMain", function(req, res) {
  res.render("adminMain.ejs",{"menuBarHTML" : buildMenuBar(req)});
})

app.get("/signUp", function(req, res) {
   res.render("signUp.ejs",{"loginError":"","menuBarHTML" : buildMenuBar(req)});
})

app.get("/adminDash", function(req, res) {
  res.render("adminDash.ejs",{"menuBarHTML" : buildMenuBar(req)});
})

app.get("/orderConfirmation", function(req, res) {
  res.render("orderConfirmation.ejs",{"menuBarHTML" : buildMenuBar(req)});
})

app.get("/termsOfService", function(req, res) {
  res.render("termsOfService.ejs",{"menuBarHTML" : buildMenuBar(req)});
})

app.get("/privacyPolicy", function(req, res) {
  res.render("privacyPolicy.ejs",{"menuBarHTML" : buildMenuBar(req)});
})

app.get("/cart", async function(req, res) {
    var conn = tools.createConnection();
    var sqlParams = await tools.findSession(conn);
    var btnView = 0;
    req.session.orderId = sqlParams;
    var total = await tools.getTotal(conn,sqlParams)
    var sql = "SELECT a.* FROM aircraft a, shopping_cart b WHERE b.orderID = ? and b.product_id = a.id";
    conn.query(sql,sqlParams, function(err,results,fields) { 
      if(err) throw(err);
      var columns = [];
        fields.forEach(function(field) {
        columns.push(field.name);  
      })
         
      
      res.render("shoppingCart.ejs", {"total":total,"buttonView":btnView,"rows":results,"columns":columns,"menuBarHTML" : buildMenuBar(req)});
      })
});

//  Order Confermation 
app.get("/confirmOrder", async function(req, res) {
var conn = tools.createConnection();
var sqlParams = req.session.orderId; 
var sql = "UPDATE order_status SET status = 'paid' WHERE id = ?";  
conn.query(sql,sqlParams, function(err,results,fields) {
      if(err) throw(err);
})
  res.render("orderConfirmation.ejs", {"id":sqlParams,"menuBarHTML" : buildMenuBar(req)});
});

app.post("/prevOrder", async function(req, res) {
    var conn = tools.createConnection();
    var sqlParams = req.body.orderId; 
    var btnView = 1;  
    var total = await tools.getTotal(conn,sqlParams)
    var sql = "SELECT a.* FROM aircraft a, shopping_cart b WHERE b.orderID = ? and b.product_id = a.id";
    conn.query(sql,sqlParams, function(err,results,fields) {
      if(err) throw(err);
      var columns = [];
        fields.forEach(function(field) {
        columns.push(field.name);  
      })
         
      
      res.render("shoppingCart.ejs", {"total":total,"buttonView":btnView,"rows":results,"columns":columns,"menuBarHTML" : buildMenuBar(req)});
      })
});

app.get("/dataEntry", function(req, res) {
//   console.log(req.query.results);
  var results = [{
  id: '',
  year: '',
  manufacturer: '',
  model: '',
  price: '',
  serialNumber: '',
  totalTime: '',
  engineType: '',
  smoh: '',
  inspection: '',
  numberSeats: '',
  imageURL: ''
}]
  console.log(req.query.id);
  
  if(req.session.authenticated && req.session.isAdmin) {
   
    res.render("dataEntry.ejs",{"menuBarHTML" : buildMenuBar(req),"results":results});
  }
  else {
    res.render("adminLogin.ejs", {"loginError":"Sign in as an administrator.","menuBarHTML" : buildMenuBar(req)});
  }
})
// Generate reports from SQL Database
app.post("/api/createReports", async function(req, res) {
  var conn = tools.createConnection();
  var sql = "SELECT cast(AVG(price) AS decimal(10,2)) AS average FROM `aircraft`";
  var sql2 = "SELECT COUNT(ID) AS numberOfAircraft FROM `aircraft`";
  var sql3 = "SELECT COUNT(inspection) AS 'Pass' FROM `aircraft` WHERE `inspection` = 'Pass'";
  var sql4 = "SELECT COUNT(inspection) AS 'Fail' FROM `aircraft` WHERE `inspection` = 'Fail'"
  var elemId = req.body.id;
  conn.connect(function(err) {
    if(err) throw (err);
    if(elemId == 'planes') {
      conn.query(sql2, function(err, result) {
        if(err) throw(err);
        res.send(result);
      })
    } else if (elemId == 'passFail') {
      var paf = [];
      conn.query(sql3, function(err, result) {
        if(err) throw(err);
        result.forEach(function(row) {
          paf.push(row.Pass);
        })
        conn.query(sql4, function(err, result) {
          if(err) throw(err);
          result.forEach(function(row) {
          paf.push(row.Fail);
        })
          res.send(paf);
        })
      })
    } else {
      conn.query(sql, function(err, result) {
        if(err) throw(err);
        res.send(result);
      })
    }
  })
})

// Create order session variable
app.post("/api/cartSession", async function(req, res) {
  var conn = tools.createConnection();      
  req.session.orderId = await tools.findSession(conn),
  res.send("ok");
})
// Add to  Shopping Cart
app.post("/api/addCart", function(req, res) {
// console.log(req);
    var sql;
    var sqlParams = [req.session.orderId,req.body.id];
    var conn = tools.createConnection();
    sql = "INSERT INTO shopping_cart (orderID,product_id) VALUES(?,?)";
    conn.connect(function(err) {
        if(err) throw(err);
            conn.query(sql,sqlParams, function(err,results,fields) {
                if(err) throw(err);
                res.send("ok");
            }) 
    }) 
});

//  Delete From cart
//  Delete Aircraft
app.post("/api/deleteCart", async function(req, res) {
   var id = req.body.id;
   var sqlParams = id ;
   console.log(sqlParams);
   var sql = "DELETE FROM shopping_cart WHERE product_id = ?" 
   var conn = tools.createConnection();
   conn.connect(function(err) {
     
        if(err) throw(err);
     console.log("connected.");
       conn.query(sql,sqlParams,function(err,results) {
          if(err) throw err;
            console.log(err);
          res.send("ok");
          });
     
    });
}); 

// admin add aircraft
app.post("/api/addAircraft", function(req, res) {
  
  
  if(req.session.authenticated) {
    console.log("isAdmin: " + req.session.isAdmin);
    if(req.body.form != '') {
    admin.updateAircraft(req,res);  
    }else{
    admin.addAircraft(req,res);
  }}
  else {
      res.render("adminLogin.ejs", {"loginError":"Incorrect username or password. Try Again.","menuBarHTML" : buildMenuBar(req)});
  }
});

//  Delete Aircraft
app.post("/api/deleteAircraft", async function(req, res) {
   
  if(req.session.authenticated) {
      console.log("isAdmin: " + req.session.isAdmin);
      admin.deleteAircraft(req,res);    
  }
  else {
      res.render("adminLogin.ejs", {"loginError":"Incorrect username or password. Try Again."});
  }
});

// Modify Aircraft
app.get("/modifyAircraft", function(req, res) {
// res.render("dataEntry.ejs");
     if(req.session.authenticated) {
//     res.render("dataEntry.ejs");
    var sql;
    var sqlParams = req.query.id;
    var conn = tools.createConnection();
    sql = "SELECT * from aircraft WHERE id = ?";
    conn.connect(function(err) {
        if(err) throw(err);
            conn.query(sql, sqlParams, function(err,results) {
                if(err) throw(err);
                  res.render("dataEntry.ejs",{"menuBarHTML" : buildMenuBar(req), "results":results});
        });
    });
  }
  else {
    res.render("adminLogin.ejs", {"loginError":"Incorrect username or password. Try Again.","menuBarHTML" : buildMenuBar(req)});
  }
});

//This is a temporary route while the admin login gets worked out.
app.get("/adminList", function(req, res) {
  if(req.session.authenticated) {
    var sql;
    var sqlParams;
    var conn = tools.createConnection();
    sql = "SELECT * from aircraft";
    conn.connect(function(err) {
        if(err) throw(err);
            conn.query(sql,function(err,results,fields) {
                if(err) throw(err);
                var columns = [];
                fields.forEach(function(field) {
                  columns.push(field.name);
                })
                res.render("adminList", {"rows":results,"columns":columns,"menuBarHTML" : buildMenuBar(req)});

        });
    });
  }
  else {
    res.render("adminLogin.ejs", {"loginError":"Incorrect username or password. Try Again.","menuBarHTML" : buildMenuBar(req)});
  }
});

app.get("/adminLoginAction", function(req, res) {
  res.render("adminLogin.ejs", {"loginError":"", "menuBarHTML" : buildMenuBar(req)});
});

app.get("/userLoginAction", function(req, res) {
  res.render("login.ejs", {"loginError":"", "menuBarHTML" : buildMenuBar(req)});
});

app.get("/userLogoutAction", function(req, res) {
    req.session.authenticated = false;
    req.session.isAdmin = false;
    res.render("index.ejs", {"loginError":"", "menuBarHTML" : buildMenuBar(req)});
});

app.get("/adminLogoutAction", function(req, res) {
    req.session.authenticated = false;
    req.session.isAdmin = false;
    res.render("index.ejs", {"loginError":"", "menuBarHTML" : buildMenuBar(req)});
});
  
app.get("/prevOrderSearch", function(req, res) {
  if(req.session.authenticated) {
    res.render("user.ejs",{"menuBarHTML" : buildMenuBar(req)}); 
  }
  else {
    res.render("login.ejs", {"loginError":"Invalid password or user id.","menuBarHTML" : buildMenuBar(req)});
  }
});

app.post("/userAuthenticate", async function(req,res) {
  var loginSuccessful = await admin.userLogin(req,res,false); 
  if(loginSuccessful) {      
    req.session.authenticated = true;
    console.log("User authenticated.");
    //todo: This is a placeholder for the main logged in user page
    res.render("user.ejs",{"menuBarHTML" : buildMenuBar(req)}); 
  }
  else {
      res.render("login.ejs", {"loginError":"Invalid password or email.","menuBarHTML" : buildMenuBar(req)});
    }
});

app.post("/createUser", async function(req,res) {
  var userExists = await admin.userAlreadyExists(req.body.email);
  if(userExists) {
    res.render("signUp.ejs", {"loginError":"This email address already exists.","menuBarHTML" : buildMenuBar(req)});
    return;
  }
  else{
    var userCreated = await admin.createUser(req.body.firstName,
            req.body.lastName,
            req.body.email,
            req.body.password,
            req.body.agreeSpam);
    if(userCreated) {
      res.render("login.ejs", {"loginError":"User account created successfully. You can now login.","menuBarHTML" : buildMenuBar(req)});
    }
    else {
      res.render("signUp.ejs", {"loginError":"Unknown error creating user.","menuBarHTML" : buildMenuBar(req)});
    }
  }
});

function renderAdminMain(req, res) {
  var sql;
  var sqlParams;
  var conn = tools.createConnection();
  sql = "SELECT * from aircraft";
  conn.connect(function(err) {
      if(err) throw(err);
          conn.query(sql,function(err,results,fields) {
              if(err) throw(err);
              var columns = [];
              fields.forEach(function(field) {
                columns.push(field.name);
              })             
              res.render("adminDash", {"rows":results,"columns":columns,"menuBarHTML" : buildMenuBar(req)});
      });
  });
}

app.get("/adminHome", function(req, res) {
  if(req.session.authenticated && req.session.isAdmin) {
    renderAdminMain(req, res);
  }
  else {
    res.render("login.ejs", {"loginError":"Invalid password or user id.","menuBarHTML" : buildMenuBar(req)});
  }
});

app.post("/adminAuthenticate", async function(req,res) {
    var loginSuccessful = await admin.userLogin(req,res,true);  
  
    if(loginSuccessful) {      
      req.session.authenticated = true;
      renderAdminMain(req, res);
    }
  else {
    //todo: render failed login
    res.render("adminLogin.ejs", {"loginError":"Incorrect username or password. Try again.","menuBarHTML" : buildMenuBar(req)});
  }
  
});

// // server listening
app.listen("8081", "0.0.0.0", function(){
   console.log("Running Express Server...")
});


app.listen(process.env.PORT, process.env.IP, function(){
  console.log("Running Express Server...")
});