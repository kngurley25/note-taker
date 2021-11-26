const express = require("express");

//instantiate the server
const app = express();
const PORT = process.env.PORT || 3001;

//middleware to parse incoming data
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const { notes } = require("./db/db.json");

//server routes
app.get("/api/notes", (req, res) => {
    res.json(notes);
})

app.post("/api/notes", (req, res) => {
    console.log(req.body);
    res.json(req.body);
})

//tell server to listen to requests
app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}.`);
})