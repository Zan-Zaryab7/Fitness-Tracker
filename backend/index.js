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
    user_name: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    food_name: {
        type: String,
        required: true
    },
    calories: {
        type: Number,
        required: true
    },
    protein_g: {
        type: Number,
        required: true
    },
    carbohydrates_g: {
        type: Number,
        required: true
    },
    fat_g: {
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

//
// Add Nutritions API Method
app.post("/add/nutrition", async (req, res) => {
    const nutritionData = req.body.nutritionData;

    try {
        // Save the nutrition data to MongoDB
        const savedData = await Nutrition.insertMany(nutritionData);
        res.status(200).json({ message: "Data saved successfully", savedData });
    } catch (error) {
        console.error("Error saving data:", error);
        res.status(500).json({ message: "Error saving data" });
    }
});

//
// Fetch nutritions by username in Date Group API Method
app.get("/fetch/nutrition/grouped", async (req, res) => {
    try {
        const { username } = req.query;  // Change this from user_name to username to match frontend
        if (!username) {
            return res.status(400).json({ error: "Username is required" });
        }

        const nutritionData = await Nutrition.find({ user_name: username }).sort({ date: -1 });

        // Group by date
        const groupedNutrition = nutritionData.reduce((acc, item) => {
            const date = new Date(item.date).toDateString();
            if (!acc[date]) acc[date] = [];
            acc[date].push(item);
            return acc;
        }, {});

        res.json(groupedNutrition);
    } catch (error) {
        console.error("Error fetching grouped nutrition data:", error);
        res.status(500).send("Server error");
    }
});

//
// fetch a nutrition record by its ID
app.get('/getbyId/nutrition/:id', async (req, res) => {
    try {
        const { id } = req.params;

        // Find the nutrition record by ID
        const nutrition = await Nutrition.findById(id);

        // If no record is found, return a 404 error
        if (!nutrition) {
            return res.status(404).json({ message: "Nutrition record not found" });
        }

        // Return the nutrition record as a response
        res.status(200).json(nutrition);
    } catch (error) {
        console.error("Error fetching nutrition record:", error);
        res.status(500).send("Server error");
    }
});

//
// Edit a nutrition record by its ID
app.put('/edit/nutrition/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { food_name, quantity, calories, protein_g, carbohydrates_g, fat_g } = req.body;

        // Find the nutrition record by ID and update it
        const updatedNutrition = await Nutrition.findByIdAndUpdate(id, {
            food_name,
            quantity,
            calories,
            protein_g,
            carbohydrates_g,
            fat_g
        }, { new: true });

        if (!updatedNutrition) {
            return res.status(404).json({ message: "Nutrition record not found" });
        }

        res.status(200).json(updatedNutrition);
    } catch (error) {
        console.error("Error updating nutrition record:", error);
        res.status(500).send("Server error");
    }
});

//
// DELETE nutritions record by its ID API Method
app.delete('/delete/nutrition/:id', async (req, res) => {
    try {
        const { id } = req.params;

        // Find the nutrition record by ID and delete it
        const deletedRecord = await Nutrition.findByIdAndDelete(id);

        if (!deletedRecord) {
            return res.status(404).json({ message: "Nutrition record not found" });
        }

        res.status(200).json({ message: "Nutrition record deleted successfully" });
    } catch (error) {
        console.error("Error deleting nutrition record:", error);
        res.status(500).send("Server error");
    }
});


//
// Progress Schema
const ProgressSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    weight: {
        type: Number,
        required: true
    },
    bodyFat: {
        type: Number,
        required: true
    },
    chest: {
        type: Number,
        required: true
    },
    waist: {
        type: Number,
        required: true
    },
    thighs: {
        type: Number,
        required: true
    },
    arms: {
        type: Number,
        required: true
    },
    metricType: {
        type: String,
        required: true
    },
    metricValue: {
        type: Number,
        required: true
    },
    date: {
        type: Date,
        default: Date.now,
    },
}, { timestamps: true });
// Progress Model
const Progress = mongoose.model('Progress', ProgressSchema);

//
// Add Progress Controller API Method
app.post("/add/progress", async (req, res) => {
    try {
        const {
            username,
            weight,
            bodyFat,
            chest,
            waist,
            thighs,
            arms,
            metricType,
            metricValue
        } = req.body;

        if (!username || !weight) {
            return res.status(400).json({ message: "Username and Weight are required." });
        }

        const newProgress = new Progress({
            username,
            weight,
            bodyFat,
            chest,
            waist,
            thighs,
            arms,
            metricType,
            metricValue
        });

        await newProgress.save();
        res.status(201).json({ message: "Progress recorded successfully!" });
    } catch (error) {
        console.error("Error saving progress:", error);
        res.status(500).json({ message: "Server error" });
    }
});

// Fetch Progress Data for a User
app.get("/fetch/progress", async (req, res) => {
    const { username } = req.query;
    try {
        const progressData = await Progress.find({ username }).sort({ date: 1 });
        res.json(progressData);
    } catch (error) {
        res.status(500).json({ error: "Error fetching progress data" });
    }
});

app.listen(5000, () => {
    console.log("App listen at port 5000");
})