#🛒 E-Store: Full-Stack MERN E-Commerce Platform
-A high-performance, responsive e-commerce application built with the MERN Stack (MongoDB, Express, React, Node.js). This project features a clean UI/UX, real-time cart management, and a robust admin dashboard for product and order handling.

=>🚀 Live Links
-Frontend: https://estore-nu.vercel.app/
-Backend (Rabbit API): https://e-store-bhkz.onrender.com

=>✨ Key Features
-User Authentication: Secure Login & Signup with JWT and protected routes.
-Product Catalog: Dynamic product listing with category filtering.
-Shopping Cart: Add, remove, and update item quantities with persistent state.
-Image Management: Integrated with Cloudinary for seamless product image uploads.
-Admin Suite: Dedicated dashboard to manage inventory, categories, and track orders.
-Payment Ready: Integrated with PayPal for secure checkout transactions.
-Responsive Design: Built with Tailwind CSS for a perfect experience on mobile and desktop.

=>🛠️ Tech Stack
->Category   Technology
-Frontend   React.js, Vite, Redux Toolkit, Tailwind CSS
-Backend    Node.js, Express.js
-Database   MongoDB Atlas (Mongoose ODM)
-Media      Cloudinary API
-Deployment Vercel (Frontend), Render (Backend)

=>📁 Project Structure
->Plaintext
-E_STORE/
 ├── frontend/     # React + Vite application (Deployed on Vercel)
 └── backend/      # Node + Express API (Deployed on Render)

=>📦 Installation & Local Setup
1.Clone the repository:
 Bash
  git clone https://github.com/Ketal528/E_STORE.git
  cd E_STORE
2.Setup Backend:
 Bash
  cd backend
  npm install
  # Create a .env file and add your MONGO_URL, JWT_SECRET, and Cloudinary keys
  npm start
3.Setup Frontend:
 Bash
  cd ../frontend
  npm install
  # Create a .env file and add VITE_BACKEND_URL=http://localhost:9000
  npm run dev
