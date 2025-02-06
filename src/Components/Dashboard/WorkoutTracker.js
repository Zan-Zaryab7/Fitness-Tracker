import React, { useState, useEffect } from "react";
import axios from "axios";
import { Container, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

const WorkoutTracker = () => {
    const [workouts, setWorkouts] = useState([]);

    const username = localStorage.getItem("userName");

    useEffect(() => {
        const fetchWorkouts = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/fetch/workouts?username=${username}`);
                setWorkouts(response.data);
            } catch (error) {
                console.error("Error fetching workouts:", error);
            }
        };

        fetchWorkouts();
    }, []);

    return (
        <div className="app">
            <Sidebar />
            <div className="main-content">
                <Navbar />
                <Container>
                    <h2>Workout Tracker</h2>

                    <TableContainer component={Paper} style={{ marginTop: "20px" }}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Name</TableCell>
                                    <TableCell>Sets</TableCell>
                                    <TableCell>Reps</TableCell>
                                    <TableCell>Weight</TableCell>
                                    <TableCell>Notes</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {workouts.map((workout, index) => (
                                    <TableRow key={index}>
                                        <TableCell>{workout.name}</TableCell>
                                        <TableCell>{workout.sets}</TableCell>
                                        <TableCell>{workout.reps}</TableCell>
                                        <TableCell>{workout.weight}</TableCell>
                                        <TableCell>{workout.notes}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Container>
            </div>
        </div>
    );
};

export default WorkoutTracker;
