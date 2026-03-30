BharatCraft
Discover the Soul of India's Craft

BharatCraft is a premium e-commerce platform designed to connect users with authentic Indian artisans. It enables seamless discovery, purchase, and tracking of handcrafted products while empowering artisans with digital tools to manage and grow their businesses.

Built as a Progressive Web App (PWA), BharatCraft delivers a fast, responsive, and offline-capable experience.

🚀 Key Features
🔐 Authentication & Roles
Secure role-based authentication
Separate flows for:
Customers
Artisans
Admins
🛒 E-Commerce System
Dynamic product listings with advanced filtering
Interactive shopping cart
Step-by-step checkout process
Location-based delivery cost calculation
🧑‍🎨 Artisan Ecosystem
Dedicated dashboards for artisans and admins
Inventory management system
Order fulfillment tracking
Revenue analytics and insights
🗺️ Map-Based Discovery
Google Maps integration
Clustered artisan locations
Geo-based exploration of crafts across India
📦 Orders & Wishlist
Wishlist functionality
Order history with timeline tracking
Visual delivery progress indicators
⚡ Progressive Web App (PWA)
Offline-first architecture
Service worker caching
Installable on devices
Smooth navigation via manifest.json
🛠️ Tech Stack
Frontend: HTML, CSS, JavaScript
Backend (BaaS): Firebase
Authentication
Firestore Database
Storage
APIs: Google Maps JavaScript API
Architecture: Single Page Application (SPA)
⚙️ Setup & Installation
1. Clone Repository
git clone <your-repo-url>
cd BharatCraft
2. Firebase Configuration
Go to Firebase Console
Create a new project
Add a Web App
Open:
js/firebase-config.js
Replace the firebaseConfig object with your credentials
Enable:
Authentication (Email/Password)
Firestore Database
Storage (optional)
3. Firestore Security Rules

Deploy rules using:

firebase deploy --only firestore:rules

Or manually paste rules in Firebase Console → Firestore → Rules

4. Google Maps Setup
Go to Google Cloud Console
Generate API Key
Enable Maps JavaScript API
Update in index.html:
window.GOOGLE_MAPS_API_KEY = 'YOUR_API_KEY';
▶️ Running Locally

No backend server required 🚀

Start a local server:
python -m http.server 8000

Open:

http://127.0.0.1:8000
🌱 Seed Database (Important)

To populate demo data:

Open browser DevTools (F12)
Run:
window.seedDatabase()
Refresh the page

✔️ Adds:

8 artisans
24 products
🌍 Deployment (Firebase Hosting)
1. Install Firebase CLI
npm install -g firebase-tools
2. Login
firebase login
3. Initialize Hosting
firebase init hosting

Select:

Project
Public directory: .
Single Page App: Yes
4. Deploy
firebase deploy --only hosting
📁 Project Structure
BharatCraft/
│
├── js/                 # Core logic modules
│   ├── firebase-config.js
│   ├── auth.js
│   ├── cart.js
│   ├── router.js
│   └── utils.js
│
├── pages/              # SPA rendering modules
│   ├── home.js
│   ├── products.js
│   └── auth-page.js
│
├── styles/             # Modular CSS
│   └── premium-polish.css
│
├── index.html
└── manifest.json
💡 Highlights
Fully serverless architecture
Real-world startup-grade concept
Combines culture + commerce + technology
Built with scalability in mind
📌 Future Improvements
AI-based product recommendations
Artisan verification system (KYC + heritage validation)
Multi-language support (Hindi, regional languages)
Payment gateway integration (Razorpay/Stripe)
Mobile app version
🤝 Contributing

Contributions are welcome!
Feel free to fork the repo and submit a pull request.
