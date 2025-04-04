import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PageSolicitudesList from "./components/PageSolicitudesList";
import PageNuevaSolicitud from "./components/PageNuevaSolicitud";
import './index.css';

//funcion principal
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<PageSolicitudesList />} />
        <Route path="/nuevo" element={<PageNuevaSolicitud />} />
      </Routes>
    </Router>
  );
}

export default App;
