import React, { useState } from "react";
import { TextField, Button, Container, Typography, Box, MenuItem } from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Sidebar from "../Sidebar";
import Navbar from "../Navbar";

export default function AddProgress() {
    const navigate = useNavigate();
    const username = localStorage.getItem("userName");

    // Individual states for each input field
    const [weight, setWeight] = useState("");
    const [bodyFat, setBodyFat] = useState("");
    const [chest, setChest] = useState("");
    const [waist, setWaist] = useState("");
    const [thighs, setThighs] = useState("");
    const [arms, setArms] = useState("");
    const [metricType, setMetricType] = useState("Run Time");
    const [metricValue, setMetricValue] = useState("");

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Ensure at least one value is entered
        if (!weight && !metricValue) {
            alert("Please enter at least weight or a performance metric.");
            return;
        }

        const progressData = {
            username,
            weight,
            bodyFat,
            chest,
            waist,
            thighs,
            arms,
            metricType,
            metricValue,
        };

        try {
            await axios.post("http://localhost:5000/add/progress", progressData);
            alert("Progress added successfully!");
            navigate("/dashboard");
        } catch (error) {
            console.error("Error adding progress:", error);
            alert("Failed to add progress.");
        }
    };

    return (
        <div className="app">
            <Sidebar />
            <div className="main-content">
                <Navbar />
                <Container maxWidth="sm">
                    <Box sx={{ marginTop: 5, padding: 3, boxShadow: 3, borderRadius: 2 }}>
                        <Typography variant="h5" sx={{ marginBottom: 2 }}>
                            Add Progress
                        </Typography>
                        <form>
                            <TextField
                                label="Weight (kg)"
                                type="number"
                                value={weight}
                                onChange={(e) => setWeight(e.target.value)}
                                fullWidth
                                sx={{ marginBottom: 2 }}
                                inputProps={{ min: 0 }}
                            />
                            <TextField
                                label="Body Fat (%)"
                                type="number"
                                value={bodyFat}
                                onChange={(e) => setBodyFat(e.target.value)}
                                fullWidth
                                sx={{ marginBottom: 2 }}
                                inputProps={{ min: 0 }}
                            />
                            <Typography variant="h6" sx={{ marginBottom: 1 }}>
                                Body Measurements (cm)
                            </Typography>
                            <TextField
                                label="Chest"
                                type="number"
                                value={chest}
                                onChange={(e) => setChest(e.target.value)}
                                fullWidth
                                sx={{ marginBottom: 2 }}
                                inputProps={{ min: 0 }}
                            />
                            <TextField
                                label="Waist"
                                type="number"
                                value={waist}
                                onChange={(e) => setWaist(e.target.value)}
                                fullWidth
                                sx={{ marginBottom: 2 }}
                                inputProps={{ min: 0 }}
                            />
                            <TextField
                                label="Thighs"
                                type="number"
                                value={thighs}
                                onChange={(e) => setThighs(e.target.value)}
                                fullWidth
                                sx={{ marginBottom: 2 }}
                                inputProps={{ min: 0 }}
                            />
                            <TextField
                                label="Arms"
                                type="number"
                                value={arms}
                                onChange={(e) => setArms(e.target.value)}
                                fullWidth
                                sx={{ marginBottom: 2 }}
                                inputProps={{ min: 0 }}
                            />
                            <Typography variant="h6" sx={{ marginBottom: 1 }}>
                                Performance Metrics
                            </Typography>
                            <TextField
                                select
                                label="Metric Type"
                                value={metricType}
                                onChange={(e) => {
                                    const selectedType = e.target.value;
                                    setMetricType(selectedType);

                                    // Adjust metric value based on selection
                                    let defaultValue = 0;
                                    switch (selectedType) {
                                        case "Run Time":
                                            defaultValue = 10; // Example default value in seconds
                                            break;
                                        case "Lifting Weights":
                                            defaultValue = 20; // Example default weight in kg
                                            break;
                                        case "Cycling Distance":
                                            defaultValue = 5; // Example default distance in km
                                            break;
                                        case "Push-ups":
                                            defaultValue = 15; // Example default reps
                                            break;
                                        default:
                                            defaultValue = 0;
                                    }
                                    setMetricValue(defaultValue);
                                }}
                                fullWidth
                                sx={{ marginBottom: 2 }}
                            >
                                <MenuItem value="Run Time">Run Time (seconds)</MenuItem>
                                <MenuItem value="Lifting Weights">Lifting Weights (kg)</MenuItem>
                                <MenuItem value="Cycling Distance">Cycling Distance (km)</MenuItem>
                                <MenuItem value="Push-ups">Push-ups (reps)</MenuItem>
                            </TextField>
                            <TextField
                                label="Metric Value"
                                type="number" // Ensure only numbers are entered
                                value={metricValue}
                                onChange={(e) => {
                                    const value = Math.max(0, Number(e.target.value)); // Convert to number & prevent negatives
                                    setMetricValue(value);
                                }}
                                fullWidth
                                sx={{ marginBottom: 2 }}
                                InputProps={{ inputProps: { min: 0 } }} // Set min value
                            />
                        </form>
                        <Button onClick={handleSubmit} type="submit" variant="contained" sx={{ backgroundColor: "#2c3e50" }} fullWidth>
                            Save Progress
                        </Button>
                    </Box>
                </Container>
            </div>
        </div>
    );
}
