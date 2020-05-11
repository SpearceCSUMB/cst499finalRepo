const express = require("express");
const app = express();

app.set('view engine', 'ejs');
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

// root route
app.get("/", function(req, res) {
    res.render("index.ejs");
});

app.get("/game-stage", function(req, res) {
    res.render("demot.html")
});

// // server listening
app.listen(3000, () => {
    console.log('Example app listening on port 3000!')
});


//app.listen(process.env.PORT, process.env.IP, function() {
//    console.log("Running Express Server...")
//});