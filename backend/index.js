const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/', {
    dbName: 'Fitness_Tracker',
    useNewUrlParser: true,
    useUnifiedTopology: true
}, err => err ? console.log(err) : console.log('Connected to Fitness_Tracker database'));

// mongoose.set('strictQuery', false);

// For backend and express
const express = require('express');
const app = express();
const cors = require("cors");
const bcrypt = require('bcryptjs'); // Import bcryptjs for password hashing
console.log("App listen at port 5000");
app.use(express.json());
app.use(cors());
app.get("/", (req, resp) => {

    resp.send("App is Working");
    // You can check backend is working or not by 
    // entering http://loacalhost:5000

    // If you see App is working means
    // backend working properly
});