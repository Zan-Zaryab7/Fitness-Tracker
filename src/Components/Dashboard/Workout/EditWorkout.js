import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Container, TextField, Button, Typography, Grid } from "@mui/material";
import Sidebar from "../Sidebar";
import Navbar from "../Navbar";

const EditWorkout = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [name, setName] = useState();
    const [sets, setSets] = useState();
    const [reps, setReps] = useState();
    const [weight, setWeight] = useState();
    const [notes, setNotes] = useState();

    useEffect(() => {
        const fetchWorkout = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/workout/${id}`);
                const { name, sets, reps, weight, notes } = response.data;
                setName(name);
                setSets(sets);
                setReps(reps);
                setWeight(weight);
                setNotes(notes);
            } catch (error) {
                console.error("Error fetching workout:", error);
            }
        };
        fetchWorkout();
    }, [id]);

    const handleOnSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`http://localhost:5000/edit/workout/${id}`, { name, sets, reps, weight, notes });
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
                    <Grid container spacing={2}>
                        <Grid item xs={6}><TextField fullWidth value={name} onChange={(e) => setName(e.target.value)} /></Grid>
                        <Grid item xs={3}><TextField type="number" fullWidth inputProps={{ min: 0 }} value={sets} onChange={(e) => setSets(e.target.value)} /></Grid>
                        <Grid item xs={3}><TextField type="number" fullWidth inputProps={{ min: 0 }} value={reps} onChange={(e) => setReps(e.target.value)} /></Grid>
                        <Grid item xs={3}><TextField type="number" fullWidth inputProps={{ min: 0 }} value={weight} onChange={(e) => setWeight(e.target.value)} /></Grid>
                        <Grid item xs={9}><TextField fullWidth value={notes} onChange={(e) => setNotes(e.target.value)} /></Grid>
                    </Grid>
                    <Button onClick={handleOnSubmit} variant="contained" sx={{ mt: 2, backgroundColor: '#2c3e50', color: 'white' }}> Update Workout </Button>
                </Container>
            </div>
        </div>
    );
};

export default EditWorkout;
