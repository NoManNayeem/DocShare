# Collaborative Document Editor – Feature Overview (POC)

## 🎯 Objective
Enable **multiple authenticated users** to collaborate on a **shared document** in real time, similar to Google Docs, with optional live cursors. The solution must remain **lightweight, modular, and testable** for MVP purposes.

---

## ✅ Core Features

### 1. **Document CRUD + Ownership**
- **Backend**: Django REST Framework
- Authenticated users can create, update, and delete documents.
- Only the document owner or shared collaborators can access/edit.

### 2. **Sharing Functionality**
- Share a document with another user via `DocumentShare` model.
- Option to enable/disable editing (`can_edit` boolean).
- List of collaborators and permissions available in document detail.

### 3. **WebSocket Collaboration**
- Real-time collaboration using Django Channels + WebSockets.
- When a user types, it broadcasts the latest content to others in the room.
- User joins/leaves are broadcasted to all clients.

### 4. **Live Collaboration Metadata**
- Display current active users with their assigned colors.
- Show "X is editing…" messages in activity feed.

### 5. **Access Control**
- Users can only edit if:
  - They are the **owner**, or
  - They have `can_edit=True` in `DocumentShare`.

### 6. **Document Syncing**
- WebSocket channel: `/ws/doc/<doc_id>/?token=...`
- Broadcast updates to all clients in room.
- Frontend uses `react-use-websocket` for connection & updates.

---

## 🧪 Optional: Live Cursor (Advanced)
**Not implemented yet** – proposed features:
- Cursor position syncing via WebSocket (`type: 'cursor.update'`).
- Assign a unique color per user.
- Show cursor labels (username badge) near cursor.
- Only visible while user is actively typing.

---

## 📦 Backend Components
- Models:
  - `Document`: core content
  - `DocumentShare`: permissions + access control
- Serializers:
  - `DocumentSerializer`, `DocumentShareSerializer`
- Views:
  - `DocumentViewSet`, `DocumentShareViewSet`
- WebSocket:
  - `DocumentSyncConsumer` with JWT token support

## 💻 Frontend Components
- `DocumentEditor.js`:
  - Textarea-based editor, WebSocket sync, live users
- `ShareDocumentForm.js`:
  - User dropdown, edit permission checkbox
- Auth context: `AuthContext.js` (provides JWT token)
- API hook: `useAxios.js`

---

## 📌 API Endpoints
- `GET /api/documents/` – list all accessible docs (owned + shared)
- `POST /api/documents/` – create new doc
- `GET /api/documents/<id>/` – get single doc detail
- `POST /api/shares/` – share document with another user

---

## ✅ Notes
- **PDF export is FE-only** (handled via browser print or jsPDF).
- Ensure WebSocket token is passed as `?token=<access_token>`.

---

## 🔁 Future Enhancements
- **Live cursor sharing** (optional)
- Typing indicator (debounced)
- Document version history