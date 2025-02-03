import { Container, TextField, Button, Paper, Typography, Box } from "@mui/material";
import { Link } from "react-router-dom";
import { Footer } from "./Footer";
import { Header } from "./Header";

export function Signup() {
    return (
        <Box>
            <Header />
            <Container maxWidth="sm" sx={{ display: "flex", alignItems: "center", justifyContent: "center", mt: '8%', minHeight: '69.7vh' }}>
                <Paper elevation={6} sx={{ padding: 4, borderRadius: 3, width: "100%" }}>
                    <Typography variant="h5" align="center" gutterBottom>
                        Sign Up
                    </Typography>
                    <form>
                        <TextField fullWidth margin="normal" label="Full Name" variant="outlined" />
                        <TextField fullWidth margin="normal" label="Email" type="email" variant="outlined" />
                        <TextField fullWidth margin="normal" label="Password" type="password" variant="outlined" />
                        <Button fullWidth variant="contained" color="primary" sx={{ mt: 2 }}>
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