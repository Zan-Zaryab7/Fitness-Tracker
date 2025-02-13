import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Container, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Typography, TablePagination } from "@mui/material";
import Sidebar from "../Sidebar";
import Navbar from "../Navbar";

const NutritionTracker = () => {
    const [nutritionData, setNutritionData] = useState({});
    const [userName, setUserName] = useState("");
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const navigate = useNavigate();

    useEffect(() => {
        const storeUserName = localStorage.getItem("userName");
        if (storeUserName) {
            setUserName(storeUserName);
        }
    }, []);

    useEffect(() => {
        if (!userName) return;

        const fetchNutritionData = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/fetch/nutrition/grouped?username=${userName}`);
                setNutritionData(response.data);
            } catch (error) {
                console.error("Error fetching nutrition data:", error);
            }
        };

        fetchNutritionData();
    }, [userName]);

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:5000/delete/nutrition/${id}`);
            setNutritionData(prevData => {
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

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const allData = Object.keys(nutritionData).flatMap(date =>
        nutritionData[date].map(item => ({ ...item, date }))
    );

    // Helper function to limit the number
    const limitValue = (value, maxLength = 10000) => {
        // If the value is not a number or NaN, return a default value
        if (isNaN(value)) return 'N/A';

        // Limit the value to the maxLength, if needed, or round to 2 decimal places
        return Math.min(parseFloat(value), maxLength).toFixed(2); // Example: limit to 2 decimals
    };

    return (
        <div className="app">
            <Sidebar />
            <div className="main-content">
                <Navbar />
                <Container sx={{ marginTop: 5 }}>
                    <Typography variant="h4" sx={{ marginBottom: 2 }}>Nutrition Tracker</Typography>
                    <TableContainer component={Paper}>
                        <Table sx={{ backgroundColor: '#2c3e50' }}>
                            <TableHead>
                                <TableRow>
                                    <TableCell sx={{ color: '#fff' }}>Date</TableCell>
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
                                {allData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(item => (

                                    <TableRow key={item._id}>
                                        <TableCell sx={{ color: '#fff' }}>{item.date}</TableCell>
                                        <TableCell sx={{ color: '#fff' }}>{item.mealType}</TableCell>
                                        <TableCell sx={{ color: '#fff' }}>{item.food_name}</TableCell>
                                        <TableCell sx={{ color: '#fff' }}>{limitValue(item.quantity)}</TableCell>
                                        <TableCell sx={{ color: '#fff' }}>{limitValue(item.calories)}</TableCell>
                                        <TableCell sx={{ color: '#fff' }}>{limitValue(item.protein_g)}</TableCell>
                                        <TableCell sx={{ color: '#fff' }}>{limitValue(item.carbohydrates_g)}</TableCell>
                                        <TableCell sx={{ color: '#fff' }}>{limitValue(item.fat_g)}</TableCell>
                                        <TableCell sx={{ color: '#fff' }}>
                                            <Button onClick={() => handleEdit(item._id)} variant="contained" style={{ backgroundColor: "#4C6F7B", color: "white", marginRight: 8 }}>Edit</Button>
                                            <Button onClick={() => handleDelete(item._id)} variant="contained" style={{ backgroundColor: "#4C6F7B", color: "white" }}>Delete</Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <TablePagination
                        rowsPerPageOptions={[10, 25, 50]}
                        component="div"
                        count={allData.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                        sx={{ color: '#fff', backgroundColor: '#2c3e50' }}
                    />
                </Container>
            </div>
        </div>
    );
};

export default NutritionTracker;
