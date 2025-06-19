// src/components/SharedUserItem.js
import React from "react";
import { Button, FormCheck } from "react-bootstrap";

function SharedUserItem({ user, onToggleEdit, onUnshare }) {
  return (
    <div className="d-flex justify-content-between align-items-center mb-2 border p-2 rounded">
      <div>
        <strong>{user.username}</strong>
        <FormCheck
          inline
          type="switch"
          id={`edit-toggle-${user.id}`}
          label="Can Edit"
          checked={user.can_edit}
          onChange={() => onToggleEdit(user)}
        />
      </div>
      <Button
        variant="outline-danger"
        size="sm"
        onClick={() => onUnshare(user)}
      >
        Remove
      </Button>
    </div>
  );
}

export default SharedUserItem;
