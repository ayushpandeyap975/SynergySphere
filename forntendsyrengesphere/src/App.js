import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Projects from "./pages/Projects";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<h2>Home Page</h2>} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/projects" element={<Projects />} />
      </Routes>
    </Router>
  );
}

export default App;
