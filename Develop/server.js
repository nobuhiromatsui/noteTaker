var express = require("express");
var path = require("path");
var fs = require("fs");

//uuid module : allows giving unique id
var { v4: uuidv4 } = require('uuid');

var app = express();
var PORT = process.env.PORT || 3010;


// Allows to use files under Public and assets folders
// app.use(express.static(__dirname + "/public"));
app.use(express.static('public'));
app.use(express.static('assets'));

// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());



// Routes
// =============================================================

// Basic route that sends the user first to the AJAX Page
app.get("/notes", function (req, res) {
  res.sendFile(path.join(__dirname, "./public/notes.html"));
});

app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, "./public/index.html"));
});
// =============================================================


// create api route
app.get("/api/notes", function (req, res) {
  res.sendFile(path.join(__dirname, "./db/db.json"))
  // return res.json(notes);
});

// Create New notes - takes in JSON input
app.post("/api/notes", function (req, res) {
  // req.body hosts is equal to the JSON post sent from the user
  var newNotes = {
    id: uuidv4(), //create unique id using uuidv4 module
    title: req.body.title,
    text: req.body.text
  }
  // Reading db.json file
  var preNote = JSON.parse(fs.readFileSync(path.join(__dirname, "./db/db.json"), "utf-8"))
  console.log(newNotes);

  // push preNote to newNote array
  preNote.push(newNotes);
  // write data to db.json
  fs.writeFileSync("./db/db.json", JSON.stringify(preNote));
  res.json(preNote);
});


app.delete("/api/notes/:id", function (req, res) {
  //unique id
  var uniqueId = req.params.id;
  console.log(uniqueId);

  var preNote = JSON.parse(fs.readFileSync(path.join(__dirname, "./db/db.json"), "utf-8"))
  var newNote = preNote.filter(item => item.id != uniqueId);

  // write newNote to db.json
  fs.writeFileSync("./db/db.json", JSON.stringify(newNote));

  // reRender newNotes 
  res.send(newNote);
});





app.listen(PORT, function () {
  console.log("App listening on PORT " + PORT);
});