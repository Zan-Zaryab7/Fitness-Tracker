const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/', {
    dbName: 'Fitness_Tracker',
    useNewUrlParser: true,
    useUnifiedTopology: true
}, err => err ? console.log(err) : console.log('Connected to Fitness_Tracker database'));

// For backend and express
const bcrypt = require('bcryptjs'); // Import bcryptjs for password hashing
const express = require('express');
const app = express();
const cors = require("cors");
app.use(express.json());
app.use(cors());
app.get("/", (req, resp) => {

    resp.send("App is Working");
    // You can check backend is working or not by 
    // entering http://loacalhost:5000

    // If you see App is working means
    // backend working properly
});

//
//
// Schema for users
const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        default: Date.now,
    },
});
// Model for users
const User = mongoose.model('users', UserSchema);

//
// user signup API Method
app.post("/register", async (req, resp) => {
    const { name, email, password } = req.body;
    try {
        // Check if user already exists (optional, but recommended)
        const userExists = await User.findOne({ email });
        if (userExists) {
            return resp.status(400).json({ message: "User already exists" });
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10); // Salt rounds
        const hashedPassword = await bcrypt.hash(password, salt); // Hash the password

        // Create new user
        const newUser = new User({
            name,
            email,
            password: hashedPassword,  // Save hashed password
        });

        // Save the user to the database
        await newUser.save();

        resp.status(201).json({ message: "User registered successfully" });

    } catch (error) {
        console.error(error);
        resp.status(500).json({ message: "Server error" });
    }
});

//
// user login API Method
const jwt = require('jsonwebtoken');
const { List } = require('@mui/material');
const { Int32 } = require('mongodb');

function generateToken(user) {
    return jwt.sign(
        { id: user._id, name: user.name, email: user.email },
        process.env.JWT_SECRET || 'your_secret_key',
        { expiresIn: '1h' }
    );
}

app.post("/login", async (req, resp) => {
    try {
        const { email, pass } = req.body;
        console.log(email);

        let user;

        // First try to find the user in the User collection
        user = await User.findOne({ email: email });

        // If no user is found, return an error response
        if (!user) {
            return resp.status(401).send("Invalid email or password");
        }

        // Compare entered password with the hashed password stored in the database using bcrypt
        const isMatch = await bcrypt.compare(pass, user.password);
        if (!isMatch) {
            return resp.status(400).json({ message: "Invalid credentials" });
        }

        // Successful login: send back user info and token
        const token = generateToken(user); // Generate a token (implement this function as needed)

        // Send user name and token in the response
        resp.json({ name: user.name, token });
    } catch (e) {
        console.error("Login error:", e);
        resp.status(500).send("Something Went Wrong");
    }
});


//
//
// Workout Schema
const WorkoutSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    sets: {
        type: Number,
        required: true
    },
    reps: {
        type: Number,
        required: true
    },
    weight: {
        type: Number,
        required: true
    },
    notes: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now,
    },
});
//Workout Model
const Workout = mongoose.model("Workout", WorkoutSchema);

//
// Create a new workout Api Method
app.post("/create/workout", async (req, res) => {
    try {
        const workout = new Workout(req.body);
        await workout.save();
        res.send(workout);
    } catch (e) {
        console.error("Error creating workout:", e);
    }
});

//
// Fetch workouts by username in Date Group API Method
app.get("/fetch/workouts/grouped", async (req, res) => {
    try {
        const { username } = req.query;
        const workouts = await Workout.find({ username }).sort({ date: -1 });

        const groupedWorkouts = workouts.reduce((acc, workout) => {
            const date = new Date(workout.date).toDateString();
            if (!acc[date]) acc[date] = [];
            acc[date].push(workout);
            return acc;
        }, {});

        res.json(groupedWorkouts);
    } catch (error) {
        console.error("Error fetching grouped workouts:", error);
        res.status(500).send("Server error");
    }
});

//
// Fetch workout by ID API Method
app.get("/workout/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const workout = await Workout.findById(id);
        if (!workout) {
            return res.status(404).json({ error: "Workout not found" });
        }
        res.status(200).json(workout);
    } catch (error) {
        res.status(500).json({ error: "Error fetching workout" });
    }
});

//
// Edit Workout API Method
app.put("/edit/workout/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const updatedWorkout = await Workout.findByIdAndUpdate(id, req.body, { new: true });
        if (!updatedWorkout) {
            return res.status(404).json({ error: "Workout not found" });
        }
        res.status(200).json(updatedWorkout);
    } catch (error) {
        res.status(500).json({ error: "Error updating workout" });
    }
});

//
// Delete Workout API Method
app.delete("/delete/workout/:id", async (req, res) => {
    try {
        const { id } = req.params;
        await Workout.findByIdAndDelete(id);
        res.status(200).json({ message: "Workout deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: "Error deleting workout" });
    }
});


//
//
// Nutritions Schema
const NutritionSchema = new mongoose.Schema({
    food_name: {
        type: String,
        required: true
    },
    calories: {
        type: Number,
        required: true
    },
    protein: {
        type: Number,
        required: true
    },
    carbs: {
        type: Number,
        required: true
    },
    fat: {
        type: Number,
        required: true
    },
    date: {
        type: Date,
        default: Date.now,
    },
});
// Nutritions Model
const Nutrition = mongoose.model("Nutritions", NutritionSchema);

// Add Nutrition API Methods
app.post("/add/nutrition", async (req, res) => {
    try {
        await Nutrition.insertMany(req.body.nutritionList);
        res.status(201).send({ message: "Nutrition data added successfully!" });
    } catch (error) {
        res.status(500).send({ error: "Failed to add nutrition data." });
    }
});



app.listen(5000, () => {
    console.log("App listen at port 5000");
})