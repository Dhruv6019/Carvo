# Car Modification System - Entity Tables

## 1. Admin Users Table

| SR.NO | FIELDNAME | DATATYPE(SIZE) | CONSTRAINT | DESCRIPTION |
|-------|-----------|----------------|------------|-------------|
| 1 | admin_id | INT(11) | Primary Key | Unique Admin ID |
| 2 | name | VARCHAR(255) | Not Null | Admin name |
| 3 | email | VARCHAR(255) | Unique, Not Null | Admin email address |
| 4 | password_hash | VARCHAR(255) | Not Null | Hashed password |
| 5 | phone | VARCHAR(20) | Null | Admin phone number |
| 6 | role | ENUM('admin','super_admin') | Default 'admin' | Admin role type |
| 7 | created_at | DATETIME | Default CURRENT_TIMESTAMP | Record creation date |
| 8 | last_login | DATETIME | Null | Last login timestamp |
| 9 | status | ENUM('active','inactive','suspended') | Default 'active' | Account status |

## 2. Seller Profiles Table

| SR.NO | FIELDNAME | DATATYPE(SIZE) | CONSTRAINT | DESCRIPTION |
|-------|-----------|----------------|------------|-------------|
| 1 | seller_id | INT(11) | Primary Key | Unique Seller ID |
| 2 | user_id | INT(11) | Foreign Key | Reference to users table |
| 3 | business_name | VARCHAR(255) | Not Null | Business name |
| 4 | business_type | VARCHAR(100) | Null | Type of business |
| 5 | registration_number | VARCHAR(100) | Null | Business registration number |
| 6 | address | TEXT | Null | Business address |
| 7 | contact_person | VARCHAR(100) | Null | Contact person name |
| 8 | contact_phone | VARCHAR(20) | Null | Contact phone number |
| 9 | website_url | VARCHAR(255) | Null | Website URL |
| 10 | business_license_url | VARCHAR(500) | Null | License document URL |
| 11 | rating | DECIMAL(3,2) | Default 0.00 | Average rating |
| 12 | review_count | INT | Default 0 | Number of reviews |
| 13 | status | ENUM('pending','approved','rejected','suspended') | Default 'pending' | Approval status |
| 14 | approval_date | DATETIME | Null | Date of approval |
| 15 | rejection_reason | TEXT | Null | Reason for rejection |
| 16 | created_at | DATETIME | Default CURRENT_TIMESTAMP | Record creation date |
| 17 | updated_at | DATETIME | Default CURRENT_TIMESTAMP, ON UPDATE CURRENT_TIMESTAMP | Last update timestamp |

## 3. Service Provider Profiles Table

| SR.NO | FIELDNAME | DATATYPE(SIZE) | CONSTRAINT | DESCRIPTION |
|-------|-----------|----------------|------------|-------------|
| 1 | provider_id | INT(11) | Primary Key | Unique Provider ID |
| 2 | user_id | INT(11) | Foreign Key | Reference to users table |
| 3 | company_name | VARCHAR(255) | Not Null | Company name |
| 4 | specialization | VARCHAR(100) | Null | Specialization area |
| 5 | certification_level | VARCHAR(50) | Null | Certification level |
| 6 | experience_years | INT | Null | Years of experience |
| 7 | address | TEXT | Null | Company address |
| 8 | contact_person | VARCHAR(100) | Null | Contact person name |
| 9 | contact_phone | VARCHAR(20) | Null | Contact phone number |
| 10 | website_url | VARCHAR(255) | Null | Website URL |
| 11 | license_certification_url | VARCHAR(500) | Null | License document URL |
| 12 | rating | DECIMAL(3,2) | Default 0.00 | Average rating |
| 13 | review_count | INT | Default 0 | Number of reviews |
| 14 | status | ENUM('pending','approved','rejected','suspended') | Default 'pending' | Approval status |
| 15 | approval_date | DATETIME | Null | Date of approval |
| 16 | rejection_reason | TEXT | Null | Reason for rejection |
| 17 | created_at | DATETIME | Default CURRENT_TIMESTAMP | Record creation date |
| 18 | updated_at | DATETIME | Default CURRENT_TIMESTAMP, ON UPDATE CURRENT_TIMESTAMP | Last update timestamp |

## 4. Delivery Supplier Profiles Table

| SR.NO | FIELDNAME | DATATYPE(SIZE) | CONSTRAINT | DESCRIPTION |
|-------|-----------|----------------|------------|-------------|
| 1 | supplier_id | INT(11) | Primary Key | Unique Supplier ID |
| 2 | user_id | INT(11) | Foreign Key | Reference to users table |
| 3 | company_name | VARCHAR(255) | Not Null | Company name |
| 4 | fleet_size | INT | Null | Size of fleet |
| 5 | service_area | TEXT | Null | Service coverage area |
| 6 | delivery_capacity | INT | Null | Daily delivery capacity |
| 7 | address | TEXT | Null | Company address |
| 8 | contact_person | VARCHAR(100) | Null | Contact person name |
| 9 | contact_phone | VARCHAR(20) | Null | Contact phone number |
| 10 | website_url | VARCHAR(255) | Null | Website URL |
| 11 | license_certification_url | VARCHAR(500) | Null | License document URL |
| 12 | rating | DECIMAL(3,2) | Default 0.00 | Average rating |
| 13 | review_count | INT | Default 0 | Number of reviews |
| 14 | status | ENUM('pending','approved','rejected','suspended') | Default 'pending' | Approval status |
| 15 | approval_date | DATETIME | Null | Date of approval |
| 16 | rejection_reason | TEXT | Null | Reason for rejection |
| 17 | created_at | DATETIME | Default CURRENT_TIMESTAMP | Record creation date |
| 18 | updated_at | DATETIME | Default CURRENT_TIMESTAMP, ON UPDATE CURRENT_TIMESTAMP | Last update timestamp |

## 5. Support Agent Profiles Table

| SR.NO | FIELDNAME | DATATYPE(SIZE) | CONSTRAINT | DESCRIPTION |
|-------|-----------|----------------|------------|-------------|
| 1 | agent_id | INT(11) | Primary Key | Unique Agent ID |
| 2 | user_id | INT(11) | Foreign Key | Reference to users table |
| 3 | department | VARCHAR(100) | Null | Department name |
| 4 | designation | VARCHAR(100) | Null | Job title |
| 5 | experience_years | INT | Null | Years of experience |
| 6 | skills | TEXT | Null | Skills and expertise |
| 7 | availability_hours | TEXT | Null | Working hours |
| 8 | address | TEXT | Null | Address |
| 9 | contact_phone | VARCHAR(20) | Null | Phone number |
| 10 | rating | DECIMAL(3,2) | Default 0.00 | Average rating |
| 11 | review_count | INT | Default 0 | Number of reviews |
| 12 | status | ENUM('active','inactive','on_leave') | Default 'active' | Current status |
| 13 | supervisor_id | INT | Foreign Key, Set NULL | Supervisor's agent ID |
| 14 | created_at | DATETIME | Default CURRENT_TIMESTAMP | Record creation date |
| 15 | updated_at | DATETIME | Default CURRENT_TIMESTAMP, ON UPDATE CURRENT_TIMESTAMP | Last update timestamp |

## 6. Customer Profiles Table

| SR.NO | FIELDNAME | DATATYPE(SIZE) | CONSTRAINT | DESCRIPTION |
|-------|-----------|----------------|------------|-------------|
| 1 | customer_id | INT(11) | Primary Key | Unique Customer ID |
| 2 | user_id | INT(11) | Foreign Key | Reference to users table |
| 3 | full_name | VARCHAR(255) | Null | Full name |
| 4 | preferred_contact_method | ENUM('email','phone','both') | Default 'both' | Preferred contact method |
| 5 | car_preferences | TEXT | Null | Preferred car types |
| 6 | modification_history | TEXT | Null | History of modifications |
| 7 | loyalty_points | INT | Default 0 | Loyalty points earned |
| 8 | referral_code | VARCHAR(50) | Null | Referral code |
| 9 | referred_by | VARCHAR(50) | Null | Who referred them |
| 10 | rating | DECIMAL(3,2) | Default 0.00 | Average rating |
| 11 | review_count | INT | Default 0 | Number of reviews |
| 12 | status | ENUM('active','inactive','suspended') | Default 'active' | Account status |
| 13 | created_at | DATETIME | Default CURRENT_TIMESTAMP | Record creation date |
| 14 | updated_at | DATETIME | Default CURRENT_TIMESTAMP, ON UPDATE CURRENT_TIMESTAMP | Last update timestamp |-- Adding tables for the additional entities

-- 1️⃣ admin_users – Stores information about admin users (if not already covered in users table)
CREATE TABLE IF NOT EXISTS admin_users (
    admin_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255),
    phone VARCHAR(20),
    role ENUM('admin', 'super_admin') DEFAULT 'admin',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    last_login DATETIME,
    status ENUM('active', 'inactive', 'suspended') DEFAULT 'active'
);

-- 2️⃣ seller_profiles – Stores information about sellers
CREATE TABLE IF NOT EXISTS seller_profiles (
    seller_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    business_name VARCHAR(255) NOT NULL,
    business_type VARCHAR(100),
    registration_number VARCHAR(100),
    address TEXT,
    contact_person VARCHAR(100),
    contact_phone VARCHAR(20),
    website_url VARCHAR(255),
    business_license_url VARCHAR(500),
    rating DECIMAL(3,2) DEFAULT 0.00,
    review_count INT DEFAULT 0,
    status ENUM('pending', 'approved', 'rejected', 'suspended') DEFAULT 'pending',
    approval_date DATETIME,
    rejection_reason TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- 3️⃣ service_provider_profiles – Stores information about service providers
CREATE TABLE IF NOT EXISTS service_provider_profiles (
    provider_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    company_name VARCHAR(255) NOT NULL,
    specialization VARCHAR(100),
    certification_level VARCHAR(50),
    experience_years INT,
    address TEXT,
    contact_person VARCHAR(100),
    contact_phone VARCHAR(20),
    website_url VARCHAR(255),
    license_certification_url VARCHAR(500),
    rating DECIMAL(3,2) DEFAULT 0.00,
    review_count INT DEFAULT 0,
    status ENUM('pending', 'approved', 'rejected', 'suspended') DEFAULT 'pending',
    approval_date DATETIME,
    rejection_reason TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- 4️⃣ delivery_supplier_profiles – Stores information about delivery suppliers
CREATE TABLE IF NOT EXISTS delivery_supplier_profiles (
    supplier_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    company_name VARCHAR(255) NOT NULL,
    fleet_size INT,
    service_area TEXT,
    delivery_capacity INT,
    address TEXT,
    contact_person VARCHAR(100),
    contact_phone VARCHAR(20),
    website_url VARCHAR(255),
    license_certification_url VARCHAR(500),
    rating DECIMAL(3,2) DEFAULT 0.00,
    review_count INT DEFAULT 0,
    status ENUM('pending', 'approved', 'rejected', 'suspended') DEFAULT 'pending',
    approval_date DATETIME,
    rejection_reason TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- 5️⃣ support_agent_profiles – Stores information about support agents
CREATE TABLE IF NOT EXISTS support_agent_profiles (
    agent_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    department VARCHAR(100),
    designation VARCHAR(100),
    experience_years INT,
    skills TEXT,
    availability_hours TEXT,
    address TEXT,
    contact_phone VARCHAR(20),
    rating DECIMAL(3,2) DEFAULT 0.00,
    review_count INT DEFAULT 0,
    status ENUM('active', 'inactive', 'on_leave') DEFAULT 'active',
    supervisor_id INT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (supervisor_id) REFERENCES support_agent_profiles(agent_id) ON DELETE SET NULL
);

-- 6️⃣ customer_profiles – Stores additional information about customers
CREATE TABLE IF NOT EXISTS customer_profiles (
    customer_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    full_name VARCHAR(255),
    preferred_contact_method ENUM('email', 'phone', 'both') DEFAULT 'both',
    car_preferences TEXT,
    modification_history TEXT,
    loyalty_points INT DEFAULT 0,
    referral_code VARCHAR(50),
    referred_by VARCHAR(50),
    rating DECIMAL(3,2) DEFAULT 0.00,
    review_count INT DEFAULT 0,
    status ENUM('active', 'inactive', 'suspended') DEFAULT 'active',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);# Car Modification System - Entity Tables

## 1. Admin Users Table

| SR.NO | FIELDNAME | DATATYPE(SIZE) | CONSTRAINT | DESCRIPTION |
|-------|-----------|----------------|------------|-------------|
| 1 | admin_id | INT(11) | Primary Key | Unique Admin ID |
| 2 | name | VARCHAR(255) | Not Null | Admin name |
| 3 | email | VARCHAR(255) | Unique, Not Null | Admin email address |
| 4 | password_hash | VARCHAR(255) | Not Null | Hashed password |
| 5 | phone | VARCHAR(20) | Null | Admin phone number |
| 6 | role | ENUM('admin','super_admin') | Default 'admin' | Admin role type |
| 7 | created_at | DATETIME | Default CURRENT_TIMESTAMP | Record creation date |
| 8 | last_login | DATETIME | Null | Last login timestamp |
| 9 | status | ENUM('active','inactive','suspended') | Default 'active' | Account status |

## 2. Seller Profiles Table

| SR.NO | FIELDNAME | DATATYPE(SIZE) | CONSTRAINT | DESCRIPTION |
|-------|-----------|----------------|------------|-------------|
| 1 | seller_id | INT(11) | Primary Key | Unique Seller ID |
| 2 | user_id | INT(11) | Foreign Key | Reference to users table |
| 3 | business_name | VARCHAR(255) | Not Null | Business name |
| 4 | business_type | VARCHAR(100) | Null | Type of business |
| 5 | registration_number | VARCHAR(100) | Null | Business registration number |
| 6 | address | TEXT | Null | Business address |
| 7 | contact_person | VARCHAR(100) | Null | Contact person name |
| 8 | contact_phone | VARCHAR(20) | Null | Contact phone number |
| 9 | website_url | VARCHAR(255) | Null | Website URL |
| 10 | business_license_url | VARCHAR(500) | Null | License document URL |
| 11 | rating | DECIMAL(3,2) | Default 0.00 | Average rating |
| 12 | review_count | INT | Default 0 | Number of reviews |
| 13 | status | ENUM('pending','approved','rejected','suspended') | Default 'pending' | Approval status |
| 14 | approval_date | DATETIME | Null | Date of approval |
| 15 | rejection_reason | TEXT | Null | Reason for rejection |
| 16 | created_at | DATETIME | Default CURRENT_TIMESTAMP | Record creation date |
| 17 | updated_at | DATETIME | Default CURRENT_TIMESTAMP, ON UPDATE CURRENT_TIMESTAMP | Last update timestamp |

## 3. Service Provider Profiles Table

| SR.NO | FIELDNAME | DATATYPE(SIZE) | CONSTRAINT | DESCRIPTION |
|-------|-----------|----------------|------------|-------------|
| 1 | provider_id | INT(11) | Primary Key | Unique Provider ID |
| 2 | user_id | INT(11) | Foreign Key | Reference to users table |
| 3 | company_name | VARCHAR(255) | Not Null | Company name |
| 4 | specialization | VARCHAR(100) | Null | Specialization area |
| 5 | certification_level | VARCHAR(50) | Null | Certification level |
| 6 | experience_years | INT | Null | Years of experience |
| 7 | address | TEXT | Null | Company address |
| 8 | contact_person | VARCHAR(100) | Null | Contact person name |
| 9 | contact_phone | VARCHAR(20) | Null | Contact phone number |
| 10 | website_url | VARCHAR(255) | Null | Website URL |
| 11 | license_certification_url | VARCHAR(500) | Null | License document URL |
| 12 | rating | DECIMAL(3,2) | Default 0.00 | Average rating |
| 13 | review_count | INT | Default 0 | Number of reviews |
| 14 | status | ENUM('pending','approved','rejected','suspended') | Default 'pending' | Approval status |
| 15 | approval_date | DATETIME | Null | Date of approval |
| 16 | rejection_reason | TEXT | Null | Reason for rejection |
| 17 | created_at | DATETIME | Default CURRENT_TIMESTAMP | Record creation date |
| 18 | updated_at | DATETIME | Default CURRENT_TIMESTAMP, ON UPDATE CURRENT_TIMESTAMP | Last update timestamp |

## 4. Delivery Supplier Profiles Table

| SR.NO | FIELDNAME | DATATYPE(SIZE) | CONSTRAINT | DESCRIPTION |
|-------|-----------|----------------|------------|-------------|
| 1 | supplier_id | INT(11) | Primary Key | Unique Supplier ID |
| 2 | user_id | INT(11) | Foreign Key | Reference to users table |
| 3 | company_name | VARCHAR(255) | Not Null | Company name |
| 4 | fleet_size | INT | Null | Size of fleet |
| 5 | service_area | TEXT | Null | Service coverage area |
| 6 | delivery_capacity | INT | Null | Daily delivery capacity |
| 7 | address | TEXT | Null | Company address |
| 8 | contact_person | VARCHAR(100) | Null | Contact person name |
| 9 | contact_phone | VARCHAR(20) | Null | Contact phone number |
| 10 | website_url | VARCHAR(255) | Null | Website URL |
| 11 | license_certification_url | VARCHAR(500) | Null | License document URL |
| 12 | rating | DECIMAL(3,2) | Default 0.00 | Average rating |
| 13 | review_count | INT | Default 0 | Number of reviews |
| 14 | status | ENUM('pending','approved','rejected','suspended') | Default 'pending' | Approval status |
| 15 | approval_date | DATETIME | Null | Date of approval |
| 16 | rejection_reason | TEXT | Null | Reason for rejection |
| 17 | created_at | DATETIME | Default CURRENT_TIMESTAMP | Record creation date |
| 18 | updated_at | DATETIME | Default CURRENT_TIMESTAMP, ON UPDATE CURRENT_TIMESTAMP | Last update timestamp |

## 5. Support Agent Profiles Table

| SR.NO | FIELDNAME | DATATYPE(SIZE) | CONSTRAINT | DESCRIPTION |
|-------|-----------|----------------|------------|-------------|
| 1 | agent_id | INT(11) | Primary Key | Unique Agent ID |
| 2 | user_id | INT(11) | Foreign Key | Reference to users table |
| 3 | department | VARCHAR(100) | Null | Department name |
| 4 | designation | VARCHAR(100) | Null | Job title |
| 5 | experience_years | INT | Null | Years of experience |
| 6 | skills | TEXT | Null | Skills and expertise |
| 7 | availability_hours | TEXT | Null | Working hours |
| 8 | address | TEXT | Null | Address |
| 9 | contact_phone | VARCHAR(20) | Null | Phone number |
| 10 | rating | DECIMAL(3,2) | Default 0.00 | Average rating |
| 11 | review_count | INT | Default 0 | Number of reviews |
| 12 | status | ENUM('active','inactive','on_leave') | Default 'active' | Current status |
| 13 | supervisor_id | INT | Foreign Key, Set NULL | Supervisor's agent ID |
| 14 | created_at | DATETIME | Default CURRENT_TIMESTAMP | Record creation date |
| 15 | updated_at | DATETIME | Default CURRENT_TIMESTAMP, ON UPDATE CURRENT_TIMESTAMP | Last update timestamp |

## 6. Customer Profiles Table

| SR.NO | FIELDNAME | DATATYPE(SIZE) | CONSTRAINT | DESCRIPTION |
|-------|-----------|----------------|------------|-------------|
| 1 | customer_id | INT(11) | Primary Key | Unique Customer ID |
| 2 | user_id | INT(11) | Foreign Key | Reference to users table |
| 3 | full_name | VARCHAR(255) | Null | Full name |
| 4 | preferred_contact_method | ENUM('email','phone','both') | Default 'both' | Preferred contact method |
| 5 | car_preferences | TEXT | Null | Preferred car types |
| 6 | modification_history | TEXT | Null | History of modifications |
| 7 | loyalty_points | INT | Default 0 | Loyalty points earned |
| 8 | referral_code | VARCHAR(50) | Null | Referral code |
| 9 | referred_by | VARCHAR(50) | Null | Who referred them |
| 10 | rating | DECIMAL(3,2) | Default 0.00 | Average rating |
| 11 | review_count | INT | Default 0 | Number of reviews |
| 12 | status | ENUM('active','inactive','suspended') | Default 'active' | Account status |
| 13 | created_at | DATETIME | Default CURRENT_TIMESTAMP | Record creation date |
| 14 | updated_at | DATETIME | Default CURRENT_TIMESTAMP, ON UPDATE CURRENT_TIMESTAMP | Last update timestamp |-- =============================================
-- CarMod Database Schema - User Specified Structure
-- Car Modification Platform Database
-- =============================================

-- Drop database if exists and create new one
DROP DATABASE IF EXISTS carmod_db;
CREATE DATABASE carmod_db;
USE carmod_db;

-- =============================================
-- USER SPECIFIED TABLES
-- =============================================

-- 1️⃣ users – Stores information about users
CREATE TABLE users (
    user_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255),
    phone VARCHAR(20),
    role ENUM('customer', 'admin') DEFAULT 'customer',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 2️⃣ cars – Base cars available for customization
CREATE TABLE cars (
    car_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    brand VARCHAR(255) NOT NULL,
    model VARCHAR(255) NOT NULL,
    year INT NOT NULL,
    description TEXT,
    base_price DECIMAL(10,2) NOT NULL,
    image_url VARCHAR(500),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 3️⃣ categories – Types of modifications
CREATE TABLE categories (
    category_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 4️⃣ parts – Parts for modification (wheels, lights, etc.)
CREATE TABLE parts (
    part_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    category_id INT NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    description TEXT,
    image_url VARCHAR(500),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(category_id) ON DELETE CASCADE
);

-- 5️⃣ customizations – Customized designs by users
CREATE TABLE customizations (
    customization_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    car_id INT NOT NULL,
    name VARCHAR(255) NOT NULL,
    color VARCHAR(100),
    wheels VARCHAR(255),
    body_kit VARCHAR(255),
    lights VARCHAR(255),
    notes TEXT,
    shared_link VARCHAR(500),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (car_id) REFERENCES cars(car_id) ON DELETE CASCADE
);

-- 6️⃣ car_images – Images for cars and modifications
CREATE TABLE car_images (
    image_id INT PRIMARY KEY AUTO_INCREMENT,
    car_id INT,
    customization_id INT,
    image_url VARCHAR(500) NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (car_id) REFERENCES cars(car_id) ON DELETE CASCADE,
    FOREIGN KEY (customization_id) REFERENCES customizations(customization_id) ON DELETE CASCADE
);

-- 7️⃣ services – Services offered (linked to parts)
CREATE TABLE services (
    service_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    part_id INT,
    category_id INT,
    price DECIMAL(10,2) NOT NULL,
    availability BOOLEAN DEFAULT TRUE,
    description TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (part_id) REFERENCES parts(part_id) ON DELETE SET NULL,
    FOREIGN KEY (category_id) REFERENCES categories(category_id) ON DELETE SET NULL
);

-- 8️⃣ quotations – Requests from users for prices/services
CREATE TABLE quotations (
    quotation_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    car_id INT NOT NULL,
    customization_id INT,
    message TEXT NOT NULL,
    status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (car_id) REFERENCES cars(car_id) ON DELETE CASCADE,
    FOREIGN KEY (customization_id) REFERENCES customizations(customization_id) ON DELETE SET NULL
);

-- 9️⃣ bookings – For service bookings
CREATE TABLE bookings (
    booking_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    service_id INT NOT NULL,
    quotation_id INT,
    car_id INT,
    scheduled_at DATETIME NOT NULL,
    status ENUM('pending', 'confirmed', 'completed', 'cancelled') DEFAULT 'pending',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (service_id) REFERENCES services(service_id) ON DELETE CASCADE,
    FOREIGN KEY (quotation_id) REFERENCES quotations(quotation_id) ON DELETE SET NULL,
    FOREIGN KEY (car_id) REFERENCES cars(car_id) ON DELETE SET NULL
);

-- 🔟 payments – Payment details
CREATE TABLE payments (
    payment_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    booking_id INT,
    quotation_id INT,
    amount DECIMAL(10,2) NOT NULL,
    method ENUM('upi', 'card', 'netbanking', 'cash') NOT NULL,
    transaction_id VARCHAR(255),
    status ENUM('pending', 'paid', 'failed') DEFAULT 'pending',
    paid_at DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (booking_id) REFERENCES bookings(booking_id) ON DELETE SET NULL,
    FOREIGN KEY (quotation_id) REFERENCES quotations(quotation_id) ON DELETE SET NULL
);

-- 1️⃣1️⃣ admin_logs – Logs for admin activities
CREATE TABLE admin_logs (
    log_id INT PRIMARY KEY AUTO_INCREMENT,
    action_type VARCHAR(100) NOT NULL,
    entity_id INT,
    performed_by INT NOT NULL,
    notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (performed_by) REFERENCES users(user_id) ON DELETE CASCADE
);

-- =============================================
-- INDEXES FOR PERFORMANCE
-- =============================================

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_parts_category ON parts(category_id);
CREATE INDEX idx_customizations_user ON customizations(user_id);
CREATE INDEX idx_customizations_car ON customizations(car_id);
CREATE INDEX idx_car_images_car ON car_images(car_id);
CREATE INDEX idx_car_images_customization ON car_images(customization_id);
CREATE INDEX idx_services_part ON services(part_id);
CREATE INDEX idx_services_category ON services(category_id);
CREATE INDEX idx_quotations_user ON quotations(user_id);
CREATE INDEX idx_quotations_car ON quotations(car_id);
CREATE INDEX idx_quotations_customization ON quotations(customization_id);
CREATE INDEX idx_bookings_user ON bookings(user_id);
CREATE INDEX idx_bookings_service ON bookings(service_id);
CREATE INDEX idx_bookings_quotation ON bookings(quotation_id);
CREATE INDEX idx_bookings_car ON bookings(car_id);
CREATE INDEX idx_payments_user ON payments(user_id);
CREATE INDEX idx_payments_booking ON payments(booking_id);
CREATE INDEX idx_payments_quotation ON payments(quotation_id);
CREATE INDEX idx_admin_logs_performed_by ON admin_logs(performed_by);

-- =============================================
-- SAMPLE DATA INSERTION
-- =============================================

-- Insert sample users
INSERT INTO users (name, email, password_hash, phone, role) VALUES
('Admin User', 'admin@carmod.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '9876543210', 'admin'),
('John Doe', 'john.doe@email.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '9876543211', 'customer'),
('Jane Smith', 'jane.smith@email.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '9876543212', 'customer');

-- Insert sample cars
INSERT INTO cars (name, brand, model, year, description, base_price, image_url) VALUES
('M3 Competition', 'BMW', 'M3', 2023, 'High-performance luxury sedan', 75000.00, '/images/cars/bmw-m3.jpg'),
('AMG GT', 'Mercedes-Benz', 'AMG GT', 2023, 'Sports car with exceptional performance', 118000.00, '/images/cars/amg-gt.jpg'),
('Supra GR', 'Toyota', 'Supra', 2023, 'Legendary sports car', 55000.00, '/images/cars/supra.jpg');

-- Insert sample categories
INSERT INTO categories (name, description) VALUES
('Paint & Wraps', 'Custom paint jobs and vinyl wraps'),
('Wheels & Tires', 'Alloy wheels and performance tires'),
('Interior', 'Custom seats and dashboard modifications'),
('Performance', 'Engine tuning and exhaust systems');

-- Insert sample parts
INSERT INTO parts (name, category_id, price, description, image_url) VALUES
('Matte Black Paint', 1, 1299.00, 'Premium matte black paint finish', '/images/parts/matte-paint.jpg'),
('Racing Wheels 19"', 2, 2499.00, 'Lightweight racing wheels', '/images/parts/racing-wheels.jpg'),
('Racing Seats', 3, 2800.00, 'Bucket racing seats', '/images/parts/racing-seats.jpg'),
('Cold Air Intake', 4, 599.00, 'High-flow cold air intake', '/images/parts/intake.jpg');

-- Insert sample customizations
INSERT INTO customizations (user_id, car_id, name, color, wheels, body_kit, lights, notes, shared_link) VALUES
(2, 1, 'Blacked Out Beast', 'Matte Black', 'Racing 19"', 'Front Splitter', 'LED Kit', 'Stealth build', 'https://carmod.com/share/abc123'),
(3, 2, 'Track Monster', 'Racing Red', 'Forged 19"', 'Aero Package', 'LED Kit', 'Track focused', 'https://carmod.com/share/def456');

-- Insert sample services
INSERT INTO services (name, part_id, category_id, price, availability, description) VALUES
('Paint Application', 1, 1, 800.00, TRUE, 'Professional paint job'),
('Wheel Installation', 2, 2, 200.00, TRUE, 'Wheel installation service'),
('Seat Installation', 3, 3, 400.00, TRUE, 'Racing seat installation');

-- Insert sample quotations
INSERT INTO quotations (user_id, car_id, customization_id, message, status) VALUES
(2, 1, 1, 'Need complete performance package for BMW M3', 'pending'),
(3, 2, 2, 'Want carbon fiber body kit for AMG GT', 'approved');

-- Insert sample bookings
INSERT INTO bookings (user_id, service_id, quotation_id, car_id, scheduled_at, status) VALUES
(2, 1, 1, 1, '2024-02-15 10:00:00', 'confirmed'),
(3, 2, 2, 2, '2024-02-20 14:00:00', 'pending');

-- Insert sample payments
INSERT INTO payments (user_id, booking_id, quotation_id, amount, method, transaction_id, status, paid_at) VALUES
(2, 1, 1, 800.00, 'upi', 'TXN123456789', 'paid', '2024-02-10 15:30:00'),
(3, 2, 2, 200.00, 'card', 'TXN987654321', 'paid', '2024-02-22 11:45:00');

-- Insert sample admin logs
INSERT INTO admin_logs (action_type, entity_id, performed_by, notes) VALUES
('approve', 1, 1, 'Approved quotation for BMW M3 modifications'),
('create', 4, 1, 'Added new part to catalog');

## 12. Orders Table

| SR.NO | FIELDNAME | DATATYPE(SIZE) | CONSTRAINT | DESCRIPTION |
|-------|-----------|----------------|------------|-------------|
| 1 | order_id         | INT(11) | Primary Key | Unique Order ID |
| 2 | user_id          | INT(11) | Foreign Key | Reference to users table |
| 3 | part_id          | INT(11) | Foreign Key, Null | Reference to parts table |
| 4 | service_id       | INT(11) | Foreign Key, Null | Reference to services table |
| 5 | customization_id | INT(11) | Foreign Key, Null | Reference to customizations table |
| 6 | quantity         | INT(11) | Not Null, Default 1 | Quantity of items ordered |
| 7 | unit_price       | DECIMAL(10,2) | Not Null | Price per unit |
| 8 | total_amount     | DECIMAL(10,2) | Not Null | Total order amount |
| 9 | status           | ENUM('pending','confirmed','processing','shipped','delivered','cancelled') | Default 'pending' | Order status |
| 10 | shipping_address| TEXT | Null | Delivery address |
| 11 | shipping_method | VARCHAR(100) | Null | Shipping method |
| 12 | tracking_number | VARCHAR(255) | Null | Shipping tracking number |
| 13 | ordered_at      | DATETIME | Default CURRENT_TIMESTAMP | Order creation date |
| 14 | updated_at      | DATETIME | Default CURRENT_TIMESTAMP, ON UPDATE CURRENT_TIMESTAMP | Last update timestamp |
| 15 | delivered_at    | DATETIME | Null | Delivery completion date |

-- =============================================
-- 12. ORDERS - Customer orders for parts and services
-- =============================================
CREATE TABLE orders (
    order_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    -- Reference to either a part, service, or customization
    part_id INT NULL,
    service_id INT NULL,
    customization_id INT NULL,
    -- Order details
    quantity INT NOT NULL DEFAULT 1,
    unit_price DECIMAL(10,2) NOT NULL,
    total_amount DECIMAL(10,2) NOT NULL,
    -- Order status tracking
    status ENUM('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled') DEFAULT 'pending',
    -- Shipping information
    shipping_address TEXT,
    shipping_method VARCHAR(100),
    tracking_number VARCHAR(255),
    -- Timestamps
    ordered_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    delivered_at DATETIME NULL,
    -- Foreign key constraints
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (part_id) REFERENCES parts(part_id) ON DELETE SET NULL,
    FOREIGN KEY (service_id) REFERENCES services(service_id) ON DELETE SET NULL,
    FOREIGN KEY (customization_id) REFERENCES customizations(customization_id) ON DELETE SET NULL
);

-- Indexes for better performance
CREATE INDEX idx_orders_user ON orders(user_id);
CREATE INDEX idx_orders_part ON orders(part_id);
CREATE INDEX idx_orders_service ON orders(service_id);
CREATE INDEX idx_orders_customization ON orders(customization_id);
CREATE INDEX idx_orders_status ON orders(status);

-- =============================================
-- SAMPLE ORDER DATA
-- =============================================
INSERT INTO orders (user_id, part_id, quantity, unit_price, total_amount, status, shipping_address, shipping_method) VALUES
(2, 1, 1, 1299.00, 1299.00, 'delivered', '123 Main St, City, State 12345', 'Standard Shipping', 'TRK123456789'),
(3, 2, 1, 2499.00, 2499.00, 'shipped', '456 Oak Ave, Town, State 67890', 'Express Shipping', 'TRK987654321'),
(2, 3, 2, 2800.00, 5600.00, 'processing', '123 Main St, City, State 12345', 'Standard Shipping', NULL);

SELECT 'CarMod Database Setup Complete - User Specified Structure!' as Status;
