import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import MpDashboard from "./pages/MpDashboard";
import JuratDashboard from "./pages/JuratDashboard";
import ProfesorDashboard from "./pages/ProfesorDashboard";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* redirect de la / */}
        <Route path="/" element={<Navigate to="/login" />} />

        <Route path="/login" element={<Login />} />
        <Route path="/mp" element={<MpDashboard />} />
        <Route path="/jurat" element={<JuratDashboard />} />
        <Route path="/profesor" element={<ProfesorDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
