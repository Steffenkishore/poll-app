# ⚡ AskIt – Real-Time Polling App

A real-time polling platform that enables instant audience participation and dynamic result visualization for interactive sessions such as classrooms, events, and team discussions.

🌐 **Live Demo:** https://askit-ashy.vercel.app/

---

## 🚀 Overview

AskIt is designed to collect and visualize opinions instantly. Users can create polls, share them with participants, and view live results as votes are submitted. The platform focuses on speed, simplicity, and real-time engagement.

---

## 🎯 Key Features

- **Real-time polling** with instant vote updates  
- **Dynamic result visualization**  
- **Simple poll creation interface**  
- **Interactive and responsive UI**  
- **Multiple users can vote simultaneously**  
- **Seamless frontend-backend integration**  

---

## 🧠 Problem & Solution

**Problem:**  
Traditional feedback collection methods are slow and lack engagement, making it difficult to gather instant audience insights.

**Solution:**  
AskIt enables real-time interaction where users can vote instantly and view results dynamically, improving engagement and decision-making.

---

## ⚙️ Tech Stack

- React – Frontend UI  
- JavaScript – Application logic  
- Node.js – Backend runtime  
- Express.js – API handling  
- MongoDB – Data storage  

---

## 🧩 System Architecture

User → React UI → API Request → Backend (Node/Express) → Database → Response → UI Update

---

## 🔄 Real-Time Functionality

The application is designed to reflect poll results instantly as users vote, ensuring a seamless and interactive experience.

---


## 🛠️ Setup Instructions

Run the following commands to start the project locally:

```bash
git clone https://github.com/your-username/askit.git
cd askit
npm install
npm start
```

## 🔐 Environment Variables

Create a .env file in both frontend and in backend

for frontend
```bash
REACT_APP_API_URL=your_backend_server_url
```
for backend
```bash
MONGODB_URL=mongodb_database_url
PORT=port_number
```

---

## 🔮 Future Improvements
- **WebSocket-based real-time updates for better performance**
- **Authentication system** (user-based voting)
- **Poll analytics and insights**
- **QR-based poll access**
- **AI-based summary of poll results**

---

## 📄 License

This project is for educational and demonstration purposes
