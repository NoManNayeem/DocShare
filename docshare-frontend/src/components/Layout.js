// src/components/Layout.js
import React from "react";
import { Outlet } from "react-router-dom";
import { Container } from "react-bootstrap";
import AppNavbar from "./Navbar";
import Footer from "./Footer";

function Layout() {
  return (
    <div className="d-flex flex-column min-vh-100">
      {/* Top navigation */}
      <AppNavbar />

      {/* Main content area */}
      <Container className="flex-grow-1 py-4">
        <Outlet />
      </Container>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default Layout;
