const express = require("express");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const fs = require("fs");
const util = require("util");
// Promise version of fs.readFile
const readFromFile = util.promisify(fs.readFile);

const PORT = process.env.PORT || 3001;
const app = express();

// middleware for parsing JSON and urlencoded form data
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("./public"));

// GET Route for homepage
app.get("/", (req, res) =>
    res.sendFile(path.join(__dirname, "/public/index.html"))
);

app.get("/notes", (req, res) => {
    res.sendFile(path.join(__dirname, "/public/notes.html"));
});
app.get("/api/notes", (req, res) => {
    readFromFile("./db/db.json").then((data) => res.json(JSON.parse(data)));
});

app.post("/api/notes", (req, res) => {
    readFromFile("./db/db.json")
        .then((data) => JSON.parse(data))
        .then((json) => {
            const notes = json;
            const newNotes = req.body;
            newNotes.id = uuidv4();
            notes.push(newNotes);

            fs.writeFile(
                "./db/db.json",
                JSON.stringify(notes, null, 4),
                (err) =>
                    err
                        ? console.error(err)
                        : console.info(`\nData written to /db/db.json`)
            );
            res.json(notes);
        });
});

app.delete("/api/notes/:id", (req, res) => {
    readFromFile("./db/db.json")
        .then((data) => JSON.parse(data))
        .then((notes) => {
            const deleteNote = notes.filter(
                (noteToDeleted) => noteToDeleted.id !== req.params.id
            );
            fs.writeFile(
                "./db/db.json",
                JSON.stringify(deleteNote, null, 4),
                (err) =>
                    err
                        ? console.error(err)
                        : console.info(`\nData written to /db/db.json`)
            );
            res.json(deleteNote);
        });
});

app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "/public/index.html"));
});

app.listen(PORT, () =>
    console.log(`App listening at http://localhost:${PORT} 🚀`)
);
