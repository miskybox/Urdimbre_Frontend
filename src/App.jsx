import { Routes, Route } from "react-router-dom";
import LoginPage from "./pages/login/LoginPage";
import RegisterPage from "./pages/register/RegisterPage";
import Home from "./pages/home/Home";
import ProfessionalsPage from "./pages/professionals/ProfessionalsPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/profesionales" element={<ProfessionalsPage />} />
    </Routes>
  );
}
export default App;
