-- =============================================
-- ShopEase E-Commerce Database Schema
-- MySQL 8.x
-- =============================================

CREATE DATABASE IF NOT EXISTS shopease;
USE shopease;

-- ─── Users ───
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    address TEXT,
    role ENUM('CUSTOMER', 'ADMIN') DEFAULT 'CUSTOMER',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- ─── Categories ───
CREATE TABLE categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    image_url VARCHAR(500)
) ENGINE=InnoDB;

-- ─── Products ───
CREATE TABLE products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    original_price DECIMAL(10, 2),
    image_url VARCHAR(500),
    stock INT DEFAULT 0,
    category_id INT,
    rating DECIMAL(2, 1) DEFAULT 0.0,
    review_count INT DEFAULT 0,
    featured BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id)
        ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB;

-- ─── Cart (State-Persistent) ───
CREATE TABLE cart (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT DEFAULT 1,
    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
        ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id)
        ON DELETE CASCADE ON UPDATE CASCADE,
    UNIQUE KEY unique_cart_item (user_id, product_id)
) ENGINE=InnoDB;

-- ─── Orders ───
CREATE TABLE orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    total_amount DECIMAL(10, 2) NOT NULL,
    status ENUM('PENDING', 'CONFIRMED', 'SHIPPED', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED') DEFAULT 'PENDING',
    shipping_address TEXT NOT NULL,
    payment_method VARCHAR(50) DEFAULT 'COD',
    shipping_charges DECIMAL(10, 2) DEFAULT 0.00,
    expected_delivery_date TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
        ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;

-- ─── Order Items ───
CREATE TABLE order_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id)
        ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id)
        ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;


-- =============================================
-- Sample Data
-- =============================================

-- Admin user (password: admin123 — BCrypt hash)
INSERT INTO users (name, email, password, role) VALUES
('Admin', 'admin@shopease.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'ADMIN');

-- Sample customer (password: customer123)
INSERT INTO users (name, email, password, phone, address, role) VALUES
('Manoj Kumar', 'manoj@example.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', '9876543210', '123 Main Street, Chennai', 'CUSTOMER');

-- Categories
INSERT INTO categories (name, description, image_url) VALUES
('Electronics', 'Smartphones, laptops, gadgets and more', 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400'),
('Fashion', 'Trendy clothing, shoes and accessories', 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=400'),
('Home & Living', 'Furniture, decor and home essentials', 'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=400'),
('Books', 'Bestsellers, academic and fiction', 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400'),
('Sports', 'Fitness gear, outdoor equipment', 'https://images.unsplash.com/photo-1461896836934-bd45ba8fcb8d?w=400');

-- Products
INSERT INTO products (name, description, price, original_price, image_url, stock, category_id, rating, review_count, featured) VALUES
('iPhone 15 Pro Max', 'Apple iPhone 15 Pro Max with A17 Pro chip, 256GB, Titanium finish', 134900.00, 149900.00, 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=400', 25, 1, 4.8, 1240, TRUE),
('Samsung Galaxy S24 Ultra', 'Samsung Galaxy S24 Ultra with S Pen, 512GB, AI features', 129999.00, 144999.00, 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=400', 30, 1, 4.7, 890, TRUE),
('MacBook Air M3', 'Apple MacBook Air 15-inch M3 chip, 16GB RAM, 512GB SSD', 149900.00, 169900.00, 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400', 15, 1, 4.9, 650, TRUE),
('Sony WH-1000XM5', 'Premium noise-cancelling wireless headphones', 29990.00, 34990.00, 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=400', 50, 1, 4.6, 2100, FALSE),
('Nike Air Max 270', 'Men''s lifestyle sneakers with Max Air cushioning', 12995.00, 15995.00, 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400', 100, 2, 4.5, 3200, TRUE),
('Levi''s 501 Original Jeans', 'Classic straight-fit jeans in dark indigo wash', 4999.00, 6999.00, 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400', 200, 2, 4.3, 1500, FALSE),
('Ray-Ban Aviator Classic', 'Iconic gold-frame aviator sunglasses with green lenses', 8490.00, 11990.00, 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400', 75, 2, 4.7, 900, FALSE),
('Modern Desk Lamp', 'Minimalist LED desk lamp with wireless charging base', 3499.00, 4999.00, 'https://images.unsplash.com/photo-1507473885765-e6ed057ab6fe?w=400', 120, 3, 4.4, 450, FALSE),
('Velvet Throw Pillow Set', 'Set of 4 luxury velvet cushion covers in earth tones', 1999.00, 2999.00, 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=400', 200, 3, 4.2, 380, FALSE),
('Atomic Habits', 'James Clear — An Easy & Proven Way to Build Good Habits', 499.00, 799.00, 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400', 500, 4, 4.9, 15000, TRUE),
('The Psychology of Money', 'Morgan Housel — Timeless lessons on wealth and happiness', 399.00, 599.00, 'https://images.unsplash.com/photo-1592496431122-2349e0fbc666?w=400', 400, 4, 4.8, 8900, FALSE),
('Yoga Mat Premium', 'Extra thick 8mm non-slip yoga mat with carrying strap', 1299.00, 1999.00, 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=400', 150, 5, 4.5, 670, FALSE);
