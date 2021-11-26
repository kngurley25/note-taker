const express = require("express");

//instantiate the server
const app = express();

const PORT = process.env.PORT || 3001;




//tell server to listen to requests
app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}.`);
})