// src/components/Footer.js
import React from "react";
import { Container } from "react-bootstrap";
import { FaRegCopyright } from "react-icons/fa";

function Footer() {
  return (
    <footer className="bg-light border-top shadow-sm mt-auto py-3">
      <Container className="text-center">
        <small className="text-muted">
          <FaRegCopyright className="me-1" />
          {new Date().getFullYear()} DocShare. All rights reserved.
        </small>
      </Container>
    </footer>
  );
}

export default Footer;
