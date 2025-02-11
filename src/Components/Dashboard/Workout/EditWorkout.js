import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Container, TextField, Button, Typography, Grid, FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import Sidebar from "../Sidebar";
import Navbar from "../Navbar";

const EditWorkout = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [category, setCategory] = useState("");
    const [name, setName] = useState("");
    const [sets, setSets] = useState("");
    const [reps, setReps] = useState("");
    const [weight, setWeight] = useState("");
    const [notes, setNotes] = useState("");
    const [time, setTime] = useState("");
    const [yogaName, setYogaName] = useState("");
    const [sportName, setSportName] = useState("");
    const [availableExercises, setAvailableExercises] = useState([]);

    // Exercise Options Based on Category
    const exerciseOptions = {
        "Strength Training": ["Bench Press", "Deadlift", "Squat", "Pull-ups"],
        "Cardio": ["Running", "Cycling", "Jump Rope", "Rowing"],
        "Endurance": ["Long-distance Running", "Swimming", "Hiking", "Rowing"],
        "Flexibility": ["Hamstring Stretch", "Shoulder Stretch", "Quad Stretch", "Cat-Cow Stretch"],
        "Powerlifting": ["Squat", "Bench Press", "Deadlift", "Overhead Press"],
        "Weightlifting": ["Clean and Jerk", "Snatch", "Front Squat", "Power Clean"],
        "Bodybuilding": ["Bicep Curls", "Tricep Dips", "Leg Press", "Lat Pulldown"],
        "HIIT": ["Burpees", "Mountain Climbers", "Jump Squats", "High Knees"],
        "Calisthenics": ["Push-ups", "Dips", "Planks", "Handstands"],
        "CrossFit": ["Thrusters", "Kettlebell Swings", "Box Jumps", "Wall Balls"],
        "Plyometrics": ["Box Jumps", "Bounding", "Depth Jumps", "Skater Jumps"],
        "Yoga": ["Sun Salutation", "Warrior Pose", "Tree Pose", "Downward Dog"],
        "Pilates": ["The Hundred", "Leg Circles", "Rolling Like a Ball", "Criss-Cross"],
        "Martial Arts": ["Jab-Cross Combo", "Roundhouse Kick", "Elbow Strike", "Side Kick"],
        "Sports-Specific Training": ["Basketball Drills", "Football Drills", "Tennis Drills", "Sprint Drills"],
        "Rehabilitation": ["Resistance Band Exercises", "Joint Mobility Drills", "Foam Rolling", "Gentle Stretching"]
    };

    useEffect(() => {
        const fetchWorkout = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/workout/${id}`);
                const { category, name, sets, reps, weight, notes, time, yogaName, sportName } = response.data;
                setCategory(category);
                setName(name);
                setSets(sets);
                setReps(reps);
                setWeight(weight);
                setNotes(notes);
                setTime(time);
                setYogaName(yogaName);
                setSportName(sportName);


                // Update available exercises based on the category
                setAvailableExercises(exerciseOptions[category] || []);
            } catch (error) {
                console.error("Error fetching workout:", error);
            }
        };
        fetchWorkout();
    }, [id]);

    const handleCategoryChange = (selectedCategory) => {
        setCategory(selectedCategory);

        switch (selectedCategory) {
            case "Strength Training":
            case "Powerlifting":
            case "Weightlifting":
            case "Bodybuilding":
                setSets(3);
                setReps(10);
                setWeight(20);
                break;

            case "Cardio":
            case "Endurance":
            case "HIIT":
            case "Cycling":
            case "Running":
                setSets("");
                setReps("");
                setWeight("");
                break;

            case "Calisthenics":
            case "CrossFit":
            case "Plyometrics":
            case "Martial Arts":
                setSets(3);
                setReps(15);
                setWeight("");
                break;

            case "Yoga":
            case "Pilates":
            case "Flexibility":
            case "Rehabilitation":
                setSets("");
                setReps("");
                setWeight("");
                setTime(60); // Default time (in minutes)
                setYogaName(""); // Session name
                break;

            case "Sports-Specific Training":
                setSets(3);
                setReps(8);
                setWeight("");
                setSportName(""); // Sport type name
                break;

            default:
                setSets("");
                setReps("");
                setWeight("");
                break;
        }

        setAvailableExercises(exerciseOptions[selectedCategory] || []);
        setName(""); // Reset selected name
        setYogaName("");
        setSportName("");
    };

    const handleOnSubmit = async (e) => {
        e.preventDefault();

        // Basic field validation based on category
        let isValid = true;
        let errorMessage = "Please fill the following fields:\n";

        // Ensure category field is filled
        if (!category) {
            alert("Please select a category and an exercise.");
            return;
        }

        if (!notes) {
            errorMessage = "Please fill the note field.";
            isValid = false;
        }

        // Validate category-specific fields
        if (category === "Strength Training" || category === "Powerlifting" || category === "Weightlifting" || category === "Bodybuilding") {
            if (!name || !sets || !reps || !weight) {
                isValid = false;
                errorMessage += "Sets, Reps, and Weight\n";
            }
        }

        if (category === "Cardio" || category === "Endurance" || category === "HIIT" || category === "Cycling" || category === "Running") {
            if (!name || !time) {
                isValid = false;
                errorMessage += "Duration (min)\n";
            }
        }

        if (category === "Yoga" || category === "Pilates" || category === "Flexibility" || category === "Rehabilitation") {
            if (!yogaName || !time) {
                isValid = false;
                errorMessage += "Session Name and Duration\n";
            }
        }

        if (category === "Sports-Specific Training") {
            if (!sportName || !sets || !reps) {
                isValid = false;
                errorMessage += "Sport Name, Sets, and Reps\n";
            }
        }

        // Display error if validation failed
        if (!isValid) {
            alert(errorMessage);
            return;
        }

        try {
            await axios.put(`http://localhost:5000/edit/workout/${id}`, { category, name, sets, reps, weight, notes, time, yogaName, sportName });
            navigate("/workouttracker");
        } catch (error) {
            console.error("Error updating workout:", error);
        }
    };

    return (
        <div className="app">
            <Sidebar />
            <div className="main-content">
                <Navbar />
                <Container sx={{ marginTop: 5 }}>
                    <Typography variant="h4" gutterBottom> Edit Workout </Typography>
                    <form>
                        <FormControl fullWidth sx={{ marginBottom: 2 }}>
                            <InputLabel>Workout Category</InputLabel>
                            <Select
                                value={category}
                                onChange={(e) => handleCategoryChange(e.target.value)}
                            >
                                <MenuItem value="Strength Training">Strength Training</MenuItem>
                                <MenuItem value="Cardio">Cardio</MenuItem>
                                <MenuItem value="Endurance">Endurance</MenuItem>
                                <MenuItem value="Flexibility">Flexibility</MenuItem>
                                <MenuItem value="Powerlifting">Powerlifting</MenuItem>
                                <MenuItem value="Weightlifting">Weightlifting</MenuItem>
                                <MenuItem value="Bodybuilding">Bodybuilding</MenuItem>
                                <MenuItem value="HIIT">HIIT</MenuItem>
                                <MenuItem value="Calisthenics">Calisthenics</MenuItem>
                                <MenuItem value="CrossFit">CrossFit</MenuItem>
                                <MenuItem value="Plyometrics">Plyometrics</MenuItem>
                                <MenuItem value="Yoga">Yoga</MenuItem>
                                <MenuItem value="Pilates">Pilates</MenuItem>
                                <MenuItem value="Martial Arts">Martial Arts</MenuItem>
                                <MenuItem value="Sports-Specific Training">Sports-Specific Training</MenuItem>
                                <MenuItem value="Rehabilitation">Rehabilitation</MenuItem>
                            </Select>
                        </FormControl>

                        <Grid container spacing={2}>
                            {(category === "Strength Training" || category === "Powerlifting" || category === "Weightlifting" || category === "Bodybuilding") ? (
                                <>
                                    <Grid item xs={6}>{/* Exercise Selection */}
                                        {category && (
                                            <FormControl fullWidth sx={{ marginBottom: 2 }}>
                                                <InputLabel>Exercise Name</InputLabel>
                                                <Select value={name} onChange={(e) => setName(e.target.value)}>
                                                    {availableExercises.map((exercise) => (
                                                        <MenuItem key={exercise} value={exercise}>{exercise}</MenuItem>
                                                    ))}
                                                </Select>
                                            </FormControl>
                                        )}</Grid>
                                    <Grid item xs={3}><TextField label="Sets" type="number" fullWidth value={sets} onChange={(e) => setSets(e.target.value)} /></Grid>
                                    <Grid item xs={3}><TextField label="Reps" type="number" fullWidth value={reps} onChange={(e) => setReps(e.target.value)} /></Grid>
                                    <Grid item xs={3}><TextField label="Weight" type="number" fullWidth value={weight} onChange={(e) => setWeight(e.target.value)} /></Grid>
                                    <Grid item xs={9}><TextField label="Notes" fullWidth value={notes} onChange={(e) => setNotes(e.target.value)} /></Grid>
                                </>
                            ) : null}

                            {/* Cardio, Endurance, HIIT, Cycling, Running */}
                            {category === "Cardio" || category === "Endurance" || category === "HIIT" || category === "Cycling" || category === "Running" ? (
                                <>
                                    <Grid item xs={6}>{/* Exercise Selection */}
                                        {category && (
                                            <FormControl fullWidth sx={{ marginBottom: 2 }}>
                                                <InputLabel>Exercise Name</InputLabel>
                                                <Select value={name} onChange={(e) => setName(e.target.value)}>
                                                    {availableExercises.map((exercise) => (
                                                        <MenuItem key={exercise} value={exercise}>{exercise}</MenuItem>
                                                    ))}
                                                </Select>
                                            </FormControl>
                                        )}</Grid>
                                    <Grid item xs={6}><TextField label="Duration (min)" name="duration" type="number" inputProps={{ min: 0 }} fullWidth value={time} onChange={(e) => setTime(e.target.value)} /></Grid>
                                    {/* Notes Field */}
                                    <Grid item xs={12}><TextField label="Notes" name="notes" fullWidth value={notes} onChange={(e) => setNotes(e.target.value)} /></Grid>
                                </>
                            ) : null}

                            {(category === "Yoga" || category === "Pilates" || category === "Flexibility" || category === "Rehabilitation") ? (
                                <>
                                    <Grid item xs={6}>{/* Exercise Selection */}
                                        {category && (
                                            <FormControl fullWidth sx={{ marginBottom: 2 }}>
                                                <InputLabel>Exercise Name</InputLabel>
                                                <Select value={yogaName} onChange={(e) => setYogaName(e.target.value)}>
                                                    {availableExercises.map((exercise) => (
                                                        <MenuItem key={exercise} value={exercise}>{exercise}</MenuItem>
                                                    ))}
                                                </Select>
                                            </FormControl>
                                        )}</Grid>
                                    <Grid item xs={6}><TextField label="Duration (min)" type="number" fullWidth value={time} onChange={(e) => setTime(e.target.value)} /></Grid>
                                    <Grid item xs={12}><TextField label="Notes" fullWidth value={notes} onChange={(e) => setNotes(e.target.value)} /></Grid>
                                </>
                            ) : null}

                            {category === "Sports-Specific Training" ? (
                                <>
                                    <Grid item xs={6}>{/* Exercise Selection */}
                                        {category && (
                                            <FormControl fullWidth sx={{ marginBottom: 2 }}>
                                                <InputLabel>Exercise Name</InputLabel>
                                                <Select value={sportName} onChange={(e) => setSportName(e.target.value)}>
                                                    {availableExercises.map((exercise) => (
                                                        <MenuItem key={exercise} value={exercise}>{exercise}</MenuItem>
                                                    ))}
                                                </Select>
                                            </FormControl>
                                        )}</Grid>
                                    <Grid item xs={3}><TextField label="Sets" type="number" fullWidth value={sets} onChange={(e) => setSets(e.target.value)} /></Grid>
                                    <Grid item xs={3}><TextField label="Reps" type="number" fullWidth value={reps} onChange={(e) => setReps(e.target.value)} /></Grid>
                                    <Grid item xs={12}><TextField label="Notes" fullWidth value={notes} onChange={(e) => setNotes(e.target.value)} /></Grid>
                                </>
                            ) : null}

                            {/* Calisthenics, CrossFit, Plyometrics, Martial Arts */}
                            {category === "Calisthenics" || category === "CrossFit" || category === "Plyometrics" || category === "Martial Arts" ? (
                                <>
                                    <Grid item xs={6}>{/* Exercise Selection */}
                                        {category && (
                                            <FormControl fullWidth sx={{ marginBottom: 2 }}>
                                                <InputLabel>Exercise Name</InputLabel>
                                                <Select value={name} onChange={(e) => setName(e.target.value)}>
                                                    {availableExercises.map((exercise) => (
                                                        <MenuItem key={exercise} value={exercise}>{exercise}</MenuItem>
                                                    ))}
                                                </Select>
                                            </FormControl>
                                        )}</Grid>
                                    <Grid item xs={3}><TextField label="Sets" name="sets" type="number" inputProps={{ min: 0 }} fullWidth value={sets} onChange={(e) => setSets(e.target.value)} /></Grid>
                                    <Grid item xs={3}><TextField label="Reps" name="reps" type="number" inputProps={{ min: 0 }} fullWidth value={reps} onChange={(e) => setReps(e.target.value)} /></Grid>
                                    {/* Notes Field */}
                                    <Grid item xs={12}><TextField label="Notes" name="notes" fullWidth value={notes} onChange={(e) => setNotes(e.target.value)} /></Grid>
                                </>
                            ) : null}
                        </Grid>
                        <Button onClick={handleOnSubmit} variant="contained" sx={{ mt: 2, backgroundColor: '#2c3e50' }}>Update Workout</Button>
                    </form>
                </Container>
            </div>
        </div>
    );
};

export default EditWorkout;
