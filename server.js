
var express = require("express");
var path = require("path");
var fs = require("fs");
var crypto = require("crypto");
var util = require("util");
var app = express();
var PORT = process.env.PORT || 8080;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(__dirname + "/public"));


let globalSavedNotes = util.promisify(fs.readFile);
function retrieveSavedNotes() {
  
  return (savedNotes = globalSavedNotes("./db/db.json", "utf8"));
}

app.get("/api/notes", (req, res) => {
  retrieveSavedNotes()
    .then((savedNotes) => {
      
      res.send(JSON.parse(savedNotes));
    })
    .catch((err) => res.status(500).json(err));
});

app.post("/api/notes", (req, res) => {
  
  let savedNotes = JSON.parse(fs.readFileSync("./db/db.json", "utf8"));
  
  let id = crypto.randomBytes(16).toString("hex");
  let newNote = {
    title: req.body.title,
    text: req.body.text,
    id: id,
  };

  savedNotes.push(newNote);
 
  fs.writeFileSync("./db/db.json", JSON.stringify(savedNotes), (err) => {
    if (err) throw err;
    
  });

  
  return res.json(savedNotes);
});


app.delete("/api/notes/:id", (req, res) => {
  let savedNotes = JSON.parse(fs.readFileSync("./db/db.json", "utf8"));
  
  let noteID = savedNotes.filter((x) => x.id != req.params.id);
 
  fs.writeFileSync("./db/db.json", JSON.stringify(noteID), (err) => {
    if (err) throw err;
    
  });
  
  return res.json(savedNotes);
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "/public/index.html"));
});

app.listen(PORT, () => {
  console.log("App is listening on PORT:" + PORT);
});
