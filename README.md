# BharatCraft

**Discover the Soul of India's Craft.**
BharatCraft is a premium e-commerce platform connecting users with authentic Indian artisans. It provides a robust marketplace for handcrafted products, dynamic map-based discovery, and custom order tracking across a fully responsive Progressive Web App architecture.

---

## 🚀 Features
- **Role-Based Authentication**: Secure login/signup differentiating Customers, Artisans, and Admins.
- **E-Commerce Flows**: Live filtering dual-slider product grids, secure shopping carts, and a step-by-step interactive checkout flow calculating localized delivery algorithms natively.
- **Artisan Ecosystem**: Interactive Admin/Artisan dashboards permitting direct inventory management, customized fulfillment tracking, and seamless revenue plotting.
- **Map-Based Discovery**: Interactive Google Maps instances clustering specialized UI overlay markers dynamically tracking artisanal heritage geographically.
- **PWA Ready**: Offline-first service caching routing seamlessly through `manifest.json`.
- **Wishlists & Orders**: Collapsible accordion logic mapping visual timeline delivery graphics natively. 

---

## 🛠 Setup & Installation

**1. Clone the repository / Open the folder**
Navigate to the root directory where `index.html` is located.

**2. Configure Firebase**
1. Go to the [Firebase Console](https://console.firebase.google.com).
2. Create a new project and add a Web App.
3. Open `js/firebase-config.js` and locate the `firebaseConfig` object.
4. Replace the dummy config values with your actual Firebase API keys.
5. In your Firebase Console, enable:
   * **Authentication**: Email/Password provider
   * **Firestore Database**
   * **Storage** (optional, for image uploads)

**3. Set Up Security Rules**
Deploy the robust database security rules mapped inside `firestore.rules`:
\`\`\`bash
firebase deploy --only firestore:rules
\`\`\`
*(Alternatively, copy the contents of `firestore.rules` directly into the "Rules" tab in your Firebase Console under Firestore Database).*

**4. Google Maps API**
1. Generate an API key from the [Google Cloud Console](https://console.cloud.google.com).
2. Ensure the "Maps JavaScript API" is enabled.
3. Open `index.html` and locate line 49:
   \`\`\`javascript
   window.GOOGLE_MAPS_API_KEY = 'YOUR_GOOGLE_MAPS_API_KEY';
   \`\`\`
   Replace the placeholder with your actual Maps key to enable Map Discovery natively.

---

## 🖥️ Running Locally & Seeding Data

You do not need a complex Node.js server. The application maps entirely natively over static web bounds utilizing Firebase CDN structures!

1. Use a local server to run the project (e.g., Live Server extension in VS Code, or `python -m http.server 8000`).
2. Open the application in your browser (usually `http://127.0.0.1:8000`).
3. **Seed The Database:**
   To populate your fresh Firebase Firestore with 8 authentic artisans and 24 products instantly:
   * Open your browser's Developer Tools Console (`F12`).
   * Type: `window.seedDatabase()` and hit Enter.
   * Wait for the console confirmation. Refresh the page to see your catalog!

---

## 🌍 Deployment

BharatCraft is deeply optimized for **Firebase Hosting**.

1. Install Firebase CLI: `npm install -g firebase-tools`
2. Login to your account: `firebase login`
3. Initialize hosting (if not yet configured): `firebase init hosting`
   * Select your project.
   * Specify the current directory (`.`) as your public directory.
   * Configure as a single-page app (rewrite all URLs to `/index.html`).
4. Execute Deploy:
   \`\`\`bash
   firebase deploy --only hosting
   \`\`\`

---

## 📁 Architecture Overview
*   **`js/`**: Contains the core logic modules (`firebase-config.js`, `auth.js`, `cart.js`, `router.js`, `utils.js`).
*   **`pages/`**: Single-Page Application (SPA) renderers mapping DOM strings inherently (e.g., `home.js`, `products.js`, `auth-page.js`).
*   **`styles/`**: Granular compartmentalized CSS modules mapping component boundaries, orchestrated universally via `premium-polish.css`. 

Enjoy Exploring BharatCraft! 🇮🇳
