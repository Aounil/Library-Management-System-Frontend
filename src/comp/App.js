import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Hello from "./Hello";
import Books from "./Books";
import { UserProvider } from "./UserContext";
import NV from './NV';
import Read from "./Read";
import Favorite from "./Favorite";

export default function App() {
  return (
    <UserProvider>
      <Router>
        <NV />
        <Routes>
          <Route path="/" element={<Hello />} />
          <Route path="/Books" element={<Books />} />
          <Route path="/read" element={<Read />} />
          <Route path="/Favorite" element={<Favorite />} />
        </Routes>
      </Router>
    </UserProvider>
  );
}
