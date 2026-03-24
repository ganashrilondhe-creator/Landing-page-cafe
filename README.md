# Brew & Co — Cafe Landing Page

> A modern, responsive café landing page with a fully integrated reservation system — featuring real-time admin controls and automated email notifications.

---

## 🔗 Live Demo

**[View Live →](https://your-deployed-link.vercel.app)** *(replace with your Vercel/Netlify URL)*

---

## 📌 Overview

Café Reserve simulates a real-world café booking experience. Customers can explore the café, submit table reservations, and receive email updates on their booking status — all through a clean, intuitive interface. On the backend, café staff manage reservations through a dedicated admin dashboard, accepting or rejecting bookings with a single click.

This project was built to demonstrate end-to-end full-stack development: from a polished customer-facing UI to a functional admin panel with email automation.

---

## ✨ Features

### 👤 Customer Side
- Responsive, visually appealing landing page
- Table reservation form with client-side input validation
- Email notifications for reservation **confirmation** and **rejection**
- Smooth, intuitive UX throughout the booking flow

### 🛠️ Admin Side
- Dashboard to view all incoming reservation requests
- One-click **Accept ✅** or **Reject ❌** for each booking
- Real-time reservation status updates
- Clean, efficient management interface

---

## 🧰 Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React.js, HTML5, CSS3, JavaScript |
| Backend | Node.js, Express.js |
| Email Service | Nodemailer |
| Version Control | Git & GitHub |

---

## 📂 Project Structure

```
cafe-reserve/
│
├── public/               # Static assets (images, icons, fonts)
├── src/
│   ├── components/       # Reusable React components
│   ├── pages/            # Page-level components (Home, Admin)
│   ├── styles/           # CSS / styling files
│   └── utils/            # Helper functions and API calls
│
├── server/               # Express.js backend
│   ├── routes/           # API route handlers
│   └── mailer.js         # Nodemailer email configuration
│
├── package.json
└── README.md
```

---

## ⚙️ Getting Started

### Prerequisites
- Node.js (v16 or above)
- npm or yarn

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/yourusername/cafe-reserve.git

# 2. Navigate into the project directory
cd cafe-reserve

# 3. Install dependencies
npm install

# 4. Start the development server
npm start
```

The app will run at **http://localhost:3000**

> **Note:** If the project has a separate backend server, navigate into the `/server` directory and run `node index.js` (or `npm run dev`) in a second terminal.

---

## 📧 How the Reservation System Works

```
Customer fills out reservation form
         ↓
Reservation stored & sent to Admin Dashboard
         ↓
Admin reviews the request
    ┌────┴────┐
  Accept     Reject
    ↓           ↓
Confirmation  Rejection
  email sent   email sent
    ↓           ↓
Customer notified via email
```

1. **Customer** submits the reservation form with their name, date, time, and party size
2. **Admin** sees the request appear in the dashboard
3. **Admin** accepts or rejects the booking
4. **Customer** receives an automated email reflecting the decision

---

## 📸 Screenshots

> *(Add your screenshots here)*

```
![Landing Page](./public/screenshots/home.png)
![Reservation Form](./public/screenshots/form.png)
![Admin Dashboard](./public/screenshots/admin.png)
```

---

## 🎯 Planned Enhancements

- [ ] User authentication (login / signup)
- [ ] Real-time booking updates via WebSockets
- [ ] Payment integration for advance reservations
- [ ] Live table availability tracking
- [ ] Admin analytics dashboard
- [ ] Mobile-first UI improvements

---

## 💡 Key Learnings

- Building a full-stack application with React and Express
- Handling and validating form data on both client and server
- Implementing transactional email workflows with Nodemailer
- Designing an admin panel for real-world operational use
- Managing project structure and version control with Git

---

## 👩‍💻 Author

**Ganashri**

[![GitHub](https://img.shields.io/badge/GitHub-yourusername-181717?logo=github)](https://github.com/yourusername)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Connect-0077B5?logo=linkedin)](https://linkedin.com/in/yourprofile)

---

## ⭐ Acknowledgements

Built as a personal learning project to understand real-world web application workflows — from frontend design through to backend automation and admin tooling.

---

*If you found this project helpful or interesting, consider leaving a ⭐ on the repository!*
