// src/components/Navbar.js
import React, { useContext } from "react";
import {
  Navbar,
  Nav,
  Container,
  NavDropdown,
} from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import {
  FaUserCircle,
  FaSignOutAlt,
  FaSignInAlt,
  FaUserPlus,
  FaFolderOpen,
} from "react-icons/fa";

function AppNavbar() {
  const { user, logoutUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutUser();
    navigate("/login");
  };

  return (
    <Navbar bg="light" expand="lg" className="shadow-sm" sticky="top">
      <Container>
        <Navbar.Brand
          as={Link}
          to="/"
          className="fw-bold text-primary"
          style={{ fontSize: "1.4rem" }}
        >
          DocShare
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="navbar-nav" />
        <Navbar.Collapse id="navbar-nav">
          <Nav className="me-auto">
            {user && (
              <Nav.Link as={Link} to="/documents">
                <FaFolderOpen className="me-2" />
                My Documents
              </Nav.Link>
            )}
          </Nav>
          <Nav className="align-items-center">
            {!user ? (
              <>
                <Nav.Link as={Link} to="/login">
                  <FaSignInAlt className="me-2" />
                  Login
                </Nav.Link>
                <Nav.Link as={Link} to="/register">
                  <FaUserPlus className="me-2" />
                  Register
                </Nav.Link>
              </>
            ) : (
              <NavDropdown
                title={
                  <>
                    <FaUserCircle className="me-2" />
                    {user.username}
                  </>
                }
                id="user-nav-dropdown"
                align="end"
              >
                <NavDropdown.Item onClick={handleLogout}>
                  <FaSignOutAlt className="me-2" />
                  Logout
                </NavDropdown.Item>
              </NavDropdown>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default AppNavbar;
