import { useState } from "react";
import { Container, TextField, Button, Typography, Grid, MenuItem, Select, InputLabel, FormControl } from "@mui/material";
import Sidebar from "../Sidebar";
import Navbar from "../Navbar";
import { useNavigate } from "react-router-dom";

export default function AddWorkout() {
    const [name, setName] = useState();
    const [category, setCategory] = useState("");
    const [sets, setSets] = useState("");
    const [reps, setReps] = useState("");
    const [weight, setWeight] = useState("");
    const [time, setTime] = useState("");
    const [yogaName, setYogaName] = useState("");
    const [sportName, setSportName] = useState("");
    const [notes, setNotes] = useState();

    const username = localStorage.getItem('userName');

    const navigate = useNavigate();

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
    };

    const handleOnSubmit = async (e) => {
        e.preventDefault();

        // Basic field validation based on category
        let isValid = true;
        let errorMessage = "Please fill the following fields:\n";

        // Ensure category field is filled
        if (!category) {
            errorMessage = "Please select a category.";
            isValid = false;
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

        // Submit the form data if validation passed
        try {
            let result = await fetch('http://localhost:5000/create/workout', {
                method: "POST",
                body: JSON.stringify({ username, name, sets, reps, weight, time, yogaName, sportName, notes, category }),
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            result = await result.json();

            if (result) {
                // Clear form fields after successful submission
                setName("");
                setSets("");
                setReps("");
                setWeight("");
                setTime("");
                setYogaName("");
                setSportName("");
                setNotes("");
                setCategory("");

                navigate("/workouttracker");
            }
        } catch (error) {
            console.error("Error during form submission:", error);
        }
    };


    return (
        <div className="app">
            <Sidebar />
            <div className="main-content">
                <Navbar />
                <Container sx={{ marginTop: 5 }}>
                    <Typography variant="h4" gutterBottom>Add Workout</Typography>
                    <form>
                        {/* Category Selection */}
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

                        {/* Form Fields using Grid */}
                        <Grid container spacing={2}>
                            {/* Strength Training, Powerlifting, Weightlifting, Bodybuilding */}
                            {category === "Strength Training" || category === "Powerlifting" || category === "Weightlifting" || category === "Bodybuilding" ? (
                                <>
                                    <Grid item xs={6}>
                                        <TextField
                                            label="Exercise Name"
                                            name="name"
                                            fullWidth
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                        />
                                    </Grid>
                                    <Grid item xs={3}>
                                        <TextField
                                            label="Sets"
                                            name="sets"
                                            type="number"
                                            inputProps={{ min: 0 }}
                                            fullWidth
                                            value={sets}
                                            onChange={(e) => setSets(e.target.value)}
                                        />
                                    </Grid>
                                    <Grid item xs={3}>
                                        <TextField
                                            label="Reps"
                                            name="reps"
                                            type="number"
                                            inputProps={{ min: 0 }}
                                            fullWidth
                                            value={reps}
                                            onChange={(e) => setReps(e.target.value)}
                                        />
                                    </Grid>
                                    <Grid item xs={3}>
                                        <TextField
                                            label="Weight"
                                            name="weight"
                                            type="number"
                                            inputProps={{ min: 0 }}
                                            fullWidth
                                            value={weight}
                                            onChange={(e) => setWeight(e.target.value)}
                                        />
                                    </Grid>
                                    {/* Notes Field */}
                                    <Grid item xs={9}>
                                        <TextField
                                            label="Notes"
                                            name="notes"
                                            fullWidth
                                            value={notes}
                                            onChange={(e) => setNotes(e.target.value)}
                                        />
                                    </Grid>
                                </>
                            ) : null}

                            {/* Cardio, Endurance, HIIT, Cycling, Running */}
                            {category === "Cardio" || category === "Endurance" || category === "HIIT" || category === "Cycling" || category === "Running" ? (
                                <>
                                    <Grid item xs={6}>
                                        <TextField
                                            label="Exercise Name"
                                            name="name"
                                            fullWidth
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                        />
                                    </Grid>
                                    <Grid item xs={6}>
                                        <TextField
                                            label="Duration (min)"
                                            name="duration"
                                            type="number"
                                            inputProps={{ min: 0 }}
                                            fullWidth
                                            value={time}
                                            onChange={(e) => setTime(e.target.value)}
                                        />
                                    </Grid>
                                    {/* Notes Field */}
                                    <Grid item xs={12}>
                                        <TextField
                                            label="Notes"
                                            name="notes"
                                            fullWidth
                                            value={notes}
                                            onChange={(e) => setNotes(e.target.value)}
                                        />
                                    </Grid>
                                </>
                            ) : null}

                            {/* Yoga, Pilates, Flexibility, Rehabilitation */}
                            {category === "Yoga" || category === "Pilates" || category === "Flexibility" || category === "Rehabilitation" ? (
                                <>
                                    <Grid item xs={6}>
                                        <TextField
                                            label="Session Name"
                                            name="sessionName"
                                            fullWidth
                                            value={yogaName}
                                            onChange={(e) => setYogaName(e.target.value)}
                                        />
                                    </Grid>
                                    <Grid item xs={6}>
                                        <TextField
                                            label="Duration (min)"
                                            name="duration"
                                            type="number"
                                            inputProps={{ min: 0 }}
                                            fullWidth
                                            value={time}
                                            onChange={(e) => setTime(e.target.value)}
                                        />
                                    </Grid>
                                    {/* Notes Field */}
                                    <Grid item xs={12}>
                                        <TextField
                                            label="Notes"
                                            name="notes"
                                            fullWidth
                                            value={notes}
                                            onChange={(e) => setNotes(e.target.value)}
                                        />
                                    </Grid>
                                </>
                            ) : null}

                            {/* Sports-Specific Training */}
                            {category === "Sports-Specific Training" ? (
                                <>
                                    <Grid item xs={6}>
                                        <TextField
                                            label="Sport Name"
                                            name="sportName"
                                            fullWidth
                                            value={sportName}
                                            onChange={(e) => setSportName(e.target.value)}
                                        />
                                    </Grid>
                                    <Grid item xs={3}>
                                        <TextField
                                            label="Sets"
                                            name="sets"
                                            type="number"
                                            inputProps={{ min: 0 }}
                                            fullWidth
                                            value={sets}
                                            onChange={(e) => setSets(e.target.value)}
                                        />
                                    </Grid>
                                    <Grid item xs={3}>
                                        <TextField
                                            label="Reps"
                                            name="reps"
                                            type="number"
                                            inputProps={{ min: 0 }}
                                            fullWidth
                                            value={reps}
                                            onChange={(e) => setReps(e.target.value)}
                                        />
                                    </Grid>
                                    {/* Notes Field */}
                                    <Grid item xs={12}>
                                        <TextField
                                            label="Notes"
                                            name="notes"
                                            fullWidth
                                            value={notes}
                                            onChange={(e) => setNotes(e.target.value)}
                                        />
                                    </Grid>
                                </>
                            ) : null}

                            {/* Calisthenics, CrossFit, Plyometrics, Martial Arts */}
                            {category === "Calisthenics" || category === "CrossFit" || category === "Plyometrics" || category === "Martial Arts" ? (
                                <>
                                    <Grid item xs={6}>
                                        <TextField
                                            label="Exercise Name"
                                            name="name"
                                            fullWidth
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                        />
                                    </Grid>
                                    <Grid item xs={3}>
                                        <TextField
                                            label="Sets"
                                            name="sets"
                                            type="number"
                                            inputProps={{ min: 0 }}
                                            fullWidth
                                            value={sets}
                                            onChange={(e) => setSets(e.target.value)}
                                        />
                                    </Grid>
                                    <Grid item xs={3}>
                                        <TextField
                                            label="Reps"
                                            name="reps"
                                            type="number"
                                            inputProps={{ min: 0 }}
                                            fullWidth
                                            value={reps}
                                            onChange={(e) => setReps(e.target.value)}
                                        />
                                    </Grid>
                                    {/* Notes Field */}
                                    <Grid item xs={12}>
                                        <TextField
                                            label="Notes"
                                            name="notes"
                                            fullWidth
                                            value={notes}
                                            onChange={(e) => setNotes(e.target.value)}
                                        />
                                    </Grid>
                                </>
                            ) : null}
                        </Grid>


                        {/* Submit Button */}
                        <Button onClick={handleOnSubmit} variant="contained" sx={{ mt: 2, backgroundColor: '#2c3e50' }}>Add Workout</Button>
                    </form>
                </Container>
            </div>
        </div>
    );
}
