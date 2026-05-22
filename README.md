# ChatGPT Clone

A full-stack AI chat application built with **React**, **Express**, **MongoDB**, **Socket.io**, **Google Gemini AI**, and **Pinecone Vector Database**.

---

## Features

- **User Authentication** — Register and login with JWT-based auth (bcrypt-hashed passwords, HTTP-only cookies)
- **Real-time Chat** — WebSocket-powered messaging via Socket.io with typing indicators
- **AI Responses** — Powered by Google Gemini (`gemini-3-flash-preview`)
- **Vector Memory** — Chat messages are embedded (`gemini-embedding-001`) and stored in Pinecone for semantic recall
- **Chat Management** — Create, rename, and switch between multiple conversation threads
- **Responsive UI** — Mobile-friendly with collapsible sidebar, gradient-themed modern design
- **Protected Routes** — Authenticated routes with loading spinners and redirect guards

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 19, React Router 7, Socket.io Client, Vite 8 |
| **Backend** | Express 5, Mongoose 9, Socket.io 4 |
| **Database** | MongoDB (Atlas) |
| **AI / Embeddings** | Google Gemini (`gemini-3-flash-preview`, `gemini-embedding-001`) |
| **Vector Store** | Pinecone |
| **Auth** | JWT + bcryptjs + HTTP-only cookies |

---

## Project Structure

```
chatgpt/
├── backend/
│   ├── server.js                   # Entry point — creates HTTP server, wires DB + sockets
│   ├── .env                        # Environment variables (Mongo URI, JWT secret, API keys)
│   ├── package.json
│   ├── public/                     # Built frontend served in production
│   └── src/
│       ├── app.js                  # Express app config (routes, static files, cookie-parser)
│       ├── db/db.js                # MongoDB connection via Mongoose
│       ├── controllers/
│       │   ├── auth.controller.js  # Register / Login / Profile / Logout
│       │   └── chat.controller.js  # CRUD for chats, message sending with AI + vector memory
│       ├── middleware/
│       │   └── auth.middleware.js  # JWT verification middleware
│       ├── models/
│       │   ├── user.model.js       # User schema (email, password, fullname)
│       │   ├── chat.model.js       # Chat schema (userId, title, messages[])
│       │   └── message.model.js    # Message sub-document schema
│       ├── routes/
│       │   ├── auth.router.js      # /api/auth/*
│       │   └── chat.router.js      # /api/chat/*
│       ├── service/
│       │   ├── ai.service.js       # Gemini text generation & embedding
│       │   └── vector.service.js   # Pinecone upsert & query operations
│       └── sockets/
│           └── socket.server.js    # Socket.io real-time messaging
│
├── frontend/
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js              # Vite config with dev proxy to backend
│   └── src/
│       ├── main.jsx                # React entry point
│       ├── App.jsx                 # Router setup (ProtectedRoute, PublicRoute)
│       ├── index.css               # Global styles + CSS custom properties
│       ├── contexts/
│       │   ├── AuthContext.jsx      # Auth state + login/register/logout methods
│       │   └── SocketContext.jsx    # Socket.io connection + real-time message hooks
│       ├── services/
│       │   └── api.js              # Axios-like HTTP helpers for backend API calls
│       ├── pages/
│       │   ├── Login.jsx           # Login page with styled form
│       │   ├── Register.jsx        # Registration page
│       │   └── ChatPage.jsx        # Main chat layout (Sidebar + ChatArea)
│       └── components/
│           ├── Sidebar.jsx         # Chat list, new chat dialog, user info, logout
│           ├── ChatArea.jsx        # Message display, input bar, suggestions, typing indicator
│           └── Message.jsx         # Individual message bubble (user/AI)
│
├── .gitignore
└── README.md
```

---

## Prerequisites

- **Node.js** >= 18
- **MongoDB** (local or Atlas URI)
- **Google Gemini API Key** — [Get one here](https://aistudio.google.com/apikey)
- **Pinecone API Key** + Index — [Pinecone Console](https://app.pinecone.io)

---

## Setup

### 1. Clone the repository

```bash
git clone <repo-url>
cd chatgpt
```

### 2. Install dependencies

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 3. Configure environment variables

Create [`backend/.env`](backend/.env):

```env
MONGODB_URI=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/CHATGPT
jwt_private_key=<your-jwt-secret>
GEMINI_API_KEY=<your-gemini-api-key>
PINECONE_API_KEY=<your-pinecone-api-key>
```

### 4. Create Pinecone Index

Create an index named `chatgpt` with **768 dimensions** (matching `gemini-embedding-001` output) and **cosine** similarity metric.

### 5. Run the application

```bash
# Terminal 1 — Backend (port 3000)
cd backend
npm run dev

# Terminal 2 — Frontend (port 5173, proxied to backend)
cd frontend
npm run dev
```

Then open **http://localhost:5173** in your browser.

### 6. Production build

```bash
cd frontend
npm run build
```

The built files land in [`backend/public/`](backend/public/). The backend serves them as static files, so you only need to run the backend in production:

```bash
cd backend
node server.js
```

---

## API Endpoints

### Auth — `/api/auth`

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| `POST` | `/api/auth/register` | Register a new user | No |
| `POST` | `/api/auth/login` | Login and receive JWT cookie | No |
| `GET` | `/api/auth/profile` | Get current user profile | Yes |
| `GET` | `/api/auth/logout` | Clear auth cookie | Yes |

### Chat — `/api/chat`

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| `POST` | `/api/chat/create` | Create a new chat | Yes |
| `GET` | `/api/chat/mychats` | Get all user chats | Yes |
| `GET` | `/api/chat/messages/:chatId` | Get messages for a chat | Yes |
| `POST` | `/api/chat/send-message/:chatId` | Send message + get AI response | Yes |

### WebSocket

Socket.io connection at `/socket.io` with events:

- **Client → Server**: `send-message` (sends user message, triggers AI + vector processing)
- **Server → Client**: `receive-response` (streams AI reply back)

---

## How It Works

1. **User sends a message** via the ChatArea input or Socket.io
2. **Vector embedding** is generated from the user's message using Gemini Embedding
3. **Pinecone query** retrieves semantically similar past messages for context
4. **Gemini** generates a response using the conversation history + retrieved memory
5. **Response embedding** is stored in Pinecone for future recall
6. **Message is delivered** to the client in real-time via Socket.io
7. **Full conversation** is persisted in MongoDB

---

## Environment Variables Reference

| Variable | Description |
|---|---|
| `MONGODB_URI` | MongoDB connection string |
| `jwt_private_key` | Secret key for signing JWT tokens |
| `GEMINI_API_KEY` | Google Gemini API key |
| `PINECONE_API_KEY` | Pinecone API key |

---

## License

MIT