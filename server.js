const express = require(`express`);
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static('public'));
app.get("/notes", function(req, res) {
    res.sendFile(path.join(__dirname, "/public/notes.html"));
   });

   app.get("/api/notes", function(req, res) {
    res.sendFile(path.join(__dirname, "db/db.json"));
});

app.post("/api/notes", function(req, res) {
    let textToSave = JSON.parse(fs.readFileSync("./db/db.json", "utf8"));
    let note = req.body;
    let identifier = (textToSave.length).toString();
    note.id = identifier;
    textToSave.push(note);

    fs.writeFileSync("./db/db.json", JSON.stringify(textToSave));
    console.log("Note saved to db.json. Content: ", note);
    res.json(textToSave);
})

app.get("/api/notes/:id", function(req, res) {
    let savedNotes = JSON.parse(fs.readFileSync("./db/db.json", "utf8"));
    res.json(savedNotes[Number(req.params.id)]);
});
app.delete("/api/notes/:id", function(req, res) {
    let savedNotes = JSON.parse(fs.readFileSync("./db/db.json", "utf8"));
    let noteID = req.params.id;
    let newID = 0;
    console.log(`Deleting note with ID ${noteID}`);
    savedNotes = savedNotes.filter(currNote => {
        return currNote.id != noteID;
    })
    
    for (currNote of savedNotes) {
        currNote.id = newID.toString();
        newID++;
    }

    fs.writeFileSync("./db/db.json", JSON.stringify(savedNotes));
    res.json(savedNotes);
})

  app.get("*", function(req, res) {
    res.sendFile(path.join(__dirname, "/public/index.html"));
   });

   app.listen(PORT, function() {
    console.log("App listening on PORT " + PORT);
  });