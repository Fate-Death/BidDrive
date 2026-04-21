# 🚗 BidDrive — Premium Used Car Auction Platform

BidDrive is a high-performance, full-stack web application designed for seamless used car auctions. It features a modern, responsive UI, robust security with JWT, and a scalable Spring Boot backend.

---

## ✨ Key Features

*   **Live Bidding**: Place bids on your favorite cars with real-time validation.
*   **Auction Management**: Sellers can list cars, track bids, and close auctions.
*   **User Dashboard**: Track your listings and bidding history in one place.
*   **Premium Design**: Token-based design system with glassmorphism and smooth animations.
*   **Secure Auth**: JWT-based authentication for secure access.
*   **Data Visualization**: Price trend charts for top listings using Recharts.

---

## 🛠️ Tech Stack

*   **Backend**: Spring Boot (Java), Spring Security, Spring Data JPA, JWT.
*   **Database**: MariaDB / MySQL.
*   **Frontend**: React, TypeScript, Vite, Axios, Lucide-React, Recharts.

---

## 🚦 Getting Started

### 1. Prerequisites
*   Java 17 or higher
*   Node.js & npm
*   MariaDB / MySQL Server

### 2. Database Setup (Arch Linux / MariaDB)
If you are using MariaDB on Arch Linux, follow these steps to initialize:
```bash
# 1. Install
sudo pacman -S mariadb
# 2. Initialize
sudo mariadb-install-db --user=mysql --basedir=/usr --datadir=/var/lib/mysql
# 3. Start service
sudo systemctl start mariadb
# 4. Set root password
sudo mariadb -u root -e "ALTER USER 'root'@'localhost' IDENTIFIED BY 'password'; FLUSH PRIVILEGES;"
```

### 3. Backend Setup
1.  Navigate to the `backend` folder.
2.  The `application.properties` is already configured for the default MariaDB setup:
    - **DB Name**: `auction_db` (created automatically)
    - **User**: `root`
    - **Password**: `password`
3.  Run the application:
    ```bash
    mvn spring-boot:run
    ```

### 4. Frontend Setup
1.  Navigate to the `frontend` folder.
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Start the development server:
    ```bash
    npm run dev
    ```
4.  Open `http://localhost:5173` in your browser.

---

## 🔒 Security Features
- **Seller Protection**: Sellers cannot bid on their own listings.
- **JWT Protection**: Sensitive endpoints require valid authentication tokens.
- **Validation**: Strict server-side validation for bid amounts and auction statuses.

---

## 🚀 Future Roadmap
- [ ] Real-time WebSocket notifications for new bids.
- [ ] Multi-image support for car listings.
- [ ] Advanced search filters (location, mileage, fuel type).
- [ ] Payment integration for finalized auctions.

---

