import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import BusinessSetup from "./pages/BusinessSetup";
import OwnerDashboard from "./pages/OwnerDashboard";
import AppointmentPage from "./pages/AppointmentPage";
import Navbar from "./components/Navbar";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/business-setup" element={<BusinessSetup />} />
        <Route path="/dashboard" element={<OwnerDashboard />} />
        <Route path="/appointment/:id" element={<AppointmentPage />} />
      </Routes>
    </Router>
  );
}

export default App;
