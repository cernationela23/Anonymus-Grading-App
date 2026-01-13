import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import MPDashboard from "./pages/MPDashboard";
import StudentDashboard from "./pages/StudentDashboard";
import JuryPage from "./pages/Jury";
import ProfessorPage from "./pages/ProfessorPage";

function Protected({ allowedRoles, children }) {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  if (!token) return <Navigate to="/login" replace />;
  if (allowedRoles && !allowedRoles.includes(role)) return <Navigate to="/login" replace />;

  return children;
}

function JuratDashboard() {
  return <h2>Jurat Dashboard</h2>;
}

function ProfesorDashboard() {
  return <h2>Profesor Dashboard</h2>;
}

function HomeRedirect() {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  if (!token) return <Navigate to="/login" replace />;

  if (role === "MP") return <Navigate to="/mp" replace />;
  if (role === "JURAT") return <Navigate to="/jurat" replace />;
  if (role === "PROFESOR") return <Navigate to="/profesor" replace />;

  return <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomeRedirect />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profesor" element={<ProfessorPage />} />

        <Route
          path="/mp"
          element={
            <Protected allowedRoles={["MP"]}>
              <MPDashboard />
            </Protected>
            
          }
        />

        <Route
          path="/jurat"
          element={
            <Protected allowedRoles={["JURAT"]}>
              <JuratDashboard />
            </Protected>
          }
        />
        <Route
          path="/student"
          element={
            <Protected>
              <StudentDashboard />
            </Protected>
          }
        />

        <Route
          path="/jury"
          element={
            <Protected>
              <JuryPage />
            </Protected>
          }
        />

        <Route
          path="/profesor"
          element={
            <Protected allowedRoles={["PROFESOR"]}>
              <ProfesorDashboard />
            </Protected>
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
