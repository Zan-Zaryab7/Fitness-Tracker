import { Button } from '@mui/material';
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Sidebar = () => {
    const navigate = useNavigate();

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
        <div className="sidebar">
            <h2>Dashboard</h2>
            <nav>
                <ul>
                    <li>
                        <Button color="inherit" onClick={() => navigate("/")}>Home</Button>
                    </li>
                    <li>
                        <Button color="inherit" component={Link} to='/dashboard'>Dashboard</Button>
                    </li>
                    <li>
                        <Button color="inherit" component={Link} to='/addworkout'>Add Workouts</Button>
                    </li>
                    <li>
                        <Button color="inherit" component={Link} to='/workouttracker'>Workout Tracker</Button>
                    </li>
                    <li>
                        <Button color="inherit" component={Link} to='/addnutritions'>Add Nutritions</Button>
                    </li>
                    <li>
                        <Button color="inherit" onClick={handleLogout}>Logout</Button>
                    </li>
                </ul>
            </nav>
        </div>
    );
};

export default Sidebar;
