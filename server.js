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

// html routes
app.get("/", (req, res) => 
    res.sendFile(path.join(__dirname, "./public/index.html"))
);

app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, './public/notes.html'));
});

// catch all for get request not defined
// app.get("*", (req, res) => {
//     res.sendFile(path.join(__dirname, "/public/index.html"))
// });

// API routes - get request for all notes
app.get("/api/notes", (req, res) => {
    res.sendFile(path.join(__dirname, "./db/db.json"));
});

// API routes - get request for a single note
app.get("/api/notes/:id", (req, res) => {
    const noteId = req.params.id;
    for (let i = 0; i < notes.length; i++) {
        const currentNote = notes[i];
        if (currentNote.id === noteId) {
            res.json(currentNote);
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
        id: uniqid()
    };

    // obtain existing notes
    fs.readFile("./db/db.json", "utf8", (err, data) => {
        if (err) {
            console.error(err);
        }

        const parsedNotes = JSON.parse(data);
        parsedNotes.push(newNote);

        // write updated notes back to file
        fs.writeFile(
            path.join(__dirname, "./db/db.json"),
            JSON.stringify(parsedNotes, null, 2),
            (err) => 
                err 
                ? console.error(err) 
                : console.log(`Note has been written to JSON file`)
        );
    });
    const response = {
        status: "success",
        body: newNote
    };
    res.json(response);
});

app.delete("/api/notes/:id", (req, res) => {
    const currentNoteId = req.params.id;

    // obtain existing notes
    fs.readFile("./db/db.json", "utf8", (err, data) => {
        if (err) {
            console.error(err);
        }

        const parsedNotes = JSON.parse(data);
        const updatedNotes = parsedNotes.filter(note => note.id != currentNoteId)

        // write updated notes back to file
        fs.writeFile(
            path.join(__dirname, "./db/db.json"),
            JSON.stringify(updatedNotes, null, 2),
            (err) => 
                err 
                ? console.error(err) 
                : console.log(`Note has been removed from JSON file`)
        );
    });
    res.json(`Note deleted`);
})

//tell server to listen to requests
app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}.`);
})