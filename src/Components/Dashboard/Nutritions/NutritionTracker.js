import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Container, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Typography } from "@mui/material";
import Sidebar from "../Sidebar";
import Navbar from "../Navbar";

const NutritionTracker = () => {
    const [nutritionData, setNutritionData] = useState({});
    const [userName, setUserName] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        const storeUserName = localStorage.getItem("userName");
        if (storeUserName) {
            setUserName(storeUserName);
        }
    }, []);  // Separate useEffect to ensure userName is set first

    useEffect(() => {
        if (!userName) return; // Don't fetch if username isn't available

        const fetchNutritionData = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/fetch/nutrition/grouped?username=${userName}`);
                setNutritionData(response.data);
            } catch (error) {
                console.error("Error fetching nutrition data:", error);
            }
        };

        fetchNutritionData();
    }, [userName]);  // This runs only when userName is set

    const handleDelete = async (id) => {
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

    const handleEdit = (id) => {
        navigate(`/editnutrition/${id}`);
    };

    // Helper function to limit the number
    const limitValue = (value, maxLength = 10000) => {
        // If the value is not a number or NaN, return a default value
        if (isNaN(value)) return 'N/A';

        // Limit the value to the maxLength, if needed, or round to 2 decimal places
        return Math.min(parseFloat(value), maxLength).toFixed(2); // Example: limit to 2 decimals
    };

    const calculateDailyTotals = (date) => {
        const dailyItems = nutritionData[date] || [];

        return dailyItems.reduce(
            (totals, item) => ({
                calories: totals.calories + (item.calories || 0),
                protein_g: totals.protein_g + (item.protein_g || 0),
                carbohydrates_g: totals.carbohydrates_g + (item.carbohydrates_g || 0),
                fat_g: totals.fat_g + (item.fat_g || 0),
            }),
            { calories: 0, protein_g: 0, carbohydrates_g: 0, fat_g: 0 } // Initial totals set to 0
        );
    };


    return (
        <div className="app">
            <Sidebar />
            <div className="main-content">
                <Navbar />
                <Container sx={{ marginTop: 5 }}>
                    <Typography variant="h4" sx={{ marginBottom: 2 }}>Nutrition Tracker</Typography>

                    {Object.keys(nutritionData).map(date => {
                        const totals = calculateDailyTotals(date);
                        return (
                            <div key={date} style={{ marginBottom: "30px" }}>
                                <Typography variant="h6" sx={{ color: "#2c3e50", marginBottom: 1 }}>
                                    {date}
                                </Typography>
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
                                            {nutritionData[date].map(item => (
                                                <TableRow key={item._id}>
                                                    <TableCell sx={{ color: '#fff' }}>{item.mealType}</TableCell>
                                                    <TableCell sx={{ color: '#fff' }}>{item.food_name}</TableCell>
                                                    <TableCell sx={{ color: '#fff' }}>{item.quantity}</TableCell>
                                                    <TableCell sx={{ color: '#fff' }}>{limitValue(item.calories)}</TableCell>
                                                    <TableCell sx={{ color: '#fff' }}>{limitValue(item.protein_g)}</TableCell>
                                                    <TableCell sx={{ color: '#fff' }}>{limitValue(item.carbohydrates_g)}</TableCell>
                                                    <TableCell sx={{ color: '#fff' }}>{limitValue(item.fat_g)}</TableCell>
                                                    <TableCell sx={{ color: '#fff' }}>
                                                        <Button
                                                            onClick={() => handleEdit(item._id)}
                                                            variant="contained"
                                                            style={{ backgroundColor: "#4C6F7B", color: "white", marginRight: 8 }}
                                                        >
                                                            Edit
                                                        </Button>
                                                        <Button
                                                            onClick={() => handleDelete(item._id)}
                                                            variant="contained"
                                                            style={{ backgroundColor: "#4C6F7B", color: "white" }}
                                                        >
                                                            Delete
                                                        </Button>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                            {/* Add total row */}
                                            <TableRow>
                                                <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Total</TableCell>
                                                <TableCell sx={{ color: '#fff' }}></TableCell>
                                                <TableCell sx={{ color: '#fff' }}></TableCell>
                                                <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>{totals.calories.toFixed(2)}</TableCell>
                                                <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>{totals.protein_g.toFixed(2)}</TableCell>
                                                <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>{totals.carbohydrates_g.toFixed(2)}</TableCell>
                                                <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>{totals.fat_g.toFixed(2)}</TableCell>
                                                <TableCell sx={{ color: '#fff' }}></TableCell>
                                            </TableRow>
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </div>
                        );
                    })}

                </Container>
            </div>
        </div>
    );
};

export default NutritionTracker;
