# 🚀 TechTalke - MERN Stack + Socket.IO

![TechTalke Badge](https://img.shields.io/badge/TechTalke-MERN%20%2B%20Socket.IO-blue?style=for-the-badge)

[![Node.js](https://img.shields.io/badge/Node.js-14%2B-green?style=flat-square&logo=node.js)](https://nodejs.org)
[![MongoDB](https://img.shields.io/badge/MongoDB-4.0+-47A248?logo=mongodb)](https://mongodb.com)
[![Express](https://img.shields.io/badge/Express.js-4.17.1-black?logo=express)](https://expressjs.com)
[![React](https://img.shields.io/badge/React-17.x-blue?logo=react)](https://reactjs.org)
[![Socket.IO](https://img.shields.io/badge/Socket.IO-4.x-black?logo=socket.io)
[![Cybersecurity](https://img.shields.io/badge/Cybersecurity-enabled-red?style=flat-square)
[![Cloud Storage](https://img.shields.io/badge/Cloud%20Storage-Integrated-ff69b4?style=flat-square)
[![License](https://img.shields.io/badge/License-MIT-yellow?style=flat-square)](LICENSE)

## 📑 Table of Contents
- [Overview](#overview)
- [Features](#features)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
- [AI Integration](#ai-integration)
- [Cloud Storage](#cloud-storage)
- [Cybersecurity](#cybersecurity)
- [Socket.IO Integration](#socketio-integration)
- [API Documentation](#api-documentation)
- [Testing](#testing)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

## 🚦 Overview
**TechTalke** is a real-time chat application built with MERN Stack (MongoDB, Express, React, Node.js) and Socket.IO. It integrates AI-powered messaging, cloud file storage, and cutting-edge cybersecurity measures to enable seamless, secure communication at scale. 

## ✨ Features
- **Real-Time Messaging:** Reliable, low-latency chats with Socket.IO
- **AI-Powered Chatbot:** Smart suggestions, NLP features, and automated support
- **Cloud Storage:** File sharing, uploads/downloads, persistent storage
- **End-to-End Encryption:** Protect user privacy and message content
- **User Authentication:** JWT tokens, OAuth integration
- **Cybersecurity:** Rate limiting, DDoS protection, input sanitization
- **Responsive UI:** Optimized for desktop and mobile
- **Group & Private Chats:** Media, files, emoji support
- **Chat Analytics:** Usage stats, engagement metrics

## 🏗 Architecture
```
┌─────────┐   ┌────────────┐   ┌────────────┐   ┌─────────────┐   ┌────────────┐
│ Client │<->│ React App  │<->│ Socket.IO  │<->│ Express API │<->│ MongoDB    │
└─────────┘   └────────────┘   └────────────┘   └─────────────┘   └────────────┘
                              │                │
         ┌────────────┐   ┌─────────────┐      │
         │AI Services │   │Cloud Storage│      │
         └────────────┘   └─────────────┘      │
                         └───────────────┘      

```
- **Frontend:** React SPA (Single Page Application)
- **Backend:** Node.js, Express API, integrated with Socket.IO
- **Database:** MongoDB for chat, user, and file metadata
- **AI Services:** NLP and smart message engine via RESTful AI microservices
- **Cloud Storage:** Cloudinary 
- **Security Layer:** Authentication, access controls, encryption, sanitization

## 🛠 Tech Stack
**Frontend:** React, Redux, CSS/Styled Components, Socket.IO client
**Backend:** Node.js, Express, Socket.IO server, JWT/OAuth, AI microservices
**Database:** MongoDB (Mongoose)
**Cloud Storage:** Cloudinary 
**Cybersecurity:** Helmet.js, CORS, bcrypt, rate limiting, input validation, DDoS protection (e.g. Cloudflare)
**AI Tools:** RESTful AI microservices

## ⚡ Installation
### Prerequisites
- Node.js (v14 or higher) & npm/yarn
- Python 3.8+ [For AI microservices]
- MongoDB
- AWS/GCP/Azure credentials [for cloud storage]

### Steps
```bash
git clone https://github.com/yourusername/techtalke.git
cd techtalke
# Install Backend
cd server && npm install
# Install Frontend
cd ../client && npm install

### Configuration
craete env. file in server
DATABASE_URL=
CLIENT_URL=http://localhost:5173
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
PORT=4000
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=
LINKEDIN_CLIENT_ID=
LINKEDIN_CLIENT_SECRET=
JUDGE0_API_KEY=
GEMINI_API_KEY=
REDIS_URL=disabled // Only make it able if it is in production, in development disabled 
CORS_ALLOWED_ORIGINS=http://localhost:5173

client env. file
VITE_APP_SERVER_URL=http://localhost:4000

## 💻 Usage
To start all development servers:
```bash
cd server && npm run dev
cd client && npm start / npm run dev

```
Frontend at `localhost:3000`, API at `localhost:5000`, Socket.IO at `localhost:5000`, AI at `localhost:6000` (default ports)

## 🌐 AI Integration
- **NLP Service:** REST endpoint for intent, sentiment, and entity recognition
- **Smart Reply:** Automated message suggestions
- **Moderation:** Detect inappropriate content/spam
- **AI API Example:**
```python
import requests
r = requests.post('http://localhost:6000/analyze', json={'message':'Hello, TechTalke!'}); print(r.json())
```

## 🔐 Cybersecurity
- **Authentication:** JWT for API, OAuth for social login
- **Encryption:** bcrypt for passwords, TLS for data
- **Security Modules:** Helmet.js, CORS, express-rate-limit
- **Best Practices:** Token expiry, CSRF tokens, input validation, logging


## 📄 License
MIT License

---

**Made with 💙 by the TechTalke Team**

**Crafted with 💙 by the Kethan R Ayatti**
db.users.findOne({username: "kethan"}, {username: 1, email: 1, role: 1, isAdmin: 1, permissions: 1})

ex
