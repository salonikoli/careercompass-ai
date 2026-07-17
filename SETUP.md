# ================================
# HOW TO RUN — Quick Reference
# ================================

# TERMINAL 1 — START MONGODB
cd "C:\Program Files\MongoDB\Server\8.2\bin"
.\mongod --dbpath "C:\data\db"


# TERMINAL 2 — START AUTH SERVER
cd "D:\AI-Powered Career Intelligence System\auth-server"

# First time only
npm install

# Start auth server
npm run dev


# TERMINAL 3 — START PYTHON BACKEND
cd "D:\AI-Powered Career Intelligence System\backend"
.\.venv\Scripts\activate
uvicorn main:app --reload --port 8000


# TERMINAL 4 — START FRONTEND
cd "D:\AI-Powered Career Intelligence System"
npm run dev


# OPEN IN BROWSER
http://localhost:5173
