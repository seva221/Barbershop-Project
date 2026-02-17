import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import BusinessSetup from "./pages/BusinessSetup";
import OwnerDashboard from "./pages/OwnerDashboard";
import AppointmentPage from "./pages/AppointmentPage";

function App() {
  return (
    <AuthProvider>
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
    </AuthProvider>
  );
}

export default App;