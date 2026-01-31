-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jan 31, 2026 at 02:54 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `carvo_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `booking`
--

CREATE TABLE `booking` (
  `id` int(11) NOT NULL,
  `scheduled_date` datetime NOT NULL,
  `status` enum('pending','confirmed','in_progress','completed','cancelled') NOT NULL DEFAULT 'pending',
  `created_at` datetime(6) NOT NULL DEFAULT current_timestamp(6),
  `customerId` int(11) NOT NULL,
  `providerId` int(11) DEFAULT NULL,
  `quotationId` int(11) DEFAULT NULL,
  `service_type` varchar(255) DEFAULT NULL,
  `notes` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `booking`
--

INSERT INTO `booking` (`id`, `scheduled_date`, `status`, `created_at`, `customerId`, `providerId`, `quotationId`, `service_type`, `notes`) VALUES
(1, '2024-12-25 05:30:00', 'confirmed', '2025-12-13 22:05:08.195827', 8, 4, NULL, 'maintenance', 'Check engine light'),
(2, '2025-12-13 05:30:00', 'completed', '2025-12-13 22:10:54.352247', 2, 4, NULL, 'installation', ''),
(3, '2025-12-04 05:30:00', 'pending', '2025-12-30 12:37:34.212040', 2, NULL, NULL, 'installation', ''),
(4, '2026-01-31 05:30:00', 'pending', '2026-01-30 17:30:36.444443', 9, NULL, NULL, 'tuning', 'Vehicle:  \nPhone: \nUser Notes:');

-- --------------------------------------------------------

--
-- Table structure for table `car`
--

CREATE TABLE `car` (
  `id` int(11) NOT NULL,
  `make` varchar(255) NOT NULL,
  `model` varchar(255) NOT NULL,
  `year` int(11) NOT NULL,
  `base_price` decimal(10,2) NOT NULL,
  `image_url` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `car`
--

INSERT INTO `car` (`id`, `make`, `model`, `year`, `base_price`, `image_url`) VALUES
(1, 'Toyota', 'Supra', 2023, 50000.00, NULL),
(2, 'Nissan', 'GT-R', 2024, 110000.00, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `category`
--

CREATE TABLE `category` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `icon` varchar(255) DEFAULT NULL,
  `partCount` int(11) NOT NULL DEFAULT 0,
  `isActive` tinyint(4) NOT NULL DEFAULT 1,
  `created_at` datetime(6) NOT NULL DEFAULT current_timestamp(6),
  `updated_at` datetime(6) NOT NULL DEFAULT current_timestamp(6) ON UPDATE current_timestamp(6),
  `description` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `category`
--

INSERT INTO `category` (`id`, `name`, `slug`, `icon`, `partCount`, `isActive`, `created_at`, `updated_at`, `description`) VALUES
(1, 'Engine Parts', 'engine-parts', '⚙️', 5, 1, '2026-01-30 18:26:58.000000', '2026-01-31 17:22:28.407503', NULL),
(2, 'Suspension', 'suspension', '🔧', 3, 1, '2026-01-30 18:26:58.000000', '2026-01-30 18:26:58.499127', NULL),
(3, 'Exhaust Systems', 'exhaust-systems', '💨', 3, 1, '2026-01-30 18:26:58.000000', '2026-01-30 18:26:58.499127', NULL),
(4, 'Brakes', 'brakes', '🛑', 3, 1, '2026-01-30 18:26:58.000000', '2026-01-30 18:26:58.499127', NULL),
(5, 'Wheels & Tires', 'wheels-tires', '🛞', 3, 1, '2026-01-30 18:26:58.000000', '2026-01-30 18:26:58.499127', NULL),
(6, 'Interior', 'interior', '🪑', 4, 1, '2026-01-30 18:26:58.000000', '2026-01-31 17:22:28.417680', NULL),
(7, 'Exterior', 'exterior', '🚗', 3, 1, '2026-01-30 18:26:58.000000', '2026-01-30 18:26:58.499127', NULL),
(8, 'Lighting', 'lighting', '💡', 4, 1, '2026-01-30 18:26:58.000000', '2026-01-31 17:22:28.421344', NULL),
(9, 'Wheels', 'wheels', 'package', 1, 1, '2026-01-30 22:39:45.100041', '2026-01-31 17:22:28.425524', 'Wheels modifications'),
(10, 'Body Kits', 'body-kits', 'package', 1, 1, '2026-01-30 22:39:45.113360', '2026-01-31 17:22:28.429459', 'Body Kits modifications'),
(11, 'Engine', 'engine', 'package', 1, 1, '2026-01-30 22:39:45.121813', '2026-01-31 17:22:28.434190', 'Engine modifications');

-- --------------------------------------------------------

--
-- Table structure for table `complaint`
--

CREATE TABLE `complaint` (
  `id` int(11) NOT NULL,
  `subject` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `status` enum('open','in_progress','resolved') NOT NULL DEFAULT 'open',
  `priority` varchar(255) NOT NULL DEFAULT 'medium',
  `created_at` datetime(6) NOT NULL DEFAULT current_timestamp(6),
  `customerId` int(11) NOT NULL,
  `agentId` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `complaint`
--

INSERT INTO `complaint` (`id`, `subject`, `description`, `status`, `priority`, `created_at`, `customerId`, `agentId`) VALUES
(1, '[Feedback] General Inquiry', 'Good', 'resolved', 'medium', '2026-01-30 17:31:18.660951', 9, 6);

-- --------------------------------------------------------

--
-- Table structure for table `coupon`
--

CREATE TABLE `coupon` (
  `id` int(11) NOT NULL,
  `code` varchar(255) NOT NULL,
  `discount_type` enum('percentage','fixed') NOT NULL,
  `discount_value` decimal(10,2) NOT NULL,
  `min_order_value` decimal(10,2) NOT NULL DEFAULT 0.00,
  `max_discount` decimal(10,2) DEFAULT NULL,
  `expiry_date` timestamp NULL DEFAULT NULL,
  `is_active` tinyint(4) NOT NULL DEFAULT 1,
  `usage_limit` int(11) NOT NULL DEFAULT 0,
  `used_count` int(11) NOT NULL DEFAULT 0,
  `created_at` datetime(6) NOT NULL DEFAULT current_timestamp(6),
  `updated_at` datetime(6) NOT NULL DEFAULT current_timestamp(6) ON UPDATE current_timestamp(6)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `coupon`
--

INSERT INTO `coupon` (`id`, `code`, `discount_type`, `discount_value`, `min_order_value`, `max_discount`, `expiry_date`, `is_active`, `usage_limit`, `used_count`, `created_at`, `updated_at`) VALUES
(1, 'CARVO50', 'percentage', 50.00, 1.00, 3000.00, NULL, 1, 100, 0, '2026-01-30 22:23:41.156022', '2026-01-30 23:08:39.000000');

-- --------------------------------------------------------

--
-- Table structure for table `customer_profile`
--

CREATE TABLE `customer_profile` (
  `id` int(11) NOT NULL,
  `address` varchar(255) DEFAULT NULL,
  `userId` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `customer_profile`
--

INSERT INTO `customer_profile` (`id`, `address`, `userId`) VALUES
(1, '123 Main St', 2),
(2, NULL, 7),
(3, NULL, 8),
(4, '', 9),
(5, NULL, 10);

-- --------------------------------------------------------

--
-- Table structure for table `customization`
--

CREATE TABLE `customization` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `configuration` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`configuration`)),
  `preview_token` varchar(255) DEFAULT NULL,
  `customerId` int(11) NOT NULL,
  `carId` int(11) NOT NULL,
  `created_at` datetime(6) NOT NULL DEFAULT current_timestamp(6)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `customization`
--

INSERT INTO `customization` (`id`, `name`, `configuration`, `preview_token`, `customerId`, `carId`, `created_at`) VALUES
(1, 'My Dream Car', '{\"parts\":[1,2],\"colors\":[\"#000000\"]}', 'mock-preview-token-1765643708161', 8, 1, '2025-12-13 22:05:08.163324'),
(2, 'My Car Build', '{\"parts\":[2,1],\"colors\":[\"#dc2626\",\"#1a1a1a\"]}', 'mock-preview-token-1765643801092', 2, 1, '2025-12-13 22:06:41.101008'),
(3, 'My Car Build', '{\"parts\":[1],\"colors\":[\"#1a1a1a\"]}', 'mock-preview-token-1765644111022', 2, 1, '2025-12-13 22:11:51.023801'),
(4, 'Toyota Supra Build', '{\"parts\":[2,3],\"colors\":[\"#dc2626\",\"#2563eb\"]}', 'mock-preview-token-1767078549185', 2, 1, '2025-12-30 12:39:09.193429'),
(5, 'My Car Build', '{\"parts\":[2,3],\"colors\":[\"#dc2626\",\"#2563eb\"]}', 'mock-preview-token-1769774404493', 9, 1, '2026-01-30 17:30:04.507358');

-- --------------------------------------------------------

--
-- Table structure for table `delivery_profile`
--

CREATE TABLE `delivery_profile` (
  `id` int(11) NOT NULL,
  `vehicle_type` varchar(255) DEFAULT NULL,
  `license_number` varchar(255) DEFAULT NULL,
  `userId` int(11) NOT NULL,
  `vehicle_model` varchar(255) DEFAULT NULL,
  `vehicle_plate_number` varchar(255) DEFAULT NULL,
  `is_available` tinyint(1) NOT NULL DEFAULT 1,
  `current_latitude` decimal(10,8) DEFAULT NULL,
  `current_longitude` decimal(11,8) DEFAULT NULL,
  `rating` decimal(3,2) NOT NULL DEFAULT 0.00
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `delivery_profile`
--

INSERT INTO `delivery_profile` (`id`, `vehicle_type`, `license_number`, `userId`, `vehicle_model`, `vehicle_plate_number`, `is_available`, `current_latitude`, `current_longitude`, `rating`) VALUES
(1, 'Van', NULL, 5, NULL, NULL, 1, NULL, NULL, 0.00);

-- --------------------------------------------------------

--
-- Table structure for table `invoice`
--

CREATE TABLE `invoice` (
  `id` int(11) NOT NULL,
  `invoice_number` varchar(255) NOT NULL,
  `relationId` int(11) NOT NULL,
  `issue_date` datetime NOT NULL,
  `due_date` datetime NOT NULL,
  `subtotal` decimal(10,2) NOT NULL,
  `tax_rate` decimal(10,2) NOT NULL DEFAULT 10.00,
  `tax_amount` decimal(10,2) NOT NULL,
  `total` decimal(10,2) NOT NULL,
  `status` enum('pending','paid','overdue','cancelled') NOT NULL DEFAULT 'pending',
  `issued_to_name` varchar(255) NOT NULL,
  `issued_to_address` varchar(255) NOT NULL,
  `issued_to_email` varchar(255) DEFAULT NULL,
  `created_at` datetime(6) NOT NULL DEFAULT current_timestamp(6),
  `updated_at` datetime(6) NOT NULL DEFAULT current_timestamp(6) ON UPDATE current_timestamp(6),
  `orderId` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `invoice`
--

INSERT INTO `invoice` (`id`, `invoice_number`, `relationId`, `issue_date`, `due_date`, `subtotal`, `tax_rate`, `tax_amount`, `total`, `status`, `issued_to_name`, `issued_to_address`, `issued_to_email`, `created_at`, `updated_at`, `orderId`) VALUES
(1, 'INV-20260130-0011', 11, '2026-01-30 22:17:51', '2026-02-13 22:17:51', 1500.00, 10.00, 150.00, 1650.00, 'pending', 'Dhruv Teli', 'home', 'dhruvteli6019@gmail.com', '2026-01-30 22:17:51.733204', '2026-01-30 22:17:51.733204', 11),
(2, 'INV-20260130-0013', 13, '2026-01-30 23:11:59', '2026-02-13 23:11:59', 1.00, 10.00, 0.10, 1.10, 'pending', 'Dhruv Teli', 'home', 'dhruvteli6019@gmail.com', '2026-01-30 23:11:59.426082', '2026-01-30 23:11:59.426082', 13),
(3, 'INV-20260131-0014', 14, '2026-01-31 18:01:07', '2026-02-14 18:01:07', 2.00, 10.00, 0.20, 2.20, 'pending', 'Teli Dhruv', 'home', 'dhruvteli9091@gmail.com', '2026-01-31 18:01:07.169810', '2026-01-31 18:01:07.169810', 14);

-- --------------------------------------------------------

--
-- Table structure for table `migrations`
--

CREATE TABLE `migrations` (
  `id` int(11) NOT NULL,
  `timestamp` bigint(20) NOT NULL,
  `name` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `migrations`
--

INSERT INTO `migrations` (`id`, `timestamp`, `name`) VALUES
(1, 1700000000000, 'InitialSchema1700000000000'),
(2, 1700000000001, 'AddDeliveryFieldsToOrder1700000000001');

-- --------------------------------------------------------

--
-- Table structure for table `notification`
--

CREATE TABLE `notification` (
  `id` int(11) NOT NULL,
  `userId` int(11) NOT NULL,
  `type` enum('order_update','payment_confirmed','delivery_assigned','delivery_completed','customization_approved','system','security_alert','role_update','review_received','low_stock') NOT NULL,
  `title` varchar(255) NOT NULL,
  `message` text NOT NULL,
  `isRead` tinyint(4) NOT NULL DEFAULT 0,
  `relatedEntityId` int(11) DEFAULT NULL,
  `created_at` datetime(6) NOT NULL DEFAULT current_timestamp(6)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `notification`
--

INSERT INTO `notification` (`id`, `userId`, `type`, `title`, `message`, `isRead`, `relatedEntityId`, `created_at`) VALUES
(1, 10, 'order_update', 'Order Placed Successfully', 'Your order #14 has been placed successfully. Total: $2.00', 1, 14, '2026-01-31 18:00:52.619015'),
(2, 10, 'payment_confirmed', 'Payment Received', 'We\'ve received your payment of $2.00 for order #14. Processing will begin shortly.', 1, 14, '2026-01-31 18:00:52.632686'),
(3, 3, 'order_update', 'New Order Received', 'You have a new order #14. Check your dashboard for details.', 0, 14, '2026-01-31 18:00:52.648386'),
(4, 10, 'order_update', 'Order Placed Successfully', 'Your order #15 has been placed successfully. Total: $2.00', 1, 15, '2026-01-31 18:05:02.789408'),
(5, 10, 'payment_confirmed', 'Payment Received', 'We\'ve received your payment of $2.00 for order #15. Processing will begin shortly.', 1, 15, '2026-01-31 18:05:06.157784'),
(6, 3, 'order_update', 'New Order Received', 'You have a new order #15. Check your dashboard for details.', 0, 15, '2026-01-31 18:05:09.441775');

-- --------------------------------------------------------

--
-- Table structure for table `order`
--

CREATE TABLE `order` (
  `id` int(11) NOT NULL,
  `total_amount` decimal(10,2) NOT NULL,
  `status` enum('pending','processing','shipped','out_for_delivery','delivered','cancelled') NOT NULL DEFAULT 'pending',
  `shipping_address` varchar(255) NOT NULL,
  `created_at` datetime(6) NOT NULL DEFAULT current_timestamp(6),
  `customerId` int(11) NOT NULL,
  `deliveryAgentId` int(11) DEFAULT NULL,
  `trackingNumber` varchar(255) DEFAULT NULL,
  `deliveryOtp` varchar(255) DEFAULT NULL,
  `coupon_code` varchar(255) DEFAULT NULL,
  `discount_amount` decimal(10,2) NOT NULL DEFAULT 0.00,
  `final_amount` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `order`
--

INSERT INTO `order` (`id`, `total_amount`, `status`, `shipping_address`, `created_at`, `customerId`, `deliveryAgentId`, `trackingNumber`, `deliveryOtp`, `coupon_code`, `discount_amount`, `final_amount`) VALUES
(1, 2000.00, 'out_for_delivery', '123 Test St', '2025-12-13 22:05:08.217846', 8, 5, NULL, '917978', NULL, 0.00, 0.00),
(2, 2000.00, 'pending', 'Address on file', '2026-01-05 20:58:02.420671', 9, NULL, NULL, NULL, NULL, 0.00, 0.00),
(3, 349.99, 'pending', '11, myhome, abad', '2026-01-05 21:28:16.944933', 9, NULL, NULL, NULL, NULL, 0.00, 0.00),
(4, 1500.00, 'pending', 'home', '2026-01-05 21:36:26.103627', 9, NULL, NULL, NULL, NULL, 0.00, 0.00),
(5, 349.99, 'pending', 'home', '2026-01-05 22:01:03.710828', 9, NULL, NULL, NULL, NULL, 0.00, 0.00),
(6, 1299.00, 'pending', 'home', '2026-01-06 13:00:03.030515', 9, NULL, NULL, NULL, NULL, 0.00, 0.00),
(7, 2499.00, 'delivered', 'home', '2026-01-23 12:09:49.997403', 9, 5, NULL, '', NULL, 0.00, 0.00),
(8, 7000.00, 'delivered', 'manan', '2026-01-27 12:48:09.965239', 2, 5, NULL, '', NULL, 0.00, 0.00),
(9, 1500.00, 'pending', 'home', '2026-01-30 17:42:23.614505', 9, NULL, NULL, NULL, NULL, 0.00, 0.00),
(10, 1299.00, 'pending', 'hom', '2026-01-30 17:44:27.663134', 9, NULL, NULL, NULL, NULL, 0.00, 0.00),
(11, 1500.00, 'processing', 'home', '2026-01-30 17:49:42.214470', 9, NULL, NULL, NULL, NULL, 0.00, 0.00),
(12, 45000.00, 'pending', '123 Test Street, Developer City', '2026-01-30 22:39:45.181105', 2, NULL, NULL, NULL, NULL, 0.00, 0.00),
(13, 1.00, 'processing', 'home', '2026-01-30 23:11:45.259034', 9, NULL, NULL, NULL, NULL, 0.00, 1.00),
(14, 2.00, 'processing', 'home', '2026-01-31 18:00:52.591176', 10, NULL, NULL, NULL, NULL, 0.00, 2.00),
(15, 2.00, 'processing', 'home', '2026-01-31 18:05:02.747257', 10, NULL, NULL, NULL, NULL, 0.00, 2.00);

-- --------------------------------------------------------

--
-- Table structure for table `order_item`
--

CREATE TABLE `order_item` (
  `id` int(11) NOT NULL,
  `quantity` int(11) NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `orderId` int(11) NOT NULL,
  `partId` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `order_item`
--

INSERT INTO `order_item` (`id`, `quantity`, `price`, `orderId`, `partId`) VALUES
(1, 1, 2000.00, 1, 1),
(2, 1, 2000.00, 2, 1),
(3, 1, 349.99, 3, 3),
(4, 1, 1500.00, 4, 2),
(5, 1, 349.99, 5, 3),
(6, 1, 1299.00, 6, 4),
(7, 1, 2499.00, 7, 6),
(8, 2, 1500.00, 8, 2),
(9, 2, 2000.00, 8, 1),
(10, 1, 1500.00, 9, 2),
(11, 1, 1299.00, 10, 4),
(12, 1, 1500.00, 11, 2),
(13, 1, 45000.00, 12, 26),
(14, 1, 1.00, 13, 31),
(15, 1, 2.00, 14, 31),
(16, 1, 2.00, 15, 31);

-- --------------------------------------------------------

--
-- Table structure for table `part`
--

CREATE TABLE `part` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `price` decimal(10,2) NOT NULL,
  `stock_quantity` int(11) NOT NULL,
  `image_url` varchar(255) DEFAULT NULL,
  `categoryId` int(11) NOT NULL,
  `sellerId` int(11) NOT NULL DEFAULT 3
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `part`
--

INSERT INTO `part` (`id`, `name`, `description`, `price`, `stock_quantity`, `image_url`, `categoryId`, `sellerId`) VALUES
(1, 'Turbocharger Kit', 'High-performance turbocharger kit for increased power', 1299.99, 15, 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=500&h=500&fit=crop', 1, 3),
(2, 'Cold Air Intake', 'Performance cold air intake system', 349.99, 25, 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=500&h=500&fit=crop', 1, 3),
(3, 'Performance Spark Plugs', 'Iridium performance spark plugs set', 89.99, 50, 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=500&h=500&fit=crop', 1, 3),
(4, 'Engine Oil Filter', 'High-flow performance oil filter', 24.99, 100, 'https://images.unsplash.com/photo-1625047509168-a7026f36de04?w=500&h=500&fit=crop', 1, 3),
(5, 'Coilover Suspension Kit', 'Adjustable coilover suspension system', 1899.99, 10, 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=500&h=500&fit=crop', 2, 3),
(6, 'Sway Bar Kit', 'Front and rear sway bar upgrade kit', 449.99, 20, 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=500&h=500&fit=crop', 2, 3),
(7, 'Strut Tower Brace', 'Aluminum strut tower brace for chassis rigidity', 199.99, 30, 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=500&h=500&fit=crop', 2, 3),
(8, 'Cat-Back Exhaust System', 'Stainless steel cat-back exhaust', 899.99, 12, 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=500&h=500&fit=crop', 3, 3),
(9, 'Performance Muffler', 'High-flow performance muffler', 299.99, 25, 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=500&h=500&fit=crop', 3, 3),
(10, 'Exhaust Tips', 'Chrome dual exhaust tips', 79.99, 40, 'https://images.unsplash.com/photo-1485463611174-f302f6a5c1c9?w=500&h=500&fit=crop', 3, 3),
(11, 'Performance Brake Kit', 'Complete big brake kit with calipers', 2499.99, 8, 'https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=500&h=500&fit=crop', 4, 3),
(12, 'Ceramic Brake Pads', 'High-performance ceramic brake pads', 149.99, 35, 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=500&h=500&fit=crop', 4, 3),
(13, 'Slotted Brake Rotors', 'Performance slotted brake rotors pair', 329.99, 20, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&h=500&fit=crop', 4, 3),
(14, 'Forged Alloy Wheels', '18-inch forged alloy wheels set of 4', 1999.99, 12, 'https://images.unsplash.com/photo-1558980664-769d59546b3d?w=500&h=500&fit=crop', 5, 3),
(15, 'Performance Tires', 'High-performance summer tires set of 4', 899.99, 18, 'https://images.unsplash.com/photo-1606016159991-47141290d0e1?w=500&h=500&fit=crop', 5, 3),
(16, 'Wheel Spacers', 'Aluminum wheel spacers kit', 129.99, 45, 'https://images.unsplash.com/photo-1617469767053-d3b523a0b982?w=500&h=500&fit=crop', 5, 3),
(17, 'Racing Seats', 'Bucket racing seats pair', 1299.99, 10, 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=500&h=500&fit=crop', 6, 3),
(18, 'Steering Wheel', 'Leather-wrapped performance steering wheel', 399.99, 15, 'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?w=500&h=500&fit=crop', 6, 3),
(19, 'Floor Mats', 'Premium all-weather floor mats', 89.99, 50, 'https://images.unsplash.com/photo-1590362891991-f776e747a588?w=500&h=500&fit=crop', 6, 3),
(20, 'Carbon Fiber Hood', 'Lightweight carbon fiber hood', 1799.99, 5, 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=500&h=500&fit=crop', 7, 3),
(21, 'Rear Spoiler', 'Adjustable rear spoiler wing', 599.99, 12, 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=500&h=500&fit=crop', 7, 3),
(22, 'Side Skirts', 'Aerodynamic side skirts pair', 449.99, 15, 'https://images.unsplash.com/photo-1542362567-b07e54a88620?w=500&h=500&fit=crop', 7, 3),
(23, 'LED Headlight Kit', '6000K LED headlight conversion kit', 249.99, 30, 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=500&h=500&fit=crop', 8, 3),
(24, 'Underglow LED Kit', 'RGB underglow LED strip kit', 149.99, 25, 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=500&h=500&fit=crop', 8, 3),
(25, 'Tail Light Assembly', 'LED tail light assembly pair', 399.99, 20, 'https://images.unsplash.com/photo-1485463611174-f302f6a5c1c9?w=500&h=500&fit=crop', 8, 3),
(26, 'Alloy Wheels V1', 'High performance alloy wheels', 45000.00, 10, 'https://images.unsplash.com/photo-1542281286-9e0a16bb7366?auto=format&fit=crop&q=80&w=200', 9, 3),
(27, 'Carbon Fiber Spoiler', 'Lightweight aerodynamic spoiler', 15000.00, 5, 'https://images.unsplash.com/photo-1542281286-9e0a16bb7366?auto=format&fit=crop&q=80&w=200', 10, 3),
(28, 'Sport Exhaust System', 'Stainless steel exhaust for better sound', 35000.00, 8, 'https://images.unsplash.com/photo-1542281286-9e0a16bb7366?auto=format&fit=crop&q=80&w=200', 11, 3),
(29, 'Leather Seat Covers', 'Premium leather covers for all seats', 20000.00, 12, 'https://images.unsplash.com/photo-1542281286-9e0a16bb7366?auto=format&fit=crop&q=80&w=200', 6, 3),
(30, 'LED Underglow Kit', 'RGB LED kit with mobile app control', 5000.00, 20, 'https://images.unsplash.com/photo-1542281286-9e0a16bb7366?auto=format&fit=crop&q=80&w=200', 8, 3),
(31, 'sample', '', 2.00, 7, NULL, 1, 3);

-- --------------------------------------------------------

--
-- Table structure for table `payment`
--

CREATE TABLE `payment` (
  `id` int(11) NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `method` varchar(255) NOT NULL,
  `status` enum('pending','awaiting_confirmation','completed','failed') NOT NULL DEFAULT 'pending',
  `transaction_id` varchar(255) DEFAULT NULL,
  `created_at` datetime(6) NOT NULL DEFAULT current_timestamp(6),
  `orderId` int(11) DEFAULT NULL,
  `bookingId` int(11) DEFAULT NULL,
  `transaction_reference` varchar(255) DEFAULT NULL,
  `upi_transaction_id` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `payment`
--

INSERT INTO `payment` (`id`, `amount`, `method`, `status`, `transaction_id`, `created_at`, `orderId`, `bookingId`, `transaction_reference`, `upi_transaction_id`) VALUES
(1, 349.99, 'cod', 'pending', 'mock-txn-1767628696969', '2026-01-05 21:28:16.973543', 3, NULL, NULL, NULL),
(2, 1500.00, 'card', 'pending', 'mock-txn-1767629186126', '2026-01-05 21:36:26.128105', 4, NULL, NULL, NULL),
(3, 349.99, 'card', 'pending', 'mock-txn-1767630663725', '2026-01-05 22:01:03.727073', 5, NULL, NULL, NULL),
(4, 1299.00, 'cod', 'pending', 'mock-txn-1767684603071', '2026-01-06 13:00:03.076328', 6, NULL, NULL, NULL),
(5, 2499.00, 'cod', 'pending', 'mock-txn-1769150390036', '2026-01-23 12:09:50.041017', 7, NULL, NULL, NULL),
(6, 7000.00, 'cod', 'pending', 'mock-txn-1769498290012', '2026-01-27 12:48:10.017801', 8, NULL, NULL, NULL),
(7, 1500.00, 'upi', 'awaiting_confirmation', 'upi-1769775143661-9', '2026-01-30 17:42:23.667124', 9, NULL, NULL, NULL),
(8, 1299.00, 'upi', 'awaiting_confirmation', 'upi-1769775267680-10', '2026-01-30 17:44:27.684173', 10, NULL, NULL, NULL),
(9, 1500.00, 'cod', 'pending', 'cod-1769775582241-11', '2026-01-30 17:49:42.244383', 11, NULL, NULL, NULL),
(10, 1.00, 'upi', 'completed', 'upi-1769794905290-13', '2026-01-30 23:11:45.295496', 13, NULL, '698338837722', ''),
(11, 2.00, 'cod', 'pending', 'cod-1769862652672-14', '2026-01-31 18:00:52.678143', 14, NULL, NULL, NULL),
(12, 2.00, 'cod', 'pending', 'cod-1769862909473-15', '2026-01-31 18:05:09.478777', 15, NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `quotation`
--

CREATE TABLE `quotation` (
  `id` int(11) NOT NULL,
  `estimated_price` decimal(10,2) DEFAULT NULL,
  `status` enum('pending','accepted','rejected') NOT NULL DEFAULT 'pending',
  `created_at` datetime(6) NOT NULL DEFAULT current_timestamp(6),
  `customerId` int(11) NOT NULL,
  `customizationId` int(11) NOT NULL,
  `providerId` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `quotation`
--

INSERT INTO `quotation` (`id`, `estimated_price`, `status`, `created_at`, `customerId`, `customizationId`, `providerId`) VALUES
(1, NULL, 'pending', '2025-12-13 22:05:08.181490', 8, 1, NULL),
(2, NULL, 'pending', '2025-12-13 22:06:41.136646', 2, 2, NULL),
(3, NULL, 'pending', '2025-12-13 22:11:51.038989', 2, 3, NULL),
(4, NULL, 'pending', '2025-12-30 12:39:09.242113', 2, 4, NULL),
(5, NULL, 'pending', '2026-01-30 17:30:04.542619', 9, 5, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `seller_profile`
--

CREATE TABLE `seller_profile` (
  `id` int(11) NOT NULL,
  `business_name` varchar(255) NOT NULL,
  `registration_number` varchar(255) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `userId` int(11) NOT NULL,
  `tax_id` varchar(255) DEFAULT NULL,
  `bank_name` varchar(255) DEFAULT NULL,
  `bank_account_number` varchar(255) DEFAULT NULL,
  `is_verified` tinyint(1) NOT NULL DEFAULT 0,
  `rating` decimal(3,2) NOT NULL DEFAULT 0.00
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `seller_profile`
--

INSERT INTO `seller_profile` (`id`, `business_name`, `registration_number`, `address`, `userId`, `tax_id`, `bank_name`, `bank_account_number`, `is_verified`, `rating`) VALUES
(1, 'Auto Parts Co', NULL, '456 Industrial Ave', 3, NULL, NULL, NULL, 0, 0.00);

-- --------------------------------------------------------

--
-- Table structure for table `service_provider_profile`
--

CREATE TABLE `service_provider_profile` (
  `id` int(11) NOT NULL,
  `company_name` varchar(255) NOT NULL,
  `service_types` text DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `userId` int(11) NOT NULL,
  `experience_years` int(11) DEFAULT NULL,
  `certification_details` text DEFAULT NULL,
  `is_verified` tinyint(1) NOT NULL DEFAULT 0,
  `rating` decimal(3,2) NOT NULL DEFAULT 0.00,
  `operating_hours` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `service_provider_profile`
--

INSERT INTO `service_provider_profile` (`id`, `company_name`, `service_types`, `address`, `userId`, `experience_years`, `certification_details`, `is_verified`, `rating`, `operating_hours`) VALUES
(1, 'Best Mechanics', 'installation,repair', NULL, 4, NULL, NULL, 0, 0.00, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `support_profile`
--

CREATE TABLE `support_profile` (
  `id` int(11) NOT NULL,
  `employee_id` varchar(255) DEFAULT NULL,
  `userId` int(11) NOT NULL,
  `department` varchar(255) DEFAULT NULL,
  `shift_start` time DEFAULT NULL,
  `shift_end` time DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `support_profile`
--

INSERT INTO `support_profile` (`id`, `employee_id`, `userId`, `department`, `shift_start`, `shift_end`) VALUES
(1, 'EMP001', 6, NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `system_setting`
--

CREATE TABLE `system_setting` (
  `key` varchar(255) NOT NULL,
  `value` varchar(255) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `updated_at` datetime(6) NOT NULL DEFAULT current_timestamp(6) ON UPDATE current_timestamp(6)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE `user` (
  `id` int(11) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) DEFAULT NULL,
  `role` enum('admin','customer','seller','service_provider','delivery_boy','support_agent') NOT NULL DEFAULT 'customer',
  `name` varchar(255) NOT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `created_at` datetime(6) NOT NULL DEFAULT current_timestamp(6),
  `updated_at` datetime(6) NOT NULL DEFAULT current_timestamp(6) ON UPDATE current_timestamp(6),
  `googleId` varchar(255) DEFAULT NULL,
  `resetPasswordToken` varchar(255) DEFAULT NULL,
  `resetPasswordExpires` datetime DEFAULT NULL,
  `isVerified` tinyint(4) NOT NULL DEFAULT 0,
  `otp` varchar(255) DEFAULT NULL,
  `otpExpiresAt` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`id`, `email`, `password`, `role`, `name`, `phone`, `created_at`, `updated_at`, `googleId`, `resetPasswordToken`, `resetPasswordExpires`, `isVerified`, `otp`, `otpExpiresAt`) VALUES
(1, 'admin@carvo.com', '$2b$10$K8Ob8ykX6vLiSRNmlxriPOZdyZm5YN2uW.n1m3TOvUd22iSfPLy9m', 'admin', 'Admin User', NULL, '2025-11-29 18:23:11.814591', '2026-01-31 17:56:22.000000', NULL, NULL, NULL, 1, NULL, NULL),
(2, 'customer@carvo.com', '$2b$10$K8Ob8ykX6vLiSRNmlxriPOZdyZm5YN2uW.n1m3TOvUd22iSfPLy9m', 'customer', 'John Doe', NULL, '2025-11-29 18:23:11.826852', '2026-01-31 17:56:22.000000', NULL, NULL, NULL, 1, NULL, NULL),
(3, 'seller@carvo.com', '$2b$10$K8Ob8ykX6vLiSRNmlxriPOZdyZm5YN2uW.n1m3TOvUd22iSfPLy9m', 'seller', 'Auto Parts Co', NULL, '2025-11-29 18:23:11.842651', '2026-01-31 17:56:22.000000', NULL, NULL, NULL, 1, NULL, NULL),
(4, 'provider@carvo.com', '$2b$10$K8Ob8ykX6vLiSRNmlxriPOZdyZm5YN2uW.n1m3TOvUd22iSfPLy9m', 'service_provider', 'Best Mechanics', NULL, '2025-11-29 18:23:11.853409', '2026-01-31 17:56:22.000000', NULL, NULL, NULL, 1, NULL, NULL),
(5, 'delivery@carvo.com', '$2b$10$K8Ob8ykX6vLiSRNmlxriPOZdyZm5YN2uW.n1m3TOvUd22iSfPLy9m', 'delivery_boy', 'Fast Delivery', NULL, '2025-11-29 18:23:11.865876', '2026-01-31 17:56:22.000000', NULL, NULL, NULL, 1, NULL, NULL),
(6, 'support@carvo.com', '$2b$10$K8Ob8ykX6vLiSRNmlxriPOZdyZm5YN2uW.n1m3TOvUd22iSfPLy9m', 'support_agent', 'Support Agent', NULL, '2025-11-29 18:23:11.877024', '2026-01-31 17:56:22.000000', NULL, NULL, NULL, 1, NULL, NULL),
(7, 'testuser_1765643667799@example.com', '$2b$10$yokfQwCWprnvbfixngvxf.esxdhLWzTub8mdzSxHqxJBX36TlBI7m', 'customer', 'Test User', NULL, '2025-12-13 22:04:27.986351', '2026-01-31 17:56:22.000000', NULL, NULL, NULL, 1, NULL, NULL),
(8, 'testuser_1765643707938@example.com', '$2b$10$flJGp0XK8eexrrSuZykJ9uoh2PpL56oSJodK5RISZvy.BkEdBj/sq', 'customer', 'Test User', NULL, '2025-12-13 22:05:08.080922', '2026-01-31 17:56:22.000000', NULL, NULL, NULL, 1, NULL, NULL),
(9, 'dhruvteli6019@gmail.com', NULL, 'customer', 'Dhruv Teli', '', '2026-01-05 20:47:58.223583', '2026-01-31 17:56:22.000000', '101550444048333018042', NULL, NULL, 1, NULL, NULL),
(10, 'dhruvteli9091@gmail.com', '$2b$10$nVb/UxcKSkej8F0vDAYnhO/VcpDsU4MHlXzp4o9ikhlnnwNXU7Btm', 'customer', 'Teli Dhruv', NULL, '2026-01-31 17:58:54.481660', '2026-01-31 17:59:20.000000', NULL, NULL, NULL, 1, '676552', '2026-01-31 18:08:54');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `booking`
--
ALTER TABLE `booking`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK_72e32d29a7de28b3c469f858d56` (`customerId`),
  ADD KEY `FK_a72e9f0d2fc70ca6ec1b310514f` (`providerId`),
  ADD KEY `FK_af6c78b9df532d8b01cb3d0197e` (`quotationId`);

--
-- Indexes for table `car`
--
ALTER TABLE `car`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `category`
--
ALTER TABLE `category`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `IDX_cb73208f151aa71cdd78f662d7` (`slug`);

--
-- Indexes for table `complaint`
--
ALTER TABLE `complaint`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK_f714c71743dcd19f15876136713` (`customerId`),
  ADD KEY `FK_b46690977ca397f66e1bfc229d4` (`agentId`);

--
-- Indexes for table `coupon`
--
ALTER TABLE `coupon`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `IDX_62d3c5b0ce63a82c48e86d904b` (`code`);

--
-- Indexes for table `customer_profile`
--
ALTER TABLE `customer_profile`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `REL_ef0e39facebe3853598e730837` (`userId`);

--
-- Indexes for table `customization`
--
ALTER TABLE `customization`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK_56a4c1668b2f23dca12418cddd8` (`customerId`),
  ADD KEY `FK_fbd296ed3ba89497441bd0018c4` (`carId`);

--
-- Indexes for table `delivery_profile`
--
ALTER TABLE `delivery_profile`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `REL_46eec824b778f53970d60c9a8a` (`userId`);

--
-- Indexes for table `invoice`
--
ALTER TABLE `invoice`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `IDX_c7ec75a1a4068196ea74b920df` (`invoice_number`),
  ADD UNIQUE KEY `REL_f494ce6746b91e9ec9562af485` (`orderId`);

--
-- Indexes for table `migrations`
--
ALTER TABLE `migrations`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `notification`
--
ALTER TABLE `notification`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK_1ced25315eb974b73391fb1c81b` (`userId`);

--
-- Indexes for table `order`
--
ALTER TABLE `order`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK_124456e637cca7a415897dce659` (`customerId`),
  ADD KEY `FK_88a8edf8ba68eb8763c67228149` (`deliveryAgentId`);

--
-- Indexes for table `order_item`
--
ALTER TABLE `order_item`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK_646bf9ece6f45dbe41c203e06e0` (`orderId`),
  ADD KEY `FK_79bff38b8a21b2e13b09c313768` (`partId`);

--
-- Indexes for table `part`
--
ALTER TABLE `part`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK_007a4c28df9110b9403e664659f` (`categoryId`),
  ADD KEY `FK_704d360b219777f03f1b4dbf8a7` (`sellerId`);

--
-- Indexes for table `payment`
--
ALTER TABLE `payment`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK_d09d285fe1645cd2f0db811e293` (`orderId`),
  ADD KEY `FK_5738278c92c15e1ec9d27e3a098` (`bookingId`);

--
-- Indexes for table `quotation`
--
ALTER TABLE `quotation`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK_51bc6958b152b2a737636d43771` (`customerId`),
  ADD KEY `FK_7af77892f0847cfcb8e4913a84c` (`customizationId`),
  ADD KEY `FK_2d469599e14e7cdef6e9e0c1e99` (`providerId`);

--
-- Indexes for table `seller_profile`
--
ALTER TABLE `seller_profile`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `REL_c2b29aefac4072d2503cab6c0c` (`userId`);

--
-- Indexes for table `service_provider_profile`
--
ALTER TABLE `service_provider_profile`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `REL_25e134d6912a6d0a44151793cd` (`userId`);

--
-- Indexes for table `support_profile`
--
ALTER TABLE `support_profile`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `REL_0d9539b4f2d000c81a3bc8f1fe` (`userId`);

--
-- Indexes for table `system_setting`
--
ALTER TABLE `system_setting`
  ADD PRIMARY KEY (`key`);

--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `IDX_e12875dfb3b1d92d7d7c5377e2` (`email`),
  ADD UNIQUE KEY `IDX_470355432cc67b2c470c30bef7` (`googleId`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `booking`
--
ALTER TABLE `booking`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `car`
--
ALTER TABLE `car`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `category`
--
ALTER TABLE `category`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `complaint`
--
ALTER TABLE `complaint`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `coupon`
--
ALTER TABLE `coupon`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `customer_profile`
--
ALTER TABLE `customer_profile`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `customization`
--
ALTER TABLE `customization`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `delivery_profile`
--
ALTER TABLE `delivery_profile`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `invoice`
--
ALTER TABLE `invoice`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `migrations`
--
ALTER TABLE `migrations`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `notification`
--
ALTER TABLE `notification`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `order`
--
ALTER TABLE `order`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT for table `order_item`
--
ALTER TABLE `order_item`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT for table `part`
--
ALTER TABLE `part`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=32;

--
-- AUTO_INCREMENT for table `payment`
--
ALTER TABLE `payment`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `quotation`
--
ALTER TABLE `quotation`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `seller_profile`
--
ALTER TABLE `seller_profile`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `service_provider_profile`
--
ALTER TABLE `service_provider_profile`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `support_profile`
--
ALTER TABLE `support_profile`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `user`
--
ALTER TABLE `user`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `booking`
--
ALTER TABLE `booking`
  ADD CONSTRAINT `FK_72e32d29a7de28b3c469f858d56` FOREIGN KEY (`customerId`) REFERENCES `user` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `FK_a72e9f0d2fc70ca6ec1b310514f` FOREIGN KEY (`providerId`) REFERENCES `user` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `FK_af6c78b9df532d8b01cb3d0197e` FOREIGN KEY (`quotationId`) REFERENCES `quotation` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Constraints for table `complaint`
--
ALTER TABLE `complaint`
  ADD CONSTRAINT `FK_b46690977ca397f66e1bfc229d4` FOREIGN KEY (`agentId`) REFERENCES `user` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `FK_f714c71743dcd19f15876136713` FOREIGN KEY (`customerId`) REFERENCES `user` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Constraints for table `customer_profile`
--
ALTER TABLE `customer_profile`
  ADD CONSTRAINT `FK_ef0e39facebe3853598e7308377` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Constraints for table `customization`
--
ALTER TABLE `customization`
  ADD CONSTRAINT `FK_56a4c1668b2f23dca12418cddd8` FOREIGN KEY (`customerId`) REFERENCES `user` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `FK_fbd296ed3ba89497441bd0018c4` FOREIGN KEY (`carId`) REFERENCES `car` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Constraints for table `delivery_profile`
--
ALTER TABLE `delivery_profile`
  ADD CONSTRAINT `FK_46eec824b778f53970d60c9a8ac` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Constraints for table `invoice`
--
ALTER TABLE `invoice`
  ADD CONSTRAINT `FK_f494ce6746b91e9ec9562af4857` FOREIGN KEY (`orderId`) REFERENCES `order` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Constraints for table `notification`
--
ALTER TABLE `notification`
  ADD CONSTRAINT `FK_1ced25315eb974b73391fb1c81b` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Constraints for table `order`
--
ALTER TABLE `order`
  ADD CONSTRAINT `FK_124456e637cca7a415897dce659` FOREIGN KEY (`customerId`) REFERENCES `user` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `FK_88a8edf8ba68eb8763c67228149` FOREIGN KEY (`deliveryAgentId`) REFERENCES `user` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Constraints for table `order_item`
--
ALTER TABLE `order_item`
  ADD CONSTRAINT `FK_646bf9ece6f45dbe41c203e06e0` FOREIGN KEY (`orderId`) REFERENCES `order` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `FK_79bff38b8a21b2e13b09c313768` FOREIGN KEY (`partId`) REFERENCES `part` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Constraints for table `part`
--
ALTER TABLE `part`
  ADD CONSTRAINT `FK_007a4c28df9110b9403e664659f` FOREIGN KEY (`categoryId`) REFERENCES `category` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `FK_704d360b219777f03f1b4dbf8a7` FOREIGN KEY (`sellerId`) REFERENCES `user` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Constraints for table `payment`
--
ALTER TABLE `payment`
  ADD CONSTRAINT `FK_5738278c92c15e1ec9d27e3a098` FOREIGN KEY (`bookingId`) REFERENCES `booking` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `FK_d09d285fe1645cd2f0db811e293` FOREIGN KEY (`orderId`) REFERENCES `order` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Constraints for table `quotation`
--
ALTER TABLE `quotation`
  ADD CONSTRAINT `FK_2d469599e14e7cdef6e9e0c1e99` FOREIGN KEY (`providerId`) REFERENCES `user` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `FK_51bc6958b152b2a737636d43771` FOREIGN KEY (`customerId`) REFERENCES `user` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `FK_7af77892f0847cfcb8e4913a84c` FOREIGN KEY (`customizationId`) REFERENCES `customization` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Constraints for table `seller_profile`
--
ALTER TABLE `seller_profile`
  ADD CONSTRAINT `FK_c2b29aefac4072d2503cab6c0c4` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Constraints for table `service_provider_profile`
--
ALTER TABLE `service_provider_profile`
  ADD CONSTRAINT `FK_25e134d6912a6d0a44151793cd2` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Constraints for table `support_profile`
--
ALTER TABLE `support_profile`
  ADD CONSTRAINT `FK_0d9539b4f2d000c81a3bc8f1fe1` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
