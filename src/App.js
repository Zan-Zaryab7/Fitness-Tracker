import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './Components/Home';
import { Signup } from './Components/Signup';
import { Login } from './Components/Login';
import Dashboard from './Components/Dashboard/Dashboard';
import WorkoutTracker from './Components/Dashboard/Workout/WorkoutTracker';
import AddWorkout from './Components/Dashboard/Workout/AddWorkout';
import EditWorkout from './Components/Dashboard/Workout/EditWorkout';
import AddNutrition from './Components/Dashboard/Nutritions/AddNutritions';
import NutritionTracker from './Components/Dashboard/Nutritions/NutritionTracker';
import EditNutrition from './Components/Dashboard/Nutritions/EditNutrition';

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
        <Route path="/editworkout/:id" element={<EditWorkout />} />
        <Route path="/addnutritions" element={<AddNutrition />} />
        <Route path="/nutritionstracker" element={<NutritionTracker />} />
        <Route path="/editnutrition/:id" element={<EditNutrition />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
