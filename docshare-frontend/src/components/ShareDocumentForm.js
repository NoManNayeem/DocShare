import React, { useState, useEffect, useContext } from "react";
import useAxios from "../api/axios";
import AuthContext from "../context/AuthContext";
import {
  Form,
  Button,
  Alert,
  Spinner,
  FormCheck,
  Card,
} from "react-bootstrap";

function ShareDocumentForm({ documentId }) {
  const { authTokens } = useContext(AuthContext); // ✅ Get token from context
  const api = useAxios(authTokens); // ✅ Pass token to Axios instance

  const [users, setUsers] = useState([]);
  const [sharedUsers, setSharedUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState("");
  const [canEdit, setCanEdit] = useState(false);
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  // ✅ Load available users (excluding self)
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await api.get("/api/users/");
        setUsers(res.data);
      } catch (err) {
        console.error("❌ Failed to load users", err);
      }
    };
    fetchUsers();
  }, [api]);

  // ✅ Load current shares for this document
  const loadShares = async () => {
    try {
      const res = await api.get("/api/shares/");
      const filtered = res.data.filter((s) => s.document_id === parseInt(documentId));
      setSharedUsers(filtered);
    } catch (err) {
      console.error("❌ Failed to fetch shared users", err);
    }
  };

  useEffect(() => {
    loadShares();
  }, [documentId]);

  // ✅ Share the document with a new user
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
    setLoading(true);

    try {
      await api.post("/api/shares/", {
        document_id: parseInt(documentId),
        shared_with_id: parseInt(selectedUserId),
        can_edit: canEdit,
      });

      setMessage("✅ User successfully added!");
      setSelectedUserId("");
      setCanEdit(false);
      await loadShares();
    } catch (err) {
      console.error("❌ Share error:", err);
      setMessage("❌ Failed to share the document. Maybe already shared?");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Toggle user's edit permission
  const handleToggleEdit = async (share) => {
    try {
      await api.patch(`/api/shares/${share.id}/`, {
        can_edit: !share.can_edit,
      });

      setSharedUsers((prev) =>
        prev.map((s) =>
          s.id === share.id ? { ...s, can_edit: !s.can_edit } : s
        )
      );
    } catch (err) {
      console.error("❌ Failed to update edit access", err);
    }
  };

  // ✅ Remove user from shared list
  const handleUnshare = async (shareId) => {
    try {
      await api.delete(`/api/shares/${shareId}/`);
      setSharedUsers((prev) => prev.filter((s) => s.id !== shareId));
    } catch (err) {
      console.error("❌ Failed to unshare user", err);
    }
  };

  return (
    <>
      <Card className="p-3 mt-4">
        <h6>🔗 Share this Document</h6>
        {message && <Alert variant={message.startsWith("✅") ? "success" : "danger"}>{message}</Alert>}

        <Form onSubmit={handleSubmit}>
          <Form.Select
            value={selectedUserId}
            onChange={(e) => setSelectedUserId(e.target.value)}
            className="mb-2"
            required
          >
            <option value="">Select User</option>
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.username}
              </option>
            ))}
          </Form.Select>

          <FormCheck
            type="checkbox"
            label="Allow Edit"
            checked={canEdit}
            onChange={(e) => setCanEdit(e.target.checked)}
            className="mb-2"
          />

          <Button
            type="submit"
            size="sm"
            variant="primary"
            disabled={!selectedUserId || loading}
          >
            {loading ? <Spinner size="sm" animation="border" /> : "Share"}
          </Button>
        </Form>
      </Card>

      <Card className="p-3 mt-3">
        <h6>👥 Shared With</h6>
        {sharedUsers.length === 0 ? (
          <p className="text-muted">No users shared yet.</p>
        ) : (
          sharedUsers.map((user) => (
            <div
              key={user.id}
              className="d-flex justify-content-between align-items-center border-bottom py-2"
            >
              <span><strong>{user.shared_with.username}</strong></span>
              <div className="d-flex align-items-center">
                <FormCheck
                  type="switch"
                  id={`edit-${user.id}`}
                  label="Can Edit"
                  className="me-3"
                  checked={user.can_edit}
                  onChange={() => handleToggleEdit(user)}
                />
                <Button
                  variant="outline-danger"
                  size="sm"
                  onClick={() => handleUnshare(user.id)}
                >
                  Remove
                </Button>
              </div>
            </div>
          ))
        )}
      </Card>
    </>
  );
}

export default ShareDocumentForm;
