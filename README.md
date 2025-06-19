# 📝 DocShare - Real-Time Collaborative Document Editor

DocShare is a full-stack web application that allows users to create, edit, and collaborate on documents in real time. Built with Django & Django Channels on the backend and React.js with WebSocket support on the frontend.

---

## 📦 Tech Stack

### 🔙 Backend (Django)
- Django REST Framework
- Django Channels (WebSocket)
- JWT Authentication (SimpleJWT)
- PostgreSQL or SQLite3 (development)
- CORS, DRF Schema, Swagger

### 🔜 Frontend (React)
- React Bootstrap
- React Router DOM
- JWT decoding and context-based auth
- `react-use-websocket` for live collaboration

---

## 🚀 Features

- 👤 User Registration & Login (JWT based)
- 📄 Create, edit, and delete documents
- 🔗 Share documents with other users (read-only or edit access)
- 🔄 Live collaboration with WebSocket support
- 🧑‍🤝‍🧑 See who’s online and track live activity
- ✅ Role-based permissions (owner, shared-with)
- 🎨 Beautiful UI with Bootstrap

---

## 🔧 Setup Instructions

### Backend

1. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

2. **Run migrations:**
   ```bash
   python manage.py migrate
   ```

3. **Start development server:**
   ```bash
   python manage.py runserver
   ```

> The backend is served at: `http://localhost:8000/`

### Frontend

1. **Navigate to `frontend/` folder:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start development server:**
   ```bash
   npm start
   ```

> The frontend is served at: `http://localhost:3000/`

---

## 🛠 Project Structure

```
root/
├── backend/
│   ├── documents/          # Document models, views, serializers
│   ├── accounts/           # Auth & user management
│   ├── websocket/          # Consumers & routing for live editing
│   └── settings.py         # Django settings (Channels + REST)
├── frontend/
│   ├── src/
│   │   ├── pages/          # Login, Register, DocumentList, Editor
│   │   ├── components/     # Shared components (ShareForm, etc)
│   │   ├── context/        # AuthContext.js
│   │   └── api/            # Authenticated Axios wrapper
│   └── package.json
├── manage.py
└── README.md
```

---

## 📮 API Endpoints

| Method | Endpoint                     | Description |
|--------|------------------------------|-------------|
| POST   | `/api/accounts/register/`    | Register new user |
| POST   | `/api/accounts/token/`       | Get JWT tokens |
| GET    | `/api/documents/`            | List owned/shared documents |
| POST   | `/api/documents/`            | Create new document |
| GET    | `/api/documents/<id>/`       | Retrieve single document |
| POST   | `/api/shares/`               | Share a document |
| PATCH  | `/api/shares/<id>/`          | Toggle can_edit |
| DELETE | `/api/shares/<id>/`          | Unshare document |
| GET    | `/api/users/`                | List users (excluding current) |

---

## 👨‍💻 Authors

Built with ❤️ by the DataCrunch team.

---

## 📸 Screenshots

<div align="center">

<table>
  <tr>
    <td><img src="./screenshots/Screenshot_1.png" width="100%" /></td>
    <td><img src="./screenshots/Screenshot_2.png" width="100%" /></td>
    <td><img src="./screenshots/Screenshot_3.png" width="100%" /></td>
    <td><img src="./screenshots/Screenshot_4.png" width="100%" /></td>
  </tr>
  <tr>
    <td><img src="./screenshots/Screenshot_5.png" width="100%" /></td>
    <td><img src="./screenshots/Screenshot_6.png" width="100%" /></td>
    <td><img src="./screenshots/Screenshot_7.png" width="100%" /></td>
    <td><img src="./screenshots/Screenshot_8.png" width="100%" /></td>
  </tr>
</table>

</div>

---
### More
1. Use `daphne -p 8000 docshare.asgi:application` To run the development daphane server