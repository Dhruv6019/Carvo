-- =============================================
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

SELECT 'CarMod Database Setup Complete - User Specified Structure!' as Status;
