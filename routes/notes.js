const notesRouter = require("express").Router();
const { v4: uuidv4 } = require("uuid");
const fs = require("fs");
const util = require("util");
// Promise version of fs.readFile
const readFromFile = util.promisify(fs.readFile);

notesRouter.get("/", (req, res) => {
    readFromFile("./db/db.json").then((data) => res.json(JSON.parse(data)));
});

notesRouter.post("/", (req, res) => {
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

notesRouter.delete("/:id", (req, res) => {
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

module.exports = notesRouter;
