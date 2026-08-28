# 🌾 KisanConnect — Digital Farmer Marketplace & Community Platform
> *"From Farm to Market, Directly."* | *"किसान से खरीदार तक, सीधे और पारदर्शी तरीके से।"*

KisanConnect is a modern, responsive full-stack agricultural web platform designed to connect **farmers directly with verified wholesale & retail buyers**, provide **transparent APMC Mandi agricultural price discovery**, and foster a **farmer-to-farmer community (Kisan Manch)** for sharing crop advisories and agricultural knowledge.

---

## 🚀 Key Features

1. **🌾 Crop Marketplace with Direct Linkages**:
   - 25+ real Indian crops (Nashik Red Onion, Pusa Basmati 1121, Polyhouse Tomatoes, Sharbati Wheat, Guntur S4 Chillies, Pollachi Coconuts, Nagpur Oranges, Shimla Apples, Nizamabad Turmeric, etc.).
   - Deep multi-attribute filtering (Category, State, District, Distance, Quality Grade, Organic Certified, Verified Farmers).
   - Voice-assisted search and description input with 9 Indian languages.

2. **📊 Agricultural Price Discovery Module**:
   - Interactive APMC Mandi price discovery across states and districts.
   - Recharts 7-day and 30-day historical modal price curves, min/max spreads, and platform listing averages.
   - Real-time **Demand Level Indicator** (🟢 High, 🟡 Medium, 🔴 Low) with underlying factor analytics.
   - Official Mandi source attribution & mandatory legal price disclaimer.

3. **🗺️ Map-Based Regional Discovery**:
   - Interactive Leaflet map with custom color-coded pins for Farmers, Mandis, and Buyer Hubs.
   - Radius discovery ("Near Me"), distance calculation, and 1-click inquiry modals.

4. **🤝 Direct Inquiry & Negotiation Chat**:
   - Formal purchase inquiry submission (Quantity, Proposed Rate, Delivery Date, Terms).
   - Interactive negotiation pipeline (🟡 Pending $\rightarrow$ 🔵 Negotiating $\rightarrow$ 🟢 Accepted $\rightarrow$ 🔴 Rejected).
   - Real-time conversation thread with offer price tagging.

5. **🌱 Kisan Community Manch**:
   - Social agricultural forum across 9 categories (Crop Tips, Pest Management, Fertilizers, Irrigation, Equipment, Weather, Mandi Updates, Success Stories, Q&A).
   - Post creation with voice input, images, like and nested discussion comments.

6. **📱 Multilingual Support (9 Languages)**:
   - English, हिन्दी (Hindi), मराठी (Marathi), ગુજરાતી (Gujarati), ਪੰਜਾਬੀ (Punjabi), தமிழ் (Tamil), తెలుగు (Telugu), ಕನ್ನಡ (Kannada), বাংলা (Bengali).
   - Instant UI language switching with zero page reload.

7. **🎭 1-Click Demo Persona Switcher**:
   - Instant switching between **👨‍🌾 Farmer (Rameshwar Patil)**, **🏢 Buyer (Vikram Singhania)**, and **🛡️ Admin (Krishi Bhawan Authority)** for testing and presentations.

8. **🛡️ Admin & KYC Governance Center**:
   - User KYC verification manager (Approve/Reject farmer land records and buyer GST/APMC licenses).
   - Content moderation & resolution queue for fake listings or reports.

---

## 🛠️ Technology Stack

- **Frontend**: React.js, Vite, Tailwind CSS, React Router v6, Lucide React Icons, Recharts, Leaflet, React-Leaflet, Canvas Confetti, Web Speech API.
- **Backend**: Node.js, Express.js REST APIs, JWT Authentication, CORS, bcryptjs, Mongoose.
- **Database / Resilience**: Dual-mode data tier supporting MongoDB with Mongoose when available, plus an automated high-speed in-memory seed database with full CRUD persistence for immediate, zero-setup execution.

---

## 💻 Local Setup & Running Instructions

### 1. Backend Setup
```bash
cd backend
npm install
npm run dev
# Backend runs on http://localhost:5050
```

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
# Frontend runs on http://localhost:5173
```

### 3. Open in Browser
Visit **`http://localhost:5173`** in your browser.

---

## 📁 Project Structure

```
├── backend/
│   ├── config/          # Database connection handler (MongoDB + In-Memory Fallback)
│   ├── controllers/     # Auth, Listing, Price, Inquiry, Community, Admin controllers
│   ├── data/            # 15+ Farmers, 10+ Buyers, 25+ Crops, 20+ Posts, Mandi Price datasets
│   ├── middleware/      # JWT verification & Role RBAC
│   ├── models/          # 11 Mongoose Data Models
│   ├── routes/          # Express REST API Route handlers
│   ├── services/        # Data store service with CRUD operations
│   ├── server.js        # Express Application entrypoint
│   └── .env             # Configuration & Port settings
│
└── frontend/
    ├── src/
    │   ├── assets/      # Static icons and illustrations
    │   ├── components/  # Reusable UI (Navbar, Footer, MobileNav, CropCard, PriceChart, Map, etc.)
    │   ├── context/     # LanguageContext (9 langs), AuthContext, NotificationContext
    │   ├── pages/       # Home, Marketplace, CropDetails, PriceDiscovery, Map, Community, Dashboards
    │   ├── services/    # Axios HTTP Client
    │   ├── utils/       # Multilingual dictionaries & helpers
    │   ├── App.jsx      # Routing configuration
    │   └── main.jsx     # React root
    └── package.json
```

---

© 2026 KisanConnect Platform. Dedicated to Indian Agriculture.
