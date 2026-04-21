# 🚗 Used Car Auction Web Application

A full-stack web application built with Spring Boot (Java), React (TypeScript), and MySQL.

## 🚀 Features

*   **User Authentication**: Secure registration and login using JWT.
*   **Car Listings**: Browse available cars, add new listings for auction.
*   **Bidding System**: Place real-time bids on cars.
*   **Dashboard**: Visualize auction trends with charts.
*   **Responsive Design**: Simple and clean UI.

---

## 🛠️ Tech Stack

*   **Backend**: Spring Boot, Spring Security, JPA/Hibernate, MySQL.
*   **Frontend**: React, TypeScript, Vite, Axios, Lucide-React, Recharts.

---

## 🚦 How to Run

### 1. Prerequisites
*   Java 17 or higher
*   Node.js & npm
*   MySQL Server

### 2. Backend Setup
1.  Navigate to the `backend` folder.
2.  Update `src/main/resources/application.properties` with your MySQL credentials:
    ```properties
    spring.datasource.url=jdbc:mysql://localhost:3306/auction_db?createDatabaseIfNotExist=true
    spring.datasource.username=YOUR_USERNAME
    spring.datasource.password=YOUR_PASSWORD
    ```
3.  Run the application:
    ```bash
    mvn spring-boot:run
    ```

### 3. Frontend Setup
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

## 📂 Project Structure

*   `backend/`: Spring Boot application.
*   `frontend/`: React + Vite application.
*   `database/`: (Optional) SQL scripts or docker-compose.

---

## ⚠️ Notes for Beginners
*   **Security**: This project uses a simplified JWT implementation for learning purposes.
*   **Database**: Ensure MySQL is running before starting the backend.
*   **API**: The frontend communicates with the backend at `http://localhost:8080/api`.
