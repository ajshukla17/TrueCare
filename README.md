# 🏥 TrueCare — Doctor Appointment Booking System

> A full-stack healthcare platform for seamless doctor appointment booking, prescription management, and admin control.

---

## ✨ Features

### 👨‍⚕️ Patient (Frontend)

* 🔍 Browse doctors
* 📅 Book appointments
* 💳 Secure online payment (Razorpay)
* 📄 View & download prescriptions
* 🔐 Authentication system

### 🩺 Doctor Panel (Admin)

* 📊 Dashboard with analytics
* 📋 View appointments
* ✍️ Add / Edit prescriptions
* ✅ Mark appointments as completed

### ⚙️ Backend

* 🌐 REST API (Node.js + Express)
* 🗄️ MongoDB database
* 🔐 JWT Authentication
* 📧 Email notifications

---

## 🛠️ Tech Stack

| Layer       | Technology          |
| ----------- | ------------------- |
| Frontend    | React.js            |
| Admin Panel | React.js            |
| Backend     | Node.js, Express.js |
| Database    | MongoDB             |
| Payments    | Razorpay            |
| Auth        | JWT                 |

---

## 📁 Project Structure

```
TrueCare/
│── frontend/   # Patient UI (React)
│── admin/      # Doctor/Admin Dashboard (React)
│── backend/    # API Server (Node.js)
│── README.md
```

---

## ⚙️ Installation & Setup

### 🔹 1. Clone the Repository

```bash
git clone https://github.com/ajshukla17/TrueCare.git
cd TrueCare
```

---

### 🔹 2. Setup Backend

```bash
cd backend
npm install
```

#### Create `.env` file in backend:

```
PORT=5000
MONGO_URI=your_mongodb_connection
JWT_SECRET=your_secret
RAZORPAY_KEY_ID=your_key
RAZORPAY_KEY_SECRET=your_secret
EMAIL_USER=your_email
EMAIL_PASS=your_password
```

#### Run backend:

```bash
npm run server
```

---

### 🔹 3. Setup Frontend

```bash
cd ../frontend
npm install
npm run dev
```

---

### 🔹 4. Setup Admin Panel

```bash
cd ../admin
npm install
npm run dev
```

---

## 🌐 Environment Variables

Make sure to add `.env` in **backend folder only** and never push it to GitHub.

---

## 🚀 Deployment

* Frontend → Vercel -https://truecarehealthtech.vercel.app/
* Admin Panel → Vercel - https://truecare-admin.vercel.app/
* Backend → Render / Railway - https://truecare-backend.onrender.com/
* Database → MongoDB Atlas 

---

## 📸 Screenshots (Optional)

*Add screenshots of your UI here*

---

## 🤝 Contributing

Contributions are welcome!

```bash
fork → clone → create branch → commit → push → PR
```

---

## 📄 License

This project is licensed under the MIT License.

---

## 💡 Author

👤 **Ajitesh Shukla**
🔗 GitHub: https://github.com/ajshukla17



---

## ⭐ Support

If you like this project, give it a ⭐ on GitHub!

---
