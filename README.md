# Zcoder 🚀

Zcoder is a full-stack coding platform where users can solve coding problems, submit solutions in multiple programming languages, participate in upcoming programming contests, track their progress, and interact with other users through real-time chat.

![problem](/screenshots/problem.png)
## 🌐 Live Demo

**Frontend:** <https://zcoder-client.onrender.com/>

**Backend:** <https://zcoder-sdvy.onrender.com/>

---

## ✨ Features

### 🔐 Authentication

* User Registration
* User Login
* JWT-based Authentication
* Protected Routes

### 💻 Coding Platform

* Browse coding problems
* Search and filter problems
* Difficulty-based categorization
* Tag-based filtering
* Favorite problems

### ⚡ Online Judge

* Monaco Code Editor
* Multi-language support:

  * C++
  * Python
  * JavaScript
* Code execution and submission
* Automatic verdict generation

  * Passed
  * Failed

### 📊 User Profile

* Submission history
* Acceptance rate
* Solved problems count
* Favorite problems
* User statistics dashboard

### 🏆 Contest Tracker

* Upcoming programming contests
* Codeforces contests
* CodeChef contests
* LeetCode contests
* AtCoder contests
* Contest filtering and search

### 💬 Real-Time Chat

* User-to-user messaging
* Socket.IO integration
* Real-time communication

---

## 🛠 Tech Stack

### Frontend

* React
* React Router
* Tailwind CSS
* Monaco Editor
* Socket.IO Client

### Backend

* Node.js
* Express.js
* Socket.IO
* JWT Authentication

### Database

* MongoDB Atlas
* Mongoose

### Deployment

* Render
* MongoDB Atlas

---

## 📸 Screenshots

### Home Page

![Home page](/screenshots/homepage.png)

### Problems Page

![Problems page](/screenshots/problems.png)

### Problem Solver

![problem](/screenshots/problem.png)

### Contests Page

![contests](/screenshots/contests.png)

### User Profile
![profile](/screenshots/profile.png)

### Chat System

![chat](/screenshots/chat.png)

---

## 📂 Project Structure

```text
ZCoder
│
├── client
│   ├── src
│   ├── public
│   └── package.json
│
├── server
│   ├── routes
│   ├── controllers
│   ├── models
│   ├── middleware
│   └── package.json
│
└── README.md
```

## ⚙️ Installation

### Clone Repository

```bash
git clone https://github.com/ashu0420/Zcoder.git
cd Zcoder
```

### Frontend Setup

```bash
cd client
npm install
npm start
```

### Backend Setup

```bash
cd server
npm install
npm run dev
```

---

## Environment Variables

### Backend (.env)

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=5000
CLIENT_URL=http://localhost:3000

CLIST_USERNAME=your_clist_username
CLIST_API_KEY=your_clist_api_key
```

### Frontend (.env)

```env
REACT_APP_API_URL=http://localhost:5000
```


---

## 🚀 Future Improvements

* Leaderboard
* Dark Mode
* Friend Requests
* Contest Reminders
* Public User Profiles
* Submission Analytics
* AI-powered Code Review

---

## 👨‍💻 Author

**Asheesh Chauhan**

B.Tech, Engineering Physics, IIT Guwahati

GitHub: `https://github.com/ashu0420`

LinkedIn: `https://www.linkedin.com/in/asheesh-chauhan-ashish/`
