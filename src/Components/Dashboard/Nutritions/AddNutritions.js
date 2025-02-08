import React, { useState, useEffect, useRef } from "react";
import { Container, TextField, Typography, List, ListItem, ListItemText, Button } from "@mui/material";
import Sidebar from "../Sidebar";
import Navbar from "../Navbar";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { useNavigate } from "react-router-dom";

const genAI = new GoogleGenerativeAI("AIzaSyB39a5LZpnAdmsZkej1EbJCUsZQl-SZGp8"); // Replace with your key

const AddNutrition = () => {
    const [foodItems, setFoodItems] = useState("");
    const [nutritionData, setNutritionData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [userName, setUserName] = useState(null);
    const fetchTimeout = useRef(null); // Ref to handle timeout

    const navigate = useNavigate();

    // Use useEffect to set userName from localStorage to prevent re-renders
    useEffect(() => {
        const storedUserName = localStorage.getItem("userName");
        if (storedUserName) {
            setUserName(storedUserName);
        }
    }, []);

    const parseFoodItem = (item) => {
        const match = item.match(/^(\d+)\s*(.+)$/);
        if (match) {
            return { quantity: parseInt(match[1], 10), food_name: match[2].trim() };
        }
        return { quantity: 1, food_name: item.trim() }; // Default quantity = 1
    };

    const getResponseForGivenPrompt = async (prompt) => {
        try {
            setLoading(true);
            const model = genAI.getGenerativeModel({ model: "gemini-pro" });
            const result = await model.generateContent(prompt);
            const response = result.response;
            const text = response.text();
            console.log(`Response for "${prompt}":`, text);
            setLoading(false);
            return text.trim();
        } catch (error) {
            console.error("Error fetching response:", error);
            setLoading(false);
            return "N/A";
        }
    };

    const fetchSingleAttribute = async (foodItem, attribute) => {
        const prompt = `What ${attribute} does this "${foodItem}" have? Reply with the exact answer. No extra text or numbers.`;
        return await getResponseForGivenPrompt(prompt);
    };

    const handleNaN = (value, defaultValue = 0) => {
        // If value is NaN or "N/A", return default value (0 in this case, or you can use "N/A")
        return isNaN(parseFloat(value)) || value === "N/A" ? defaultValue : parseFloat(value);
    };

    const fetchNutritionData = async () => {
        if (!foodItems.trim()) return;

        setLoading(true);
        const itemsArray = foodItems.split(",").map(item => parseFoodItem(item.trim()));
        const nutritionResults = [];

        for (const item of itemsArray) {
            const { quantity, food_name } = item;
            console.log(`Fetching data for: ${quantity} ${food_name}`);

            // Fetch nutrition data using AI model
            const calories = await fetchSingleAttribute(food_name, "calories");
            const protein_g = await fetchSingleAttribute(food_name, "protein in grams");
            const carbohydrates_g = await fetchSingleAttribute(food_name, "carbohydrates in grams");
            const fat_g = await fetchSingleAttribute(food_name, "fat in grams");

            // Handle NaN values and set default values if necessary
            nutritionResults.push({
                user_name: userName,
                quantity,
                food_name,
                calories: handleNaN(calories, 0) * quantity, // Default to 0 if NaN
                protein_g: handleNaN(protein_g, 0) * quantity, // Default to 0 if NaN
                carbohydrates_g: handleNaN(carbohydrates_g, 0) * quantity, // Default to 0 if NaN
                fat_g: handleNaN(fat_g, 0) * quantity // Default to 0 if NaN
            });
        }

        setNutritionData(nutritionResults);
        setLoading(false);
    };

    const saveNutritionDataToBackend = async (nutritionResults) => {
        try {
            const response = await fetch("http://localhost:5000/add/nutrition", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ nutritionData: nutritionResults }),
            });

            if (!response.ok) {
                throw new Error("Failed to save nutrition data.");
            }

            console.log("Nutrition data saved successfully!");
        } catch (error) {
            setError("Error saving nutrition data.");
            console.error("Error saving nutrition data:", error);
        }
    };

    const handleSaveData = () => {
        if (nutritionData.length > 0) {
            saveNutritionDataToBackend(nutritionData);
            setFoodItems("");
            setNutritionData([]);

            navigate('/nutritionstracker');
        } else {
            alert("Please fetch nutrition data before saving.");
        }
    };

    // Debounced Effect: Fetch data when user stops typing for 2 second
    useEffect(() => {
        if (fetchTimeout.current) clearTimeout(fetchTimeout.current);
        fetchTimeout.current = setTimeout(() => {
            fetchNutritionData();
        }, 2000); // 2-second delay after user stops typing

        return () => clearTimeout(fetchTimeout.current); // Cleanup timeout on re-renders
    }, [foodItems]);

    return (
        <div className="app">
            <Sidebar />
            <div className="main-content">
                <Navbar />
                <Container sx={{ marginTop: 5 }}>
                    <Typography variant="h4" gutterBottom>
                        Add Nutrition
                    </Typography>
                    <TextField
                        label="Enter Food Items (e.g., 1 apple, 4 eggs)"
                        fullWidth
                        value={foodItems}
                        onChange={(e) => setFoodItems(e.target.value)}
                    />

                    {loading && <Typography variant="body2">Fetching nutrition data...</Typography>}
                    {error && <Typography variant="body2" color="error">{error}</Typography>}

                    {nutritionData.length > 0 && (
                        <div style={{ marginTop: "20px" }}>
                            <Typography variant="h6">Nutrition Details:</Typography>
                            <List>
                                {nutritionData.map((food, index) => (
                                    <ListItem key={index}>
                                        <ListItemText
                                            primary={`${food.quantity} - ${food.food_name}`}
                                            secondary={`Calories: ${food.calories} kcal | Protein: ${food.protein_g}g | Carbs: ${food.carbohydrates_g}g | Fat: ${food.fat_g}g`}
                                        />
                                    </ListItem>
                                ))}
                            </List>
                        </div>
                    )}

                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleSaveData}
                        sx={{ marginTop: "20px", backgroundColor: '#2c3e50' }}
                    >
                        Save Data
                    </Button>
                </Container>
            </div>
        </div>
    );
};

export default AddNutrition;
