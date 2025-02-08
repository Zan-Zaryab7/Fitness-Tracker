import React, { useState, useEffect } from "react";
import { Box, Container, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

// Define Colors for Each Macro
const COLORS = ["#FF5733", "#33FF57", "#3385FF", "#FF33A8"];

export default function Dashboard() {
    const navigate = useNavigate();
    const username = localStorage.getItem("userName");

    // State for Workouts
    const [workouts, setWorkouts] = useState({});
    // State for Nutrition
    const [nutritionData, setNutritionData] = useState({});

    /** Fetch Workouts from API */
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
    }, [username]);

    /** Fetch Nutrition Data from API */
    useEffect(() => {
        const fetchNutritionData = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/fetch/nutrition/grouped?username=${username}`);
                setNutritionData(response.data);
            } catch (error) {
                console.error("Error fetching nutrition data:", error);
            }
        };
        fetchNutritionData();
    }, [username]);

    /** Delete a Workout */
    const handleDeleteWorkout = async (id) => {
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

    /** Delete a Nutrition Entry */
    const handleDeleteNutrition = async (id) => {
        try {
            await axios.delete(`http://localhost:5000/delete/nutrition/${id}`);
            setNutritionData((prevData) => {
                const updatedData = { ...prevData };
                for (const date in updatedData) {
                    updatedData[date] = updatedData[date].filter(item => item._id !== id);
                    if (updatedData[date].length === 0) delete updatedData[date];
                }
                return updatedData;
            });
        } catch (error) {
            console.error("Error deleting nutrition data:", error);
        }
    };

    /** Edit Workout */
    const handleEditWorkout = (id) => {
        navigate(`/editworkout/${id}`);
    };

    /** Edit Nutrition Entry */
    const handleEditNutrition = (id) => {
        navigate(`/editnutrition/${id}`);
    };

    /** Calculate Total Nutrition Per Day */
    const calculateDailyTotals = (date) => {
        const dailyItems = nutritionData[date] || [];
        return dailyItems.reduce(
            (totals, item) => ({
                calories: totals.calories + (item.calories || 0),
                protein_g: totals.protein_g + (item.protein_g || 0),
                carbohydrates_g: totals.carbohydrates_g + (item.carbohydrates_g || 0),
                fat_g: totals.fat_g + (item.fat_g || 0),
            }),
            { calories: 0, protein_g: 0, carbohydrates_g: 0, fat_g: 0 }
        );
    };

    /** Compute Total Values Across All Days */
    const getTotalValues = () => {
        return Object.values(nutritionData).flat().reduce(
            (totals, item) => ({
                calories: totals.calories + (item.calories || 0),
                protein_g: totals.protein_g + (item.protein_g || 0),
                carbohydrates_g: totals.carbohydrates_g + (item.carbohydrates_g || 0),
                fat_g: totals.fat_g + (item.fat_g || 0),
            }),
            { calories: 0, protein_g: 0, carbohydrates_g: 0, fat_g: 0 }
        );
    };

    const totalValues = getTotalValues();

    /** Pie Chart Data */
    const pieChartData = [
        { name: "Calories", value: totalValues.calories },
        { name: "Protein (g)", value: totalValues.protein_g },
        { name: "Carbs (g)", value: totalValues.carbohydrates_g },
        { name: "Fat (g)", value: totalValues.fat_g },
    ];

    /** Check if Data is Empty */
    const isDataEmpty = pieChartData.every(item => item.value === 0);


    return (
        <div className="app">
            <Sidebar />
            <div className="main-content">
                <Navbar />
                <Container sx={{ marginTop: 5 }}>
                    <Typography variant="h4" sx={{ marginBottom: 3 }}>
                        Fitness Dashboard
                    </Typography>

                    {/* ✅ PIE CHART FOR TOTAL NUTRITION */}
                    <Box sx={{ textAlign: "left", padding: 3, borderRadius: 2 }}>
                        <Typography variant="h6" sx={{ color: "#2c3e50", marginBottom: 2 }}>
                            Total Nutrition Breakdown
                        </Typography>
                        {isDataEmpty ? (
                            <>
                                <PieChart width={300} height={300}>
                                    <Pie data={[{ value: 1 }]} cx="50%" cy="50%" outerRadius={100} fill="#d3d3d3" />
                                </PieChart>
                                <Typography sx={{ color: "#999" }}>No data available</Typography>
                            </>
                        ) : (
                            <PieChart width={300} height={300}>
                                <Pie
                                    data={pieChartData}
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={100}
                                    fill="#8884d8"
                                    dataKey="value"
                                    label
                                >
                                    {pieChartData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        )}
                    </Box>

                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: 'start', gap: 2 }}>
                        {/* Workout Tracker */}
                        <Box sx={{ marginBottom: 5 }}>
                            <Typography sx={{ color: "#2c3e50", marginBottom: 2, fontSize: 34 }}>
                                Workout Tracker
                            </Typography>
                            <Button onClick={() => navigate('/addworkout')} variant="contained" sx={{ marginBottom: 2.5, backgroundColor: "#2c3e50" }}>
                                Add Workout
                            </Button>
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
                                                        <TableCell sx={{ color: '#fff' }}>{workout.notes.length > 20 ? `${workout.notes.substring(0, 20)}...` : workout.notes}</TableCell>
                                                        <TableCell sx={{ color: '#fff' }}>
                                                            <Button onClick={() => handleEditWorkout(workout._id)} variant="contained" sx={{ marginBottom: .4, marginRight: .4, backgroundColor: "#4C6F7B" }}>Edit</Button>
                                                            <Button onClick={() => handleDeleteWorkout(workout._id)} variant="contained" sx={{ backgroundColor: "#4C6F7B" }}>Delete</Button>
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                </div>
                            ))}
                        </Box>

                        {/* Nutrition Tracker */}
                        <Box>
                            <Typography sx={{ color: "#2c3e50", marginBottom: 2, fontSize: 34 }}>
                                Nutrition Tracker
                            </Typography>
                            <Button onClick={() => navigate('/addnutritions')} variant="contained" sx={{ marginBottom: 2.5, backgroundColor: "#2c3e50" }}>
                                Add Nutrition
                            </Button>
                            {Object.keys(nutritionData).map(date => {
                                const totals = calculateDailyTotals(date);
                                return (
                                    <div key={date} style={{ marginBottom: "30px" }}>
                                        <Typography variant="h6" sx={{ color: "#2c3e50", marginBottom: 1 }}>{date}</Typography>
                                        <TableContainer component={Paper}>
                                            <Table sx={{ backgroundColor: '#2c3e50' }}>
                                                <TableHead>
                                                    <TableRow>
                                                        <TableCell sx={{ color: '#fff' }}>Food Name</TableCell>
                                                        <TableCell sx={{ color: '#fff' }}>Quantity</TableCell>
                                                        <TableCell sx={{ color: '#fff' }}>Calories</TableCell>
                                                        <TableCell sx={{ color: '#fff' }}>Protein (g)</TableCell>
                                                        <TableCell sx={{ color: '#fff' }}>Carbs (g)</TableCell>
                                                        <TableCell sx={{ color: '#fff' }}>Fat (g)</TableCell>
                                                        <TableCell sx={{ color: '#fff' }}>Actions</TableCell>
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    <TableRow>
                                                        <TableCell sx={{ fontWeight: 'bold', color: '#fff' }}>Total</TableCell>
                                                        <TableCell></TableCell>
                                                        <TableCell sx={{ color: '#fff' }}>{totals.calories.toFixed(2)}</TableCell>
                                                        <TableCell sx={{ color: '#fff' }}>{totals.protein_g.toFixed(2)}</TableCell>
                                                        <TableCell sx={{ color: '#fff' }}>{totals.carbohydrates_g.toFixed(2)}</TableCell>
                                                        <TableCell sx={{ color: '#fff' }}>{totals.fat_g.toFixed(2)}</TableCell>
                                                        <TableCell></TableCell>
                                                    </TableRow>

                                                    {/* ✅ PRINT EACH FOOD ITEM */}
                                                    {nutritionData[date].map(item => (
                                                        <TableRow key={item._id}>
                                                            <TableCell sx={{ color: '#fff' }}>{item.food_name}</TableCell>
                                                            <TableCell sx={{ color: '#fff' }}>{item.quantity}</TableCell>
                                                            <TableCell sx={{ color: '#fff' }}>{item.calories.toFixed(2)}</TableCell>
                                                            <TableCell sx={{ color: '#fff' }}>{item.protein_g.toFixed(2)}</TableCell>
                                                            <TableCell sx={{ color: '#fff' }}>{item.carbohydrates_g.toFixed(2)}</TableCell>
                                                            <TableCell sx={{ color: '#fff' }}>{item.fat_g.toFixed(2)}</TableCell>
                                                            <TableCell sx={{ color: '#fff' }}>
                                                                <Button onClick={() => handleEditNutrition(item._id)} variant="contained" sx={{ marginBottom: .4, marginRight: .4, backgroundColor: "#4C6F7B" }}>Edit</Button>
                                                                <Button onClick={() => handleDeleteNutrition(item._id)} variant="contained" sx={{ backgroundColor: "#4C6F7B" }}>Delete</Button>
                                                            </TableCell>
                                                        </TableRow>
                                                    ))}
                                                </TableBody>

                                            </Table>
                                        </TableContainer>
                                    </div>
                                );
                            })}
                        </Box>
                    </Box>
                </Container>
            </div>
        </div>
    );
}
