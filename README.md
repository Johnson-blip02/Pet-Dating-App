# 🐾 Pet Dating App

A full-stack web application where users can create pet profiles, like other pets, and chat in real time.  
Built with **React**, **Tailwind CSS**, **.NET/Express**, **MongoDB**, **WebSockets**, and **Cloudinary**.  
Deployed using **Vercel** (frontend) and **Render** (backend).

---

## 💡 Project Overview

Our project reimagines **networking through the lens of pets**, blending social connection, profile discovery, and real-time communication into a fun and engaging platform. Much like human social networking apps, users create detailed profiles for their pets, explore others based on shared interests or preferences, and connect through a **mutual matching system**. Once a match is formed, they can chat instantly via **WebSockets**, promoting interaction and playful bonding.

---

## ✨ Highlight Features

- 🐶 **Pet-First Social Networking**  
  Users create pet profiles including name, type, age, location, preferences, and photos — making networking lighthearted yet functional.

- 📸 **Cloudinary Image Upload**  
  Profile photos are uploaded to the cloud with real-time preview and backend validation.

- 💬 **Real-Time Chat with WebSockets**  
  Matched pets can start chatting instantly through a WebSocket-powered chat system.

- ❤️ **Like & Match System**  
  Pets can "like" other profiles, and chat is unlocked only when both sides have liked each other.

- 🛠 **Admin Dashboard**  
  Admins can view, edit, and delete pet profiles for moderation and quality control.

- 🌗 **Responsive UI with Theme Support**  
  Fully responsive with **light/dark mode** toggle using Tailwind CSS.

---

## 🚀 Deployment Links

- **Frontend**: [https://pet-dating-app.vercel.app](https://pet-dating-app.vercel.app)
- **Backend**: [https://pet-dating-app-backend.onrender.com/run](https://pet-dating-app-backend.onrender.com/run) _(Ensure backend is running)_

---

## 🐳 Docker Compose (Local Setup)

To run both frontend and backend locally:

```bash
docker compose build
docker compose up -d
```

## ✅ Checklist

- Unit testing components (In the components folder)
- Use a state management library (e.g., Redux)
- Support for theme switching (light/dark mode)
- Dockerize your project using Docker
- Implement WebSockets for real-time features
