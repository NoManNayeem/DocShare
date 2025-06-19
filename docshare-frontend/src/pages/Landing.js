import React, { useContext } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";

function Landing() {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  return (
    <Container
      fluid
      className="vh-100 d-flex align-items-center justify-content-center bg-light"
    >
      <Row className="w-100 justify-content-center">
        <Col xs={11} md={8} lg={6} className="text-center">
          <h1 className="display-4 fw-bold mb-3 text-primary">Welcome to DocShare</h1>
          <p className="lead text-secondary mb-4">
            Real-time collaboration. Create, share, and edit documents securely with your team — anytime, anywhere.
          </p>

          <div className="d-flex justify-content-center gap-3 flex-wrap">
            {!user ? (
              <>
                <Button variant="primary" size="lg" onClick={() => navigate("/login")}>
                  Login
                </Button>
                <Button variant="outline-primary" size="lg" onClick={() => navigate("/register")}>
                  Register
                </Button>
              </>
            ) : (
              <Button variant="success" size="lg" onClick={() => navigate("/documents")}>
                Go to My Documents
              </Button>
            )}
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default Landing;
