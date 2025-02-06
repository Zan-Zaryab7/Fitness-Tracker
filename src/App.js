import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './Components/Home';
import { Signup } from './Components/Signup';
import { Login } from './Components/Login';
import Dashboard from './Components/Dashboard/Dashboard';
import AddWorkout from './Components/Dashboard/AddWorkout';
import WorkoutTracker from './Components/Dashboard/WorkoutTracker';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/addworkout" element={<AddWorkout />} />
        <Route path="/workouttracker" element={<WorkoutTracker />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
