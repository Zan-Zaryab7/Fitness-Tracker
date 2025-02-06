import { Container, TextField, Button, Paper, Typography, Box } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { Footer } from "./Footer";
import { Header } from "./Header";
import { useState } from "react";

export function Signup() {
    const [name, setName] = useState();
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();

    const navigate = useNavigate();

    const handleOnSubmit = async (e) => {
        e.preventDefault();
        let result = await fetch(
            'http://localhost:5000/register', {
            method: "post",
            body: JSON.stringify({ name, email, password }),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        result = await result.json();
        console.warn(result);
        if (result) {
            setEmail("");
            setName("");
            setPassword("");

            navigate("/login")
        }
    }

    return (
        <Box>
            <Header />
            <Container maxWidth="sm" sx={{ display: "flex", alignItems: "center", justifyContent: "center", mt: '8%', minHeight: '69.7vh' }}>
                <Paper elevation={6} sx={{ padding: 4, borderRadius: 3, width: "100%" }}>
                    <Typography variant="h5" align="center" gutterBottom>
                        Sign Up
                    </Typography>
                    <form>
                        <TextField required value={name} onChange={e => setName(e.target.value)} fullWidth margin="normal" label="Full Name" variant="outlined" />
                        <TextField required value={email} onChange={e => setEmail(e.target.value)} fullWidth margin="normal" label="Email" type="email" variant="outlined" />
                        <TextField required value={password} onChange={e => setPassword(e.target.value)} fullWidth margin="normal" label="Password" type="password" variant="outlined" />
                        <Button onClick={handleOnSubmit} fullWidth variant="contained" color="primary" sx={{ mt: 2 }}>
                            Sign Up
                        </Button>
                    </form>
                    <Typography align="center" variant="body2" sx={{ mt: 2 }}>
                        Already have an account? <Button sx={{ backgroundColor: "#fff" }} component={Link} to='/login'>Login</Button>
                    </Typography>
                </Paper>
            </Container>
            <Footer />
        </Box>
    );
}