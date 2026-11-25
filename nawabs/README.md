# 👑 Nawabs — Smart QR Restaurant OS

An authentic, production-grade restaurant operating system built with HTML, Tailwind CSS, JavaScript, Node.js SQLite (`staff.db`), and Google Firebase Cloud Firestore & Authentication.

---

## 🚀 Quick Start

Run the server with native Node.js (zero external dependencies required):

```bash
node server.js
```

Then open your browser at **`http://localhost:3000`**.

### Default Access URLs
- **Main Hub & Portal:** [http://localhost:3000](http://localhost:3000)
- **Customer Dining (Table T01):** [http://localhost:3000/customer.html?table=T01](http://localhost:3000/customer.html?table=T01)
- **Reception Desk:** [http://localhost:3000/reception.html](http://localhost:3000/reception.html)
- **Chef Kitchen Display (KDS):** [http://localhost:3000/chef.html](http://localhost:3000/chef.html)
- **Admin & Operations Dashboard:** [http://localhost:3000/admin.html](http://localhost:3000/admin.html)

### Default Staff Credentials (SQLite `staff.db`)
- **Staff Email:** `staff@restaurant.com` | **Password:** `password123`
- **Admin Email:** `admin@restaurant.com` | **Password:** `admin123`

---

## 📂 Project Architecture

```
Guntur-Gongura-main/
├── index.html            # Main Portal Hub & Digital Menu Cards modal
├── customer.html         # Customer Dining App (Table ordering, Cart, Games, Waiter Call)
├── reception.html        # Front of House Desk (Order acceptance, Service request dispatch)
├── chef.html             # Kitchen Display System (Live urgency timers & ticket queues)
├── admin.html            # Admin Suite (Analytics, Menu manager, Menu cards, Staff accounts, QR generator)
├── shared.js             # Data Layer (GunturDB, ntfy.sh sync, Web Audio chimes, 57 authentic dishes)
├── server.js             # Zero-dependency Node.js HTTP server + native SQLite API & WebP serving
├── staff.db              # SQLite Database storing staff accounts and credentials
├── firebase-config.js    # Firebase credentials (Authentication & Cloud Firestore sync)
├── menu/                 # Official Restaurant Printed Menu Cards (6 WebP sheets)
│   ├── menu_card_1.webp  # Non-Veg Curries & Seafood
│   ├── menu_card_2.webp  # Soups & Veg Starters
│   ├── menu_card_4.webp  # Breads, Baskets & Fried Rice
│   ├── menu_card_5.webp  # Chef Specials & Starters
│   ├── menu_card_6.webp  # Tandoori & Kebabs
│   └── menu_card_7.webp  # Main Course Veg
└── README.md             # Complete system documentation
```

---

## ✨ Features

### 1. 📖 Official Printed Menu Cards
- Complete collection of the restaurant's physical menu cards available directly in the app.
- Interactive modal viewer in both `customer.html` and `index.html` with zoom, page navigation, and category filtering.
- Dedicated gallery preview in `admin.html` with full-resolution inspection.
- All authentic dishes and prices from the cards are indexed in `shared.js` for instant digital ordering.

### 2. 🍽️ Customer Table Service
- URL & QR code table locking (e.g. `?table=T07`).
- Live category filtering: Biryani, Starters, Curries, Tandoori, Breads & Rice, Soups, Beverages, Sweets.
- Pure Veg 🟢 / Non-Veg 🔴 filter toggle.
- Real-time cart calculation with GST and live dish search.
- One-tap Waiter Calling: Plates, Cutlery, Water, Tissues, Bill, or Assistance.
- Interactive Table Games: Tic-Tac-Toe, Memory Game, Rock-Paper-Scissors Bot, and Andhra Culture Quiz.

### 3. 🛎️ Reception Desk (Front of House)
- Live order queue with color-coded urgency timers (<8 min green, 8–15 min amber, >15 min red).
- Order review, item notes, and one-click dispatch to Chef KDS.
- Live service alerts with audio chime notifications.
- Send staff to serve ready tickets.

### 4. 👨‍🍳 Chef Kitchen Display System (KDS)
- Real-time ticket management organized by cooking urgency.
- Status progression: Queued ➔ Cooking ➔ Ready for Pickup.
- High-priority red pulse animations for delayed tickets.
- Web Audio synthesizer alerts when new tickets arrive.

### 5. 📊 Admin & Management Suite
- Business Analytics: Revenue metrics, active tables, best-selling dishes, and transaction feed.
- Menu Catalog Management: Add, edit, toggle availability, or delete items.
- SQLite Staff Database (`/api/staff`): Manage staff credentials, roles, and password resets directly.
- Table QR Code Generator: Generate and batch-print QR codes for all 20 tables.
- System Reset & Demo Data Seeder for testing.

---

## 🔄 Real-time Synchronization
The application features multi-tier real-time state synchronization:
1. **ntfy.sh Server-Sent Events:** Syncs state across different mobile devices, tablets, and laptops over the internet without requiring a paid backend.
2. **BroadcastChannel:** Instantly syncs across multiple tabs in the same browser session.
3. **Local Central Server:** Native Node.js HTTP server with SQLite persistence (`staff.db`).
4. **Google Firebase:** Cloud Firestore & Firebase Auth integration preconfigured via `firebase-config.js`.
