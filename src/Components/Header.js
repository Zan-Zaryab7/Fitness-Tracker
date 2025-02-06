import { AppBar, Toolbar, Typography, Button } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";

export function Header() {
    const navigate = useNavigate();

    const userName = localStorage.getItem('userName');

    // Handle logout: clear localStorage and navigate to login page
    const handleLogout = () => {
        try {
            // Clear all items from localStorage
            localStorage.clear();
            console.log("LocalStorage cleared");

            // Redirect to Home page after logout
            navigate('/');
        } catch (err) {
            console.error("Logout Error:", err);
        }
    };

    return (
        <AppBar position="static" color="primary" sx={{ backgroundColor: '#1a1a1a' }}>
            <Toolbar>
                <Typography variant="h6" sx={{ flexGrow: 1 }}>
                    Fitness Tracker
                </Typography>
                <Button color="inherit" component={Link} to='/'>Home</Button>
                <Button color="inherit">Features</Button>
                <Button color="inherit">Contact</Button>
                {userName ?
                    (
                        <>
                            <Button color="inherit" to='/dashboard' component={Link}>Dashboard</Button>
                            <Button color="inherit" onClick={handleLogout}>Logout</Button>
                        </>
                    )
                    :
                    (
                        <>
                            <Button color="inherit" to='/login' component={Link}>Login</Button>
                        </>
                    )
                }
            </Toolbar>
        </AppBar>
    );
}