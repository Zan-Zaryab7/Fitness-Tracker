import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Container, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Typography } from "@mui/material";
import Sidebar from "../Sidebar";
import Navbar from "../Navbar";

const WorkoutTracker = () => {
    const [workouts, setWorkouts] = useState({});
    const navigate = useNavigate();
    const username = localStorage.getItem("userName");

    useEffect(() => {
        const fetchWorkouts = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/fetch/workouts/grouped?username=${username}`);
                setWorkouts(response.data);
            } catch (error) {
                console.error("Error fetching workouts:", error);
            }
        };

        fetchWorkouts();
    }, []);

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:5000/delete/workout/${id}`);
            setWorkouts((prevWorkouts) => {
                const updatedWorkouts = { ...prevWorkouts };
                for (const date in updatedWorkouts) {
                    updatedWorkouts[date] = updatedWorkouts[date].filter(workout => workout._id !== id);
                    if (updatedWorkouts[date].length === 0) delete updatedWorkouts[date];
                }
                return updatedWorkouts;
            });
        } catch (error) {
            console.error("Error deleting workout:", error);
        }
    };

    const handleEdit = (id) => {
        navigate(`/editworkout/${id}`);
    };

    return (
        <div className="app">
            <Sidebar />
            <div className="main-content">
                <Navbar />
                <Container sx={{ marginTop: 5 }}>
                    <Typography variant="h4" sx={{ marginBottom: 2 }}>Workout Tracker</Typography>

                    {Object.keys(workouts).map(date => (
                        <div key={date} style={{ marginBottom: "30px" }}>
                            <Typography variant="h6" sx={{ color: "#2c3e50", marginBottom: 1 }}>{date}</Typography>
                            <TableContainer component={Paper}>
                                <Table sx={{ backgroundColor: '#2c3e50' }}>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell sx={{ color: '#fff' }}>Name</TableCell>
                                            <TableCell sx={{ color: '#fff' }}>Sets</TableCell>
                                            <TableCell sx={{ color: '#fff' }}>Reps</TableCell>
                                            <TableCell sx={{ color: '#fff' }}>Weight</TableCell>
                                            <TableCell sx={{ color: '#fff' }}>Notes</TableCell>
                                            <TableCell sx={{ color: '#fff' }}>Actions</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {workouts[date].map(workout => (
                                            <TableRow key={workout._id}>
                                                <TableCell sx={{ color: '#fff' }}>{workout.name}</TableCell>
                                                <TableCell sx={{ color: '#fff' }}>{workout.sets}</TableCell>
                                                <TableCell sx={{ color: '#fff' }}>{workout.reps}</TableCell>
                                                <TableCell sx={{ color: '#fff' }}>{workout.weight}</TableCell>
                                                <TableCell sx={{ color: '#fff' }}>{workout.notes}</TableCell>
                                                <TableCell sx={{ color: '#fff' }}>
                                                    <Button
                                                        onClick={() => handleEdit(workout._id)}
                                                        variant="contained"
                                                        style={{ backgroundColor: "#4C6F7B", color: "white", marginRight: 8 }}
                                                    >
                                                        Edit
                                                    </Button>
                                                    <Button
                                                        onClick={() => handleDelete(workout._id)}
                                                        variant="contained"
                                                        style={{ backgroundColor: "#4C6F7B", color: "white" }}
                                                    >
                                                        Delete
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </div>
                    ))}
                </Container>
            </div>
        </div>
    );
};

export default WorkoutTracker;
