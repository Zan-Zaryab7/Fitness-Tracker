import { useState } from "react";
import { Container, TextField, Button, Typography, Grid } from "@mui/material";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import { useNavigate } from "react-router-dom";

export default function AddWorkout() {
    const [name, setName] = useState();
    const [sets, setSets] = useState();
    const [reps, setReps] = useState();
    const [weight, setWeight] = useState();
    const [notes, setNotes] = useState();

    const username = localStorage.getItem('userName');

    const navigate = useNavigate();

    const handleOnSubmit = async (e) => {
        e.preventDefault();
        if (!name && !sets && !reps && !weight && !notes) {
            alert('Fill all fields');
        } else {
            let result = await fetch(
                'http://localhost:5000/create/workout', {
                method: "post",
                body: JSON.stringify({ username, name, sets, reps, weight, notes }),
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            result = await result.json();
            console.warn(result);
            if (result) {
                setName("");
                setSets("");
                setReps("");
                setWeight("");
                setNotes("");

                navigate("/workouttracker");
            }
        }
    }

    return (
        <div className="app">
            <Sidebar />
            <div className="main-content">
                <Navbar />
                <Container sx={{ marginTop: 5 }}>
                    <Typography variant="h4" gutterBottom>Workout Tracker</Typography>
                    <Grid container spacing={2}>
                        <Grid item xs={6}><TextField label="Exercise Name" name="name" fullWidth value={name} onChange={(e) => setName(e.target.value)} /></Grid>
                        <Grid item xs={3}><TextField label="Sets" name="sets" type="number" fullWidth inputProps={{ min: 0 }} value={sets} onChange={(e) => setSets(e.target.value)} /></Grid>
                        <Grid item xs={3}><TextField label="Reps" name="reps" type="number" fullWidth inputProps={{ min: 0 }} value={reps} onChange={(e) => setReps(e.target.value)} /></Grid>
                        <Grid item xs={3}><TextField label="Weight" name="weight" type="number" fullWidth inputProps={{ min: 0 }} value={weight} onChange={(e) => setWeight(e.target.value)} /></Grid>
                        <Grid item xs={9}><TextField label="Notes" name="notes" fullWidth value={notes} onChange={(e) => setNotes(e.target.value)} /></Grid>
                    </Grid>
                    <Button onClick={handleOnSubmit} variant="contained" sx={{ mt: 2, backgroundColor: '#2c3e50' }}>Add Workout</Button>
                </Container>
            </div>
        </div>
    );
}
