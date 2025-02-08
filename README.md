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
CREATE TABLE DeliveryAddress (
    id INT AUTO_INCREMENT PRIMARY KEY,
    customer_id INT NOT NULL,  -- References Customers table
    address_line1 VARCHAR(255) NOT NULL,
    address_line2 VARCHAR(255),
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    postal_code VARCHAR(20) NOT NULL,
    country VARCHAR(100) NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES Customers(id)
);

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
CREATE TABLE OrderProducts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    product_id VARCHAR(24) NOT NULL,
    quantity INT NOT NULL,
    FOREIGN KEY (order_id) REFERENCES Orders(id)
);
CREATE TABLE Cart (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,       -- references the user's primary key
    session_id VARCHAR(255),        -- optionally used for guest users or session tracking
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    status ENUM('active', 'abandoned', 'purchased') DEFAULT 'active'
);
CREATE TABLE CartItems (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    cart_id BIGINT NOT NULL,        -- foreign key referencing Cart.id
    product_id BIGINT NOT NULL,     -- foreign key referencing Product.id
    quantity INT NOT NULL,
    price_at_time DECIMAL(10,2) NOT NULL,  -- record product price when added
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (cart_id) REFERENCES Cart(id)
);


Vendor 
CREATE TABLE Vendors (
    vendor_id SERIAL PRIMARY KEY,
    vendor_phone VARCHAR(15) NOT NULL UNIQUE,
    vendor_otp VARCHAR(10), -- Adjust length as needed
    vendor_otp_expires TIMESTAMP,
    is_verified BOOLEAN DEFAULT FALSE,
    
    -- Vendor Details Fields
    vendor_name VARCHAR(255) NOT NULL,
    vendor_email VARCHAR(255) NOT NULL UNIQUE,
    vendor_pan_no VARCHAR(20) NOT NULL UNIQUE,
    vendor_gst VARCHAR(20) NOT NULL UNIQUE,
    vendor_bank_name VARCHAR(255) NOT NULL,
    vendor_ifsc_code VARCHAR(20) NOT NULL,
    vendor_fssai_no VARCHAR(30) NOT NULL UNIQUE,

    -- Vendor Document Fields
    vendor_aadhar_front VARCHAR(500),
    vendor_aadhar_back VARCHAR(500),
    vendor_voter_front VARCHAR(500),
    vendor_voter_back VARCHAR(500),
    vendor_pan_card VARCHAR(500) NOT NULL,
    vendor_fssai_photo VARCHAR(500) NOT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
CREATE TABLE products (
    product_id VARCHAR(255) NOT NULL PRIMARY KEY,
    vendor_id INT NOT NULL, -- Added vendor_id for relationship with Users table
    product_name VARCHAR(255) NOT NULL,
    product_img VARCHAR(500) NOT NULL, -- Increased length to match second table
    product_price DECIMAL(10,2) NOT NULL, -- Equivalent to MRP
    product_description TEXT NOT NULL,
    product_stocks INT NOT NULL,
    category VARCHAR(255) NOT NULL, -- Changed from INT to VARCHAR to match second table
    mrp DECIMAL(10,2) NOT NULL,
    save_ruppee DECIMAL(10,2) NOT NULL,
    discount DECIMAL(10,2) NOT NULL,
    weight VARCHAR(255) NOT NULL,
    bestseller BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Added to track product creation time
    FOREIGN KEY (vendor_id) REFERENCES Users(id) ON DELETE CASCADE
);

Rider APP 
CREATE TABLE DeliveryGuy (
    delivery_id SERIAL PRIMARY KEY,
    delivery_phone VARCHAR(15) NOT NULL UNIQUE,
    delivery_otp VARCHAR(10),
    is_verified BOOLEAN DEFAULT FALSE,

    -- Personal Information
    delivery_first_name VARCHAR(255) NOT NULL,
    delivery_last_name VARCHAR(255) NOT NULL,
    delivery_gender ENUM('male', 'female') NOT NULL,

    -- Vehicle Selection
    delivery_vehicle_type VARCHAR(50) NOT NULL, -- e.g., "2-wheeler"

    -- Bank Details
    delivery_account_number VARCHAR(50) NOT NULL,
    delivery_re_account_number VARCHAR(50) NOT NULL,
    delivery_bank_name VARCHAR(255) NOT NULL,
    delivery_ifsc_code VARCHAR(20) NOT NULL,

    -- Documents
    delivery_aadhar_front VARCHAR(500),
    delivery_aadhar_back VARCHAR(500),
    delivery_voter_front VARCHAR(500),
    delivery_voter_back VARCHAR(500),
    delivery_pan_card VARCHAR(500) NOT NULL,
    delivery_driving_license VARCHAR(500) NOT NULL,

    -- Profile Photo
    delivery_photo VARCHAR(500) NOT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);


+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
### Central Database Schema for Customer, Vendor, and Rider Applications

#### Users Table (Customers & Vendors)
- Stores user details including authentication and profile information.

#### Orders Table
- Manages customer orders with delivery details, pricing, and payment status.

#### OrderProducts Table
- Links orders to specific products with quantity details.

#### Cart Table
- Manages customer shopping carts before purchase.

#### CartItems Table
- Stores items added to the cart along with pricing details.

#### Vendors Table
- Stores vendor-specific details, including verification and financial information.

#### Products Table
- Contains product details linked to vendors.

#### DeliveryGuy Table
- Stores delivery personnel details, including vehicle, bank, and verification documents.

#### DeliveryAddress Table
- Stores customer delivery addresses for orders.

#### Payments Table
- Tracks payment transactions and statuses.

#### Reviews Table
- Stores customer reviews for products and vendors.

#### Notifications Table
- Manages system notifications for users.

#### Admin Table
- Stores administrator accounts for platform management.

This schema is designed for a production-level database, ensuring security, scalability, and efficiency.
+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++