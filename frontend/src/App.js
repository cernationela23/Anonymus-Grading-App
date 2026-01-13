import { BrowserRouter, Routes, Route } from 'react-router-dom';

function Login() {
  return <h2>Login page</h2>;
}

function MpDashboard() {
  return <h2>MP Dashboard</h2>;
}

function JuratDashboard() {
  return <h2>Jurat Dashboard</h2>;
}

function ProfesorDashboard() {
  return <h2>Profesor Dashboard</h2>;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/mp" element={<MpDashboard />} />
        <Route path="/jurat" element={<JuratDashboard />} />
        <Route path="/profesor" element={<ProfesorDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
