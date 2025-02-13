import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Container, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Typography, Box, Pagination } from "@mui/material";
import Sidebar from "../Sidebar";
import Navbar from "../Navbar";

const WorkoutTracker = () => {
    const [workouts, setWorkouts] = useState({});
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 1;
    const navigate = useNavigate();
    const username = localStorage.getItem("userName");

    useEffect(() => {
        const fetchWorkouts = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/fetch/workouts/grouped?username=${username}`);

                setWorkouts(response.data); // Response is already structured by category & date
            } catch (error) {
                console.error("Error fetching workouts:", error);
            }
        };

        fetchWorkouts();
    }, []);


    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:5000/delete/workout/${id}`);

            // Fetch updated workouts again
            const response = await axios.get(`http://localhost:5000/fetch/workouts/grouped?username=${username}`);
            setWorkouts(response.data);
        } catch (error) {
            console.error("Error deleting workout:", error);
        }
    };

    const handleEdit = (id) => {
        navigate(`/editworkout/${id}`);
    };

    const handleChangePage = (event, newPage) => {
        setCurrentPage(newPage);
    };

    const categories = Object.keys(workouts);
    const totalPages = Math.ceil(categories.length / itemsPerPage);
    const displayedCategories = categories.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    return (
        <div className="app">
            <Sidebar />
            <div className="main-content">
                <Navbar />
                <Container sx={{ marginTop: 5 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="h4" sx={{ marginBottom: 2 }}>Workout Tracker</Typography>
                        <Button onClick={() => navigate('/addworkout')} variant="contained" sx={{ backgroundColor: "#2c3e50" }}>
                            Add Workout
                        </Button>
                    </Box>
                    {Object.keys(workouts).length === 0 ? (
                        <Typography variant="h6" sx={{ color: "#2c3e50", textAlign: "left", marginTop: 5 }}>
                            No workouts found. Start adding your workouts! <Button onClick={() => navigate('/addworkout')} sx={{ backgroundColor: "transparent" }}>Add Workout</Button>
                        </Typography>
                    ) : (displayedCategories.map(category => (
                        <div key={category} style={{ marginBottom: "30px" }}>
                            <Typography variant="h5" sx={{ color: "#4C6F7B", marginBottom: 2 }}>Category: {category}</Typography>

                            {Object.keys(workouts[category]).map(date => (
                                <div key={date} style={{ marginBottom: "20px", paddingLeft: "20px" }}>
                                    <Typography variant="h6" sx={{ color: "#2c3e50", marginBottom: 1 }}>Date: {date}</Typography>

                                    <TableContainer component={Paper}>
                                        <Table sx={{ backgroundColor: '#2c3e50' }}>
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell sx={{ color: '#fff' }}>Name</TableCell>

                                                    {/* Conditional Fields Based on Category */}
                                                    {["Strength Training", "Powerlifting", "Weightlifting", "Bodybuilding"].includes(category) && (
                                                        <>
                                                            <TableCell sx={{ color: '#fff' }}>Sets</TableCell>
                                                            <TableCell sx={{ color: '#fff' }}>Reps</TableCell>
                                                            <TableCell sx={{ color: '#fff' }}>Weight</TableCell>
                                                        </>
                                                    )}

                                                    {["Plyometrics", "CrossFit", "Calisthenics"].includes(category) && (
                                                        <>
                                                            <TableCell sx={{ color: '#fff' }}>Sets</TableCell>
                                                            <TableCell sx={{ color: '#fff' }}>Reps</TableCell>
                                                        </>
                                                    )}

                                                    {category === "Cardio" && (
                                                        <TableCell sx={{ color: '#fff' }}>Time (min)</TableCell>
                                                    )}

                                                    {["Yoga", "Pilates", "Flexibility"].includes(category) && (
                                                        <TableCell sx={{ color: '#fff' }}>Duration (min)</TableCell>
                                                    )}

                                                    {category === "Sports-Specific Training" && (
                                                        <>
                                                            <TableCell sx={{ color: '#fff' }}>Sport</TableCell>
                                                            <TableCell sx={{ color: '#fff' }}>Sets</TableCell>
                                                            <TableCell sx={{ color: '#fff' }}>Reps</TableCell>
                                                        </>
                                                    )}

                                                    <TableCell sx={{ color: '#fff' }}>Notes</TableCell>
                                                    <TableCell sx={{ color: '#fff' }}>Actions</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {workouts[category][date].map(workout => (
                                                    <TableRow key={workout._id}>
                                                        <TableCell sx={{ color: '#fff' }}>
                                                            {workout.yogaName || workout.pilatesName || workout.flexibilityName || workout.sportName || workout.rehabilitationName || workout.name}
                                                        </TableCell>

                                                        {/* Strength Training, Powerlifting, Weightlifting, Bodybuilding */}
                                                        {["Strength Training", "Powerlifting", "Weightlifting", "Bodybuilding"].includes(category) && (
                                                            <>
                                                                <TableCell sx={{ color: '#fff' }}>{workout.sets}</TableCell>
                                                                <TableCell sx={{ color: '#fff' }}>{workout.reps}</TableCell>
                                                                <TableCell sx={{ color: '#fff' }}>{workout.weight}</TableCell>
                                                            </>
                                                        )}

                                                        {/* "Plyometrics", "CrossFit", "Calisthenics" */}
                                                        {["Plyometrics", "CrossFit", "Calisthenics"].includes(category) && (
                                                            <>
                                                                <TableCell sx={{ color: '#fff' }}>{workout.sets}</TableCell>
                                                                <TableCell sx={{ color: '#fff' }}>{workout.reps}</TableCell>
                                                            </>
                                                        )}

                                                        {/* Cardio */}
                                                        {category === "Cardio" && (
                                                            <TableCell sx={{ color: '#fff' }}>{workout.time}</TableCell>
                                                        )}

                                                        {/* Yoga, Pilates, Flexibility */}
                                                        {["Yoga", "Pilates", "Flexibility"].includes(category) && (
                                                            <TableCell sx={{ color: '#fff' }}>{workout.time}</TableCell>
                                                        )}

                                                        {/* Sports-Specific Training */}
                                                        {category === "Sports-Specific Training" && (
                                                            <>
                                                                <TableCell sx={{ color: '#fff' }}>{workout.sportName}</TableCell>
                                                                <TableCell sx={{ color: '#fff' }}>{workout.sets}</TableCell>
                                                                <TableCell sx={{ color: '#fff' }}>{workout.reps}</TableCell>
                                                            </>
                                                        )}

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
                        </div>
                    )))}
                    {totalPages > 1 && (
                        <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 3 }}>
                            <Pagination count={totalPages} page={currentPage} onChange={handleChangePage} color="primary" />
                        </Box>
                    )}
                </Container>
            </div>
        </div>
    );
};

export default WorkoutTracker;
