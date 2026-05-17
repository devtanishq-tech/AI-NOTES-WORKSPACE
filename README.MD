# 📝 AI Notes App

A full-stack note-taking application powered by AI. Write, organize, and share notes — with AI assistance built right in.

---

## 📁 Project Structure

```
AI_NOTES_WO/
├── Backend/
│   ├── middleware/
│   │   └── authFile.js        # JWT authentication middleware
│   ├── models/
│   │   ├── Note.js            # Note database model
│   │   └── User.js            # User database model
│   ├── utils/
│   │   ├── generateToken.js   # JWT token generator
│   │   └── groq.js            # Groq AI integration
│   ├── .env                   # Environment variables (not committed)
│   ├── package.json
│   └── server.js              # Main Express server entry point
│
└── frontend/
    └── src/
        ├── assets/            # Static files (images, icons)
        ├── components/        # Reusable UI components
        │   ├── AILoader.jsx       # AI loading animation
        │   ├── DashboardStats.jsx # Stats overview widget
        │   ├── Navbar.jsx         # Top navigation bar
        │   ├── NoteCard.jsx       # Individual note card
        │   ├── NoteEditor.jsx     # Note creation/editing panel
        │   ├── SearchBar.jsx      # Search input component
        │   └── Sidebar.jsx        # Side navigation
        ├── context/
        │   └── AuthContext.jsx    # Global authentication state
        ├── hooks/
        │   └── useAuth.js         # Custom auth hook
        ├── layouts/
        │   └── MainLayout.jsx     # Shared page layout wrapper
        ├── pages/
        │   ├── Dashboard.jsx      # Main notes dashboard
        │   ├── Login.jsx          # Login page
        │   ├── Signup.jsx         # Registration page
        │   └── SharedNote.jsx     # Public shared note view
        ├── services/
        │   └── api.js             # Axios API service layer
        ├── App.jsx
        └── main.jsx
```

---

## ⚙️ Environment Variables

Create a `.env` file inside the `Backend/` folder before running the server.

```env
# Server
PORT=5000

# Database
MONGO_URI=your_mongodb_connection_string

# Authentication
JWT_SECRET=your_jwt_secret_key

# AI (Groq)
GROQ_API_KEY=your_groq_api_key
```

> ⚠️ Never commit your `.env` file. It's already listed in `.gitignore`.

---

## 🚀 Installation

### Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/) v18 or higher
- [npm](https://www.npmjs.com/) v9 or higher
- A [MongoDB](https://www.mongodb.com/) database (local or Atlas)
- A [Groq](https://console.groq.com/) API key for AI features

---

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/ai-notes-app.git
cd ai-notes-app
```

### 2. Install Backend Dependencies

```bash
cd Backend
npm install
```

### 3. Install Frontend Dependencies

```bash
cd ../frontend
npm install
```

---

## ▶️ Running the App

### Start the Backend

```bash
cd Backend
node server.js
```

The backend will start at: `http://localhost:5000`

### Start the Frontend

Open a new terminal window:

```bash
cd frontend
npm run dev
```

The frontend will start at: `http://localhost:5173`

> Make sure **both** the backend and frontend are running at the same time.

---

## 🧪 Testing the Application

### 1. Register an Account

Go to `http://localhost:5173/signup` and create a new account.

### 2. Log In

Head to `/login` and sign in with your credentials.

### 3. Create a Note

From the Dashboard, click to open the Note Editor and write your first note.

### 4. Use AI Features

Look for the AI assist button inside the Note Editor — it uses Groq to help generate or improve your content.

### 5. Test the API Directly (Optional)

You can test backend routes using [Postman](https://www.postman.com/) or `curl`:

```bash
# Register a user
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name": "Test User", "email": "test@example.com", "password": "password123"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "password": "password123"}'
```

Use the token returned from login in the `Authorization: Bearer <token>` header for protected routes.

---

## 🔒 How Authentication Works

- On login/signup, the backend generates a **JWT token** using `generateToken.js`
- The token is stored on the frontend and attached to every API request via `api.js`
- Protected backend routes use `authFile.js` middleware to verify the token before granting access

---

## 🤖 AI Integration

The app uses **Groq** (via `utils/groq.js`) to power AI note assistance. Groq provides fast inference using models like LLaMA. Make sure your `GROQ_API_KEY` is set in `.env` for this feature to work.

---

## 🛠️ Tech Stack

| Layer    | Technology               |
| -------- | ------------------------ |
| Frontend | React, Vite, CSS Modules |
| Backend  | Node.js, Express         |
| Database | MongoDB (Mongoose)       |
| Auth     | JWT                      |
| AI       | Groq API                 |

---

## 📌 Common Issues

**Frontend can't connect to backend**
Make sure the backend is running on port `5000` and that your `api.js` base URL matches.

**MongoDB connection error**
Double-check your `MONGO_URI` in `.env`. If using Atlas, whitelist your IP address.

**AI features not working**
Verify your `GROQ_API_KEY` is valid and correctly set in `.env`.
