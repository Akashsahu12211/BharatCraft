# BharatCart - Full Stack Marketplace

BharatCart is a multi-page handcrafted marketplace experience with a connected backend for products, authentication, cart, and orders.

## Tech Stack

Frontend:
- HTML
- CSS
- Vanilla JavaScript

Backend:
- Node.js
- Express.js
- MongoDB + Mongoose
- JWT Authentication
- bcrypt password hashing

## Pages

- index.html
- products.html
- artisans.html
- product-details.html
- orders.html
- login.html
- signup.html

## Shared Assets

- css/style.css
- css/components.css
- js/ui.js
- js/main.js
- assets/images
- assets/icons

## Frontend Features

- Sticky responsive navigation with mobile menu
- Premium hero and card-based UI with glassmorphism accents
- Product search/filter/sort with API-backed data
- Product details loaded dynamically by product id
- Cart drawer + inline cart with live totals
- Checkout flow that creates real orders in database
- My Orders tracking page with status updates
- Auth-connected login/signup using backend APIs
- Admin product CRUD panel (admin users)
- Smooth scrolling, reveal effects, and staggered card animations

## Backend Structure

`server/`
- `server.js`
- `config/`
- `controllers/`
- `middleware/`
- `models/`
- `routes/`

## API Endpoints

Auth:
- `POST /api/auth/signup`
- `POST /api/auth/login`

Products:
- `GET /api/products`
- `GET /api/products/:id`
- `POST /api/products` (admin)
- `PUT /api/products/:id` (admin)
- `DELETE /api/products/:id` (admin)

Cart:
- `GET /api/cart`
- `POST /api/cart`

Orders:
- `POST /api/orders`
- `GET /api/orders/:userId`
- `PUT /api/orders/:id` (admin)

## Run Locally

1. Start MongoDB locally (`mongodb://127.0.0.1:27017`).
2. Start backend:
	- `cd server`
	- `npm install`
	- `npm run start`
3. Open frontend with Live Server (recommended) at `http://127.0.0.1:5501`.

Backend environment config is in `server/.env` (and template `server/.env.example`).

If backend is unavailable, frontend handles API failures with user-friendly messages and keeps UI stable.
