// src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import Layout from "./components/Layout";
import PrivateRoute from "./components/PrivateRoute";

import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import DocumentList from "./pages/DocumentList";
import DocumentEditor from "./pages/DocumentEditor";

function App() {
  return (
    <Router>
      <Routes>
        {/* Wrap all routes with shared layout (Navbar, etc.) */}
        <Route element={<Layout />}>
          {/* Public routes */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected routes (require auth) */}
          <Route
            path="/documents"
            element={
              <PrivateRoute>
                <DocumentList />
              </PrivateRoute>
            }
          />
          <Route
            path="/documents/:id"
            element={
              <PrivateRoute>
                <DocumentEditor />
              </PrivateRoute>
            }
          />
        </Route>

        {/* Catch-all route for unknown paths */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
