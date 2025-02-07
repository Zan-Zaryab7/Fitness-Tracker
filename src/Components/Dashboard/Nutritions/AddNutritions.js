import React, { useState, useEffect } from "react";
import axios from "axios";
import { Container, TextField, Button, Typography, List, ListItem, ListItemText } from "@mui/material";
import Sidebar from "../Sidebar";
import Navbar from "../Navbar";

const AddNutrition = () => {
    const [foodItems, setFoodItems] = useState("");
    const [nutritionData, setNutritionData] = useState([]);

    useEffect(() => {
        if (foodItems.trim() !== "") {
            fetchNutritionData();
        } else {
            setNutritionData([]);
        }
    }, [foodItems]);

    const fetchNutritionData = async () => {
        const appId = "787f4c8d";
        const appKey = "9bc2b778bf254b552b3780e0c538ad30";
        const url = "https://trackapi.nutritionix.com/v2/natural/nutrients";

        try {
            const response = await axios.post(
                url,
                { query: foodItems },
                {
                    headers: {
                        "Content-Type": "application/json",
                        "x-app-id": appId,
                        "x-app-key": appKey,
                    },
                }
            );
            setNutritionData(response.data.foods);
        } catch (error) {
            console.error("Error fetching nutrition data:", error);
        }
    };

    const handleAddNutrition = async () => {
        if (nutritionData.length === 0) return;

        try {
            await axios.post("http://localhost:5000/add/nutrition", {
                nutritionList: nutritionData.map(food => ({
                    food_name: food.food_name,
                    calories: food.nf_calories,
                    protein: food.nf_protein,
                    carbs: food.nf_total_carbohydrate,
                    fat: food.nf_total_fat,
                })),
            });

            alert("Nutrition data added successfully!");
            setFoodItems("");
        } catch (error) {
            console.error("Error adding nutrition data:", error);
        }
    };

    return (
        <div className="app">
            <Sidebar />
            <div className="main-content">
                <Navbar />
                <Container sx={{ marginTop: 5 }}>
                    <Typography variant="h4" gutterBottom>
                        Add Multiple Food Items
                    </Typography>
                    <TextField
                        label="Enter Food Items (comma-separated)"
                        fullWidth
                        value={foodItems}
                        onChange={(e) => setFoodItems(e.target.value)}
                    />
                    {nutritionData.length > 0 && (
                        <div style={{ marginTop: "20px" }}>
                            <Typography variant="h6">Nutrition Details:</Typography>
                            <List>
                                {nutritionData.map((food, index) => (
                                    <ListItem key={index}>
                                        <ListItemText
                                            primary={food.food_name}
                                            secondary={`Calories: ${food.nf_calories} kcal | Protein: ${food.nf_protein}g | Carbs: ${food.nf_total_carbohydrate}g | Fat: ${food.nf_total_fat}g`}
                                        />
                                    </ListItem>
                                ))}
                            </List>

                            <Button
                                onClick={handleAddNutrition}
                                variant="contained"
                                sx={{ mt: 2, backgroundColor: "#2c3e50" }}
                            >
                                Add Nutrition
                            </Button>
                        </div>
                    )}
                </Container>
            </div>
        </div>
    );
};

export default AddNutrition;
