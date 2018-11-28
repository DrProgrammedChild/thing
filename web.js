//Made by _programmeKid

//Variables
var express = require("express");
var bodyParser = require("body-parser");
var app = express();

//Express routes
var urlencodedParser = bodyParser.urlencoded({extended: false});
app.use(express.static("client"));

app.get("/",(req,res) => {
	res.sendFile("./client/index.html");
});

app.get("/commands.html",(req,res) => {
	res.sendFile("./client/commands.html");
});

app.get("/about.html",(req,res) => {
	res.sendFile("./client/about.html");
});

//Start server
app.listen(process.env.PORT || 8081);
console.log("Listening on port " + (process.env.PORT || 8081));
