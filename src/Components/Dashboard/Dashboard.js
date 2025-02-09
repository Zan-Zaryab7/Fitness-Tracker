import React, { useState, useEffect } from "react";
import { Box, Container, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import { LineChart, Line, PieChart, Pie, Cell, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts";

// Define Colors for Each Macro
const COLORS = ["#FF5733", "#33FF57", "#3385FF", "#FF33A8"];

export default function Dashboard() {
    // Navigate var for Navigating Routes
    const navigate = useNavigate();
    // Get UserName From LocalStorage
    const username = localStorage.getItem("userName");

    // State for Progress
    const [progressData, setProgressData] = useState([]);

    // Fetch Progress from api by username
    useEffect(() => {
        const fetchProgressData = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/fetch/progress?username=${username}`);
                setProgressData(response.data);
            } catch (error) {
                console.error("Error fetching progress data:", error);
            }
        };
        fetchProgressData();
    }, [username]);

    // Fetching Progress data with clear Date
    const formattedProgressData = progressData.length > 0
        ? progressData.map(item => ({
            ...item,
            date: new Date(item.date).toISOString().split("T")[0], // Format the date
        }))
        : []; // Empty array if no data


    // State for Workouts
    const [workouts, setWorkouts] = useState({});
    // State for Table Nutritions
    const [nutritionData, setNutritionData] = useState({});
    // State for Charts Nutritions
    const [currentnutritionData, setCurrentNutritionData] = useState({});

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

    /** Fetch Current Nutrition Data from API */
    useEffect(() => {
        const fetchTodayNutritionData = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/fetch/nutrition/today?username=${username}`);
                setCurrentNutritionData(response.data);
            } catch (error) {
                console.error("Error fetching today's nutrition data:", error);
            }
        };

        fetchTodayNutritionData();
    }, [username]);


    /** Fetch All Nutrition Data from API */
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

            // Fetch updated workouts again
            const response = await axios.get(`http://localhost:5000/fetch/workouts/grouped?username=${username}`);
            setWorkouts(response.data);
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

    /** Compute Total Values Of Current Day */
    const getTotalValues = () => {
        const today = new Date().toISOString().split("T")[0]; // Get current date in YYYY-MM-DD format

        const todayData = currentnutritionData[today] || []; // Get today's data or empty array if none

        return todayData.reduce(
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

                    <Box sx={{ padding: 3, borderRadius: 2, backgroundColor: "#D9EAFD" }}>
                        <Typography variant="h6" sx={{ color: "#2c3e50", marginBottom: 2 }}>
                            Weight & Body Fat Over Time
                        </Typography>
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={formattedProgressData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="date" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Line type="monotone" dataKey="weight" stroke="#8884d8" name="Weight (kg)" />
                                <Line type="monotone" dataKey="bodyFat" stroke="#82ca9d" name="Body Fat (%)" />
                            </LineChart>
                        </ResponsiveContainer>
                    </Box>

                    <Box sx={{ padding: 3, borderRadius: 2, backgroundColor: "#D9EAFD", marginTop: 3 }}>
                        <Typography variant="h6" sx={{ color: "#2c3e50", marginBottom: 2 }}>
                            Performance Progress
                        </Typography>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={formattedProgressData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="date" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="metricType" fill="#4C6F7B" name={progressData.metricType} />
                                <Bar dataKey="metricValue" fill="#4C6F7B" name={progressData.metricType} />
                            </BarChart>
                        </ResponsiveContainer>
                    </Box>



                    {/* ✅ PIE CHART FOR TOTAL NUTRITION */}
                    <Box sx={{ display: "flex", justifyContent: "space-between", gap: 5, padding: 3, borderRadius: 2 }}>
                        {/* Left: Bar Chart */}
                        <Box sx={{ textAlign: "left", padding: 3, borderRadius: 2, backgroundColor: "#D9EAFD" }}>
                            <Typography variant="h6" sx={{ color: "#2c3e50", marginBottom: 2 }}>
                                Todays' Nutrition Overview
                            </Typography>

                            {isDataEmpty ? (
                                <Typography sx={{ color: "#999" }}>No data available</Typography>
                            ) : (
                                <ResponsiveContainer width={300} height={250}>
                                    <BarChart data={pieChartData}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="name" />
                                        <YAxis />
                                        <Tooltip />
                                        <Bar dataKey="value" fill="#4C6F7B" />
                                    </BarChart>
                                </ResponsiveContainer>
                            )}
                        </Box>

                        {/* Right: Pie Chart */}
                        <Box sx={{ textAlign: "left", padding: 3, borderRadius: 2, backgroundColor: "#D9EAFD" }}>
                            <Typography variant="h6" sx={{ color: "#2c3e50", marginBottom: 2 }}>
                                Todays' Nutrition Breakdown
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
                                    <Pie data={pieChartData} cx="50%" cy="50%" outerRadius={100} dataKey="value" label>
                                        {pieChartData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                    <Legend />
                                </PieChart>
                            )}
                        </Box>
                    </Box>

                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: 'start', gap: 2 }}>
                        {/* Workout Tracker */}
                        <Box sx={{ marginBottom: 5 }}>
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
                            ) : (Object.keys(workouts).map(category => (
                                <div key={category} style={{ marginBottom: "30px" }}>
                                    <Typography variant="h5" sx={{ color: "#4C6F7B", marginBottom: 2 }}>{category}</Typography>

                                    {Object.keys(workouts[category]).map(date => (
                                        <div key={date} style={{ marginBottom: "20px", paddingLeft: "20px" }}>
                                            <Typography variant="h6" sx={{ color: "#2c3e50", marginBottom: 1 }}>{date}</Typography>

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
                                                                        onClick={() => handleEditWorkout(workout._id)}
                                                                        variant="contained"
                                                                        style={{ backgroundColor: "#4C6F7B", color: "white", marginRight: 8 }}
                                                                    >
                                                                        Edit
                                                                    </Button>
                                                                    <Button
                                                                        onClick={() => handleDeleteWorkout(workout._id)}
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
                        </Box>

                        {/* Nutrition Tracker */}
                        <Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Typography sx={{ color: "#2c3e50", marginBottom: 2, fontSize: 34 }}>
                                    Nutrition Tracker
                                </Typography>
                                <Button onClick={() => navigate('/addnutritions')} variant="contained" sx={{ marginBottom: 2.5, backgroundColor: "#2c3e50" }}>
                                    Add Nutrition
                                </Button>
                            </Box>
                            {Object.keys(nutritionData).map(date => {
                                const totals = calculateDailyTotals(date);
                                return (
                                    <div key={date} style={{ marginBottom: "30px" }}>
                                        <Typography variant="h6" sx={{ color: "#2c3e50", marginBottom: 1 }}>{date}</Typography>
                                        <TableContainer component={Paper}>
                                            <Table sx={{ backgroundColor: '#2c3e50' }}>
                                                <TableHead>
                                                    <TableRow>
                                                        <TableCell sx={{ color: '#fff' }}>Meal Type</TableCell>
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
                                                            <TableCell sx={{ color: '#fff' }}>{item.mealType}</TableCell>
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
