-- Run these commands in your MySQL console to update the orders table
USE shopease;

ALTER TABLE orders 
MODIFY COLUMN status ENUM('PENDING', 'CONFIRMED', 'SHIPPED', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED') DEFAULT 'PENDING';

ALTER TABLE orders 
ADD COLUMN shipping_charges DECIMAL(10, 2) DEFAULT 50.00,
ADD COLUMN expected_delivery_date TIMESTAMP NULL;

-- Optional: Update existing orders with a default delivery date (5 days after creation)
UPDATE orders 
SET expected_delivery_date = DATE_ADD(created_at, INTERVAL 5 DAY)
WHERE expected_delivery_date IS NULL;
