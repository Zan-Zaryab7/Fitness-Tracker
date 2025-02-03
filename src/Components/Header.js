import { AppBar, Toolbar, Typography, Button } from "@mui/material";
import { Link } from "react-router-dom";

export function Header() {
    return (
        <AppBar position="static" color="primary" sx={{ backgroundColor: '#1a1a1a' }}>
            <Toolbar>
                <Typography variant="h6" sx={{ flexGrow: 1 }}>
                    Fitness Tracker
                </Typography>
                <Button color="inherit" component={Link} to='/'>Home</Button>
                <Button color="inherit">Features</Button>
                <Button color="inherit">Contact</Button>
                <Button color="inherit" component={Link} to='/login'>Login</Button>
            </Toolbar>
        </AppBar>
    );
}