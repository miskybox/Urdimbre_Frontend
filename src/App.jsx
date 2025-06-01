import { Routes, Route } from "react-router-dom";
import LoginPage from "./pages/login/LoginPage";
import RegisterPage from "./pages/register/RegisterPage";
import MainLayout from "./components/mainLayout/MainLayout";

function App() {
  return (
    //  <Routes>
    //  <Route path="/login" element={<LoginPage />} />
    //<Route path="/register" element={<RegisterPage />} />
    //</Routes>

    <div>
      <MainLayout />
    </div>
  );
}
export default App;
