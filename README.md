# Central Database Schema for Customer, Vendor, and Rider Applications

## Overview
This document outlines the central database schema for a production-level system that includes customers, vendors, and delivery personnel. It ensures security, scalability, and efficiency.

---

## Tables and Descriptions

### 1. **Users Table (Customers & Vendors)**
Stores user details including authentication and profile information.

```sql
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255),
    email VARCHAR(255) UNIQUE,
    phone VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255),
    oauthProvider ENUM('google', 'twitter') DEFAULT NULL,
    termsAccepted BOOLEAN NOT NULL,
    profilePic VARCHAR(255) DEFAULT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

---

### 2. **Orders Table**
Manages customer orders with delivery details, pricing, and payment status.

```sql
CREATE TABLE Orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id VARCHAR(24) NOT NULL,
    delivery_address_id INT,
    delivery_instructions TEXT DEFAULT "",
    delivery_tip DECIMAL(10,2) DEFAULT 0,
    coupon VARCHAR(255) DEFAULT "",
    discount DECIMAL(10,2) DEFAULT 0,
    subtotal DECIMAL(10,2) NOT NULL,
    tax DECIMAL(10,2) NOT NULL,
    total DECIMAL(10,2) NOT NULL,
    payment_method VARCHAR(50) NOT NULL,
    payment_status VARCHAR(50) DEFAULT 'Pending',
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (delivery_address_id) REFERENCES DeliveryAddress(id)
);
```

---

### 3. **OrderProducts Table**
Links orders to specific products with quantity details.

```sql
CREATE TABLE OrderProducts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    product_id VARCHAR(24) NOT NULL,
    quantity INT NOT NULL,
    FOREIGN KEY (order_id) REFERENCES Orders(id)
);
```

---

### 4. **Cart Table**
Manages customer shopping carts before purchase.

```sql
CREATE TABLE Cart (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    session_id VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    status ENUM('active', 'abandoned', 'purchased') DEFAULT 'active'
);
```

---

### 5. **CartItems Table**
Stores items added to the cart along with pricing details.

```sql
CREATE TABLE CartItems (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    cart_id BIGINT NOT NULL,
    product_id BIGINT NOT NULL,
    quantity INT NOT NULL,
    price_at_time DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (cart_id) REFERENCES Cart(id)
);
```

---

### 6. **Products Table**
Contains product details linked to vendors.

```sql
CREATE TABLE products (
    product_id VARCHAR(255) NOT NULL PRIMARY KEY,
    vendor_id INT NOT NULL,
    product_name VARCHAR(255) NOT NULL,
    product_img VARCHAR(500) NOT NULL,
    product_price DECIMAL(10,2) NOT NULL,
    product_description TEXT NOT NULL,
    product_stocks INT NOT NULL,
    category VARCHAR(255) NOT NULL,
    mrp DECIMAL(10,2) NOT NULL,
    save_ruppee DECIMAL(10,2) NOT NULL,
    discount DECIMAL(10,2) NOT NULL,
    weight VARCHAR(255) NOT NULL,
    bestseller BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (vendor_id) REFERENCES Users(id) ON DELETE CASCADE
);
```

---


---



