import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Container, TextField, Button, Typography, Grid } from "@mui/material";
import Sidebar from "../Sidebar";
import Navbar from "../Navbar";
import { GoogleGenerativeAI } from "@google/generative-ai"; // Assuming this is correctly set up

const genAI = new GoogleGenerativeAI("AIzaSyB39a5LZpnAdmsZkej1EbJCUsZQl-SZGp8"); // Replace with your API key

const EditNutrition = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [food_name, setFoodName] = useState("");
    const [quantity, setQuantity] = useState(1);
    const [calories, setCalories] = useState(0);
    const [protein_g, setProteinG] = useState(0);
    const [carbohydrates_g, setCarbohydratesG] = useState(0);
    const [fat_g, setFatG] = useState(0);
    const [loading, setLoading] = useState(false);
    const fetchTimeout = useRef(null); // Ref to handle timeout

    // Fetch nutrition when food_name or quantity changes (debounced)
    useEffect(() => {
        // Clear previous timeout if the user is typing
        if (fetchTimeout.current) clearTimeout(fetchTimeout.current);

        // Set a new timeout to fetch nutrition data after 2 seconds of inactivity
        fetchTimeout.current = setTimeout(() => {
            fetchNutritionData();
        }, 2000); // 2-second delay after user stops typing or changing quantity

        return () => clearTimeout(fetchTimeout.current); // Cleanup timeout on re-renders
    }, [food_name, quantity]); // Trigger effect when food_name or quantity changes

    const getResponseForGivenPrompt = async (prompt) => {
        try {
            setLoading(true);
            const model = genAI.getGenerativeModel({ model: "gemini-pro" });
            const result = await model.generateContent(prompt);
            const response = result.response;
            const text = response.text();
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

    const fetchNutritionData = async () => {
        if (!food_name.trim()) return;

        setLoading(true);

        // Fetch nutrition details using AI for each attribute
        const calories = await fetchSingleAttribute(food_name, "calories");
        const protein_g = await fetchSingleAttribute(food_name, "protein in grams");
        const carbohydrates_g = await fetchSingleAttribute(food_name, "carbohydrates in grams");
        const fat_g = await fetchSingleAttribute(food_name, "fat in grams");

        // Update state with the fetched values
        setCalories(parseFloat(calories) * quantity);
        setProteinG(parseFloat(protein_g) * quantity);
        setCarbohydratesG(parseFloat(carbohydrates_g) * quantity);
        setFatG(parseFloat(fat_g) * quantity);

        setLoading(false);
    };

    const handleOnSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`http://localhost:5000/edit/nutrition/${id}`, {
                food_name,
                quantity,
                calories,
                protein_g,
                carbohydrates_g,
                fat_g
            });
            navigate("/nutritionstracker");
        } catch (error) {
            console.error("Error updating nutrition:", error);
        }
    };

    return (
        <div className="app">
            <Sidebar />
            <div className="main-content">
                <Navbar />
                <Container sx={{ marginTop: 5 }}>
                    <Typography variant="h4" gutterBottom>Edit Nutrition</Typography>
                    <Grid container spacing={2}>
                        <Grid item xs={6}>
                            <TextField
                                fullWidth
                                label="Food Name"
                                value={food_name}
                                onChange={(e) => setFoodName(e.target.value)}
                            />
                        </Grid>
                        <Grid item xs={3}>
                            <TextField
                                type="number"
                                fullWidth
                                label="Quantity"
                                inputProps={{ min: 1 }}
                                value={quantity}
                                onChange={(e) => setQuantity(e.target.value)}
                            />
                        </Grid>
                        <Grid item xs={3}>
                            <TextField
                                type="number"
                                fullWidth
                                label="Calories"
                                value={calories}
                                disabled
                            />
                        </Grid>
                        <Grid item xs={3}>
                            <TextField
                                type="number"
                                fullWidth
                                label="Protein (g)"
                                value={protein_g}
                                disabled
                            />
                        </Grid>
                        <Grid item xs={3}>
                            <TextField
                                type="number"
                                fullWidth
                                label="Carbohydrates (g)"
                                value={carbohydrates_g}
                                disabled
                            />
                        </Grid>
                        <Grid item xs={3}>
                            <TextField
                                type="number"
                                fullWidth
                                label="Fat (g)"
                                value={fat_g}
                                disabled
                            />
                        </Grid>
                    </Grid>
                    {loading && <Typography variant="body2">Fetching nutrition data...</Typography>}
                    <Button
                        onClick={handleOnSubmit}
                        variant="contained"
                        sx={{ mt: 2, backgroundColor: '#2c3e50', color: 'white' }}
                    >
                        Update Nutrition
                    </Button>
                </Container>
            </div>
        </div>
    );
};

export default EditNutrition;
