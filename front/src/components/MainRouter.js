import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./Login";
import Home from "./Home";
import Files from "./Files";

const MainRouter = () => (
  <Router>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/files" element={<Files />} />
    </Routes>
  </Router>
);

export default MainRouter;
