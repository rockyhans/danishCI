import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import Visit from "./components/Visit";
import CCompilerVisit from "./components/CCompilerVisit";
import JavaCompilerVisit from "./components/JavaCompilerVisit";
import PythonCompilerVisit from "./components/PythonCompilerVisit";
import CppCompilerVisit from "./components/CppCompilerVisit";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Visit />} />
        <Route path="/CCompilerVisit" element={<CCompilerVisit />} />
        <Route path="/JavaCompilerVisit" element={<JavaCompilerVisit />} />
        <Route path="/PythonCompilerVisit" element={<PythonCompilerVisit />} />
        <Route path="/CppCompilerVisit" element={<CppCompilerVisit />} />
      </Routes>
    </Router>
  );
};

export default App;
