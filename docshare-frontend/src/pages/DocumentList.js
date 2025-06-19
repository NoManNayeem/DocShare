import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Card,
  Container,
  Row,
  Col,
  Spinner,
  Badge,
  Stack,
} from "react-bootstrap";
import useAxios from "../api/axios";
import AuthContext from "../context/AuthContext";

function DocumentList() {
  const { authTokens } = useContext(AuthContext);
  const api = useAxios(authTokens);
  const navigate = useNavigate();
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDocs = async () => {
      try {
        const res = await api.get("/api/documents/");
        setDocuments(res.data);
      } catch (err) {
        console.error("Failed to fetch documents:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDocs();
  }, [api]);

  const handleCreate = async () => {
  try {
    const res = await api.post("/api/documents/", {
      title: "Untitled Document",
      content: "",
    });

    console.log("Created document:", res.data); // ✅ Debug log
    if (res.data?.id) {
      navigate(`/documents/${res.data.id}`);
    } else {
      alert("Document created but no ID returned.");
    }
  } catch (err) {
    console.error("Failed to create document:", err);
    alert("Something went wrong while creating the document.");
  }
};


  return (
    <Container className="mt-4">
      <Row className="align-items-center mb-4">
        <Col>
          <h3 className="fw-bold">📄 My Documents</h3>
        </Col>
        <Col className="text-end">
          <Button variant="success" onClick={handleCreate}>
            + New Document
          </Button>
        </Col>
      </Row>

      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" role="status" />
          <div className="mt-2">Loading your documents...</div>
        </div>
      ) : documents.length === 0 ? (
        <p className="text-center text-muted">You haven't created or received any documents yet.</p>
      ) : (
        <Row xs={1} sm={2} md={3} lg={4} className="g-4">
          {documents.map((doc) => (
            <Col key={doc.id}>
              <Card className="h-100 shadow-sm">
                <Card.Body>
                  <Card.Title className="mb-2 text-truncate">{doc.title}</Card.Title>
                  <Card.Text className="small text-muted">
                    Updated: {new Date(doc.updated_at).toLocaleString()}
                  </Card.Text>

                  <Stack direction="horizontal" gap={2} className="mt-3">
                    <Badge bg={doc.is_shared ? "info" : "secondary"}>
                      {doc.is_shared ? "Shared" : "Private"}
                    </Badge>
                    <div className="ms-auto">
                      <Button
                        variant="outline-primary"
                        size="sm"
                        onClick={() => navigate(`/documents/${doc.id}`)}
                      >
                        Open
                      </Button>
                    </div>
                  </Stack>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
}

export default DocumentList;
