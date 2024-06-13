require('dotenv').config();
var express = require("express");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(bodyParser.json());
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

// Database Connection
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

var db = mongoose.connection;
db.on('error', (error) => console.error("Error in connecting to the Database:", error));
db.once('open', () => console.log("Connected to Database"));

// Routes
app.post("/add", (req, res) => {
    var { category_select, amount_input, info, date_input } = req.body;

    var data = {
        "Category": category_select,
        "Amount": amount_input,
        "Info": info,
        "Date": date_input
    };
    console.log(data);
    db.collection('users').insertOne(data, (err, collection) => {
        if (err) {
            console.error("Error inserting record:", err);
            return res.status(500).send("Error inserting record");
        }
        console.log("Record Inserted Successfully");
        res.status(200).send("Record Inserted Successfully");
    });
});

app.get("/", (req, res) => {
    res.set({ "Allow-access-Allow-Origin": '*' });
    return res.redirect('index.html');
});

// Start Server
app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
