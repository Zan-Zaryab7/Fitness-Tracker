import { Typography, Container, Box } from "@mui/material";

export function Footer() {
    return (
        <Box component="footer" sx={{ backgroundColor: '#1a1a1a', color: "white", py: 3, mt: 5, textAlign: "center" }}>
            <Container>
                <Typography variant="body2">&copy; {new Date().getFullYear()} Fitness Tracker. All rights reserved.</Typography>
            </Container>
        </Box>
    );
}