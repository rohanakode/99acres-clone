99acres Clone – Real Estate Web App

A full-stack real estate listing platform inspired by 99acres, built using React, Node.js, Express, MongoDB, and Cloudinary. Users can register, log in, post properties, edit or delete their own listings, view all listings on a responsive interface with AI chatbot support.

Tech Stack: 
React.js (Frontend)
Node.js + Express (Backend)
MongoDB + Mongoose (Database)
Cloudinary (Image Hosting)
JWT (Authentication)
AI Integration (Google Gemini API)
Bootstrap (Styling)
Features
User Authentication (Register & Login)
AI chatbot for customer support
Property Listing with Cloudinary Image Upload
Edit and 🗑 Delete Own Properties
My Listings Page
Public Property Details View
Responsive Design with Bootstrap
Installation (For Local Development)
# Clone the repository
git clone https://github.com/rohanakode/99acres-clone.git

# Install backend dependencies
cd backend
npm install

# Create .env file in /backend with the following:
MONGO_URI=your_mongodb_connection
JWT_SECRET=your_jwt_secret
API_KEY=your_api_key
# Start backend server
npm start

# Install frontend dependencies
cd ../client
npm install

# Create .env file in /client with the following:
REACT_APP_API_BASE=http://localhost:5000

# Start frontend server
npm start
Live demo: https://nine9acres-frontend.onrender.com/
