import React, { useEffect, useRef, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useWebSocket from "react-use-websocket";
import AuthContext from "../context/AuthContext";
import useAxios from "../api/axios";
import {
  Container,
  Row,
  Col,
  Card,
  Badge,
  Form,
  Alert,
  Spinner,
} from "react-bootstrap";
import ShareDocumentForm from "../components/ShareDocumentForm";

function DocumentEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { authTokens, user } = useContext(AuthContext);
  const api = useAxios(authTokens);

  const [document, setDocument] = useState(null);
  const [content, setContent] = useState("");
  const [canEdit, setCanEdit] = useState(false);
  const [messages, setMessages] = useState([]);
  const [activeUsers, setActiveUsers] = useState({});
  const editorRef = useRef(null);

  const wsUrl = `ws://localhost:8000/ws/doc/${id}/?token=${authTokens?.access}`;

  const { sendMessage, lastMessage, readyState } = useWebSocket(wsUrl, {
    onOpen: () => console.log("✅ WebSocket connected"),
    onClose: () => console.log("❌ WebSocket disconnected"),
    shouldReconnect: () => true,
  });

  // 🔄 Fetch document & determine permissions
  useEffect(() => {
    const fetchDoc = async () => {
      try {
        const res = await api.get(`/api/documents/${id}/`);
        setDocument(res.data);
        setContent(res.data.content || "");

        const currentUserId = user?.user_id;
        const isOwner = res.data.owner.id === currentUserId;
        const shared = res.data.shared_with.find(u => u.id === currentUserId);
        setCanEdit(isOwner || shared?.can_edit);
      } catch (err) {
        console.error("Failed to fetch document:", err);
        alert("Could not load the document. Redirecting back.");
        navigate("/documents");
      }
    };

    fetchDoc();
  }, [api, id, navigate, user]);

  // 📡 Handle WebSocket messages
  useEffect(() => {
    if (!lastMessage) return;

    try {
      const data = JSON.parse(lastMessage.data);
      const { type, username, color, message } = data;

      switch (type) {
        case "join":
          setActiveUsers((prev) => ({
            ...prev,
            [username]: color,
          }));
          addMessage(`${username} joined`);
          break;

        case "leave":
          setActiveUsers((prev) => {
            const updated = { ...prev };
            delete updated[username];
            return updated;
          });
          addMessage(`${username} left`);
          break;

        case "message":
          setContent(message);
          addMessage(`${username} is editing...`);
          break;

        default:
          break;
      }
    } catch (err) {
      console.error("WebSocket message parsing error:", err);
    }
  }, [lastMessage]);

  const addMessage = (msg) => {
    setMessages((prev) => [...prev.slice(-4), msg]);
  };

  const handleChange = (e) => {
    const value = e.target.value;
    setContent(value);
    if (canEdit && readyState === WebSocket.OPEN) {
      sendMessage(JSON.stringify({ message: value }));
    }
  };

  if (!document) {
    return (
      <Container className="mt-4 text-center">
        <Spinner animation="border" />
        <div>Loading document...</div>
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      <Row>
        <Col md={9}>
          <Card className="p-3 shadow-sm">
            <h4 className="mb-3">{document.title}</h4>
            {!canEdit && (
              <Alert variant="warning">You have read-only access to this document.</Alert>
            )}
            <Form.Control
              as="textarea"
              rows={20}
              value={content}
              ref={editorRef}
              onChange={handleChange}
              readOnly={!canEdit}
              style={{ fontFamily: "monospace", background: "#fcfcfc" }}
            />
          </Card>
        </Col>

        <Col md={3}>
          <Card className="p-3 shadow-sm">
            <h6 className="fw-semibold">🟢 Live Collaborators</h6>
            {Object.entries(activeUsers).length === 0 ? (
              <p className="text-muted small">No other users online.</p>
            ) : (
              Object.entries(activeUsers).map(([username, color]) => (
                <Badge
                  key={username}
                  bg="light"
                  text="dark"
                  className="d-block mb-2 px-2 py-1"
                  style={{ borderLeft: `5px solid ${color}` }}
                >
                  {username}
                </Badge>
              ))
            )}

            <h6 className="mt-4 fw-semibold">📢 Activity</h6>
            <ul className="list-unstyled small text-muted">
              {messages.map((msg, idx) => (
                <li key={idx}>• {msg}</li>
              ))}
            </ul>

            <hr />
            <ShareDocumentForm documentId={id} />
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default DocumentEditor;
