const express = require("express");
const fs = require("fs");
const path = require("path");
const notes = require("./db/db.json");
const uniqid = require("uniqid");

// instantiate the server
const app = express();
const PORT = process.env.PORT || 3001;

// middleware to parse incoming data
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static("public"));

// get home html page
app.get("/", (req, res) => 
    res.sendFile(path.join(__dirname, "/public/index.html"))
);

// get notes html page 
app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, './public/notes.html'));
});

// catch all for get request not defined
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "/public/index.html"))
});

// get request for all notes
app.get("/api/notes", (req, res) => {
    res.json(notes);
});

// get request for a single note
app.get("/api/notes/:note_id", (req, res) => {
    if (!req.body || !req.params.note_id) {
        res.json("Note not found");
    }
    const noteId = req.params.note_id;
    for (let i = 0; i < notes.length; i++) {
        const currentNote = notes[i];
        if (currentNote.note_id === noteId) {
            res.json(noteId);
            return;
        }
    }
})

app.post("/api/notes", (req, res) => {
    
    // destructure items in request body
    const { title, text } = req.body;
    if (!title || !text) {
        res.json("Error in posting note");
    };
    // new object to save
    const newNote = {
        title, 
        text,
        noted_id: uniqid()
    };
    // obtain existing notes
    fs.readFile("./db/db.json", "utf8", (err, data) => {
        if (err) {
            console.error(err);
        }

        // add new note
        const parsedNotes = JSON.parse(data);
        parsedNotes.push(newNote);

        // write updated notes back to file
        fs.writeFileSync(
            path.join(__dirname, "./db/db.json"),
            JSON.stringify(parsedNotes, null, 2),
            (err) => 
                err 
                ? console.error(err) 
                : console.log(`Note has been written to JSON file`)
        )
    });
    const response = {
        status: "success",
        body: newNote
    };
    res.json(response);
});

//tell server to listen to requests
app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}.`);
})