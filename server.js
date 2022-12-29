const express = require("express");
const path = require("path");
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

app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "/public/index.html"));
});

app.listen(PORT, () =>
    console.log(`App listening at http://localhost:${PORT} 🚀`)
);
