import { Container, TextField, Button, Paper, Typography, Box } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { useState } from "react";
import axios from "axios";

export function Login() {
    const [email, setEmail] = useState();
    const [pass, setPass] = useState();

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post('http://localhost:5000/login', { email, pass });

            const { name, token } = response.data; // Adjust according to your API response

            localStorage.setItem('userName', name);
            localStorage.setItem('userEmail', email);
            localStorage.setItem('authToken', token);

            navigate('/dashboard');
        } catch (err) {
            console.error('Login error:', err); // Log the full error for debugging
        }
    };

    return (
        <Box>
            <Header />
            <Container maxWidth="sm" sx={{ display: "flex", alignItems: "center", justifyContent: "center", mt: '6%', minHeight: '73.2vh' }}>
                <Paper elevation={6} sx={{ padding: 4, borderRadius: 3, width: "100%" }}>
                    <Typography variant="h5" align="center" gutterBottom>
                        Login
                    </Typography>
                    <form>
                        <TextField required value={email} onChange={e => setEmail(e.target.value)} fullWidth margin="normal" label="Email" type="email" variant="outlined" />
                        <TextField required value={pass} onChange={e => setPass(e.target.value)} fullWidth margin="normal" label="Password" type="password" variant="outlined" />
                        <Button onClick={handleSubmit} fullWidth variant="contained" color="primary" sx={{ mt: 2 }}>
                            Login
                        </Button>
                    </form>
                    <Typography align="center" variant="body2" sx={{ mt: 2 }}>
                        Don't have an account? <Button sx={{ backgroundColor: "#fff" }} component={Link} to='/signup'>Sign Up</Button>
                    </Typography>
                </Paper>
            </Container>
            <Footer />
        </Box>
    );
}