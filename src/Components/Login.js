import { Container, TextField, Button, Paper, Typography, Box } from "@mui/material";
import { Link } from "react-router-dom";
import { Header } from "./Header";
import { Footer } from "./Footer";

export function Login() {
    return (
        <Box>
            <Header />
            <Container maxWidth="sm" sx={{ display: "flex", alignItems: "center", justifyContent: "center", mt: '6%', minHeight: '73.2vh' }}>
                <Paper elevation={6} sx={{ padding: 4, borderRadius: 3, width: "100%" }}>
                    <Typography variant="h5" align="center" gutterBottom>
                        Login
                    </Typography>
                    <form>
                        <TextField fullWidth margin="normal" label="Email" type="email" variant="outlined" />
                        <TextField fullWidth margin="normal" label="Password" type="password" variant="outlined" />
                        <Button fullWidth variant="contained" color="primary" sx={{ mt: 2 }}>
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