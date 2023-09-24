const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const PORT = process.env.PORT || 3000;
const app = express();

// middlewares
app.use(cors());
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: true}));
app.use(express.json());



app.listen(PORT, () => {
    console.log(" this app runs on port 3000");
})


app.get('/', (req, res) => {
    res.send("Yup, this runs on port 3k")
})