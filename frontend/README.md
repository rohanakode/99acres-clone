# 99acres Clone – Real Estate Web App

A full-stack real estate listing platform inspired by 99acres, built using React, Node.js, Express, MongoDB, and Cloudinary. Users can register, log in, post properties, edit or delete their own listings, and view all listings on a responsive interface.

---

## Tech Stack

- React.js (Frontend)
- Node.js + Express (Backend)
- MongoDB + Mongoose (Database)
- Cloudinary (Image Hosting)
- JWT (Authentication)
- Bootstrap (Styling)

---

## Features

- User Authentication (Register & Login)
- Property Listing with Cloudinary Image Upload
- Edit and 🗑 Delete Own Properties
- My Listings Page
- Public Property Details View
- Responsive Design with Bootstrap

---

## Installation (For Local Development)

```bash
# Clone the repository
git clone https://github.com/yourusername/99acres-clone.git

# Install backend dependencies
cd backend
npm install

# Create .env file in /backend with the following:
MONGO_URI=your_mongodb_connection
JWT_SECRET=your_jwt_secret

# Start backend server
npm start

# Install frontend dependencies
cd ../client
npm install

# Create .env file in /client with the following:
REACT_APP_API_BASE=https://nine9acres-clone.onrender.com

# Start frontend server
npm start
```
