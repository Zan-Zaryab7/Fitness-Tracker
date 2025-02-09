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
            } catch (error) {
                console.error("Error fetching workout:", error);
            }
        };
        fetchWorkout();
    }, [id]);

    const handleOnSubmit = async (e) => {
        e.preventDefault();
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
                                onChange={(e) => setCategory(e.target.value)}
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
                                    <Grid item xs={6}><TextField label="Exercise Name" fullWidth value={name} onChange={(e) => setName(e.target.value)} /></Grid>
                                    <Grid item xs={3}><TextField label="Sets" type="number" fullWidth value={sets} onChange={(e) => setSets(e.target.value)} /></Grid>
                                    <Grid item xs={3}><TextField label="Reps" type="number" fullWidth value={reps} onChange={(e) => setReps(e.target.value)} /></Grid>
                                    <Grid item xs={3}><TextField label="Weight" type="number" fullWidth value={weight} onChange={(e) => setWeight(e.target.value)} /></Grid>
                                    <Grid item xs={9}><TextField label="Notes" fullWidth value={notes} onChange={(e) => setNotes(e.target.value)} /></Grid>
                                </>
                            ) : null}

                            {/* Cardio, Endurance, HIIT, Cycling, Running */}
                            {category === "Cardio" || category === "Endurance" || category === "HIIT" || category === "Cycling" || category === "Running" ? (
                                <>
                                    <Grid item xs={6}><TextField label="Exercise Name" name="name" fullWidth value={name} onChange={(e) => setName(e.target.value)} /></Grid>
                                    <Grid item xs={6}><TextField label="Duration (min)" name="duration" type="number" inputProps={{ min: 0 }} fullWidth value={time} onChange={(e) => setTime(e.target.value)} /></Grid>
                                    {/* Notes Field */}
                                    <Grid item xs={12}><TextField label="Notes" name="notes" fullWidth value={notes} onChange={(e) => setNotes(e.target.value)} /></Grid>
                                </>
                            ) : null}

                            {(category === "Yoga" || category === "Pilates" || category === "Flexibility" || category === "Rehabilitation") ? (
                                <>
                                    <Grid item xs={6}><TextField label="Session Name" fullWidth value={yogaName} onChange={(e) => setYogaName(e.target.value)} /></Grid>
                                    <Grid item xs={6}><TextField label="Duration (min)" type="number" fullWidth value={time} onChange={(e) => setTime(e.target.value)} /></Grid>
                                    <Grid item xs={12}><TextField label="Notes" fullWidth value={notes} onChange={(e) => setNotes(e.target.value)} /></Grid>
                                </>
                            ) : null}

                            {category === "Sports-Specific Training" ? (
                                <>
                                    <Grid item xs={6}><TextField label="Sport Name" fullWidth value={sportName} onChange={(e) => setSportName(e.target.value)} /></Grid>
                                    <Grid item xs={3}><TextField label="Sets" type="number" fullWidth value={sets} onChange={(e) => setSets(e.target.value)} /></Grid>
                                    <Grid item xs={3}><TextField label="Reps" type="number" fullWidth value={reps} onChange={(e) => setReps(e.target.value)} /></Grid>
                                    <Grid item xs={12}><TextField label="Notes" fullWidth value={notes} onChange={(e) => setNotes(e.target.value)} /></Grid>
                                </>
                            ) : null}

                            {/* Calisthenics, CrossFit, Plyometrics, Martial Arts */}
                            {category === "Calisthenics" || category === "CrossFit" || category === "Plyometrics" || category === "Martial Arts" ? (
                                <>
                                    <Grid item xs={6}><TextField label="Exercise Name" name="name" fullWidth value={name} onChange={(e) => setName(e.target.value)} /></Grid>
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
