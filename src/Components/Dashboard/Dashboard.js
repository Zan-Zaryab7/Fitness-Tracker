import { Box } from "@mui/material";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

export default function Dashboard() {
    return (
        <div className="app">
            <Sidebar />
            <div className="main-content">
                <Navbar />
                <Box>
                    <h2>Fitness Dashboard</h2>
                </Box>
            </div>
        </div>
    );
}