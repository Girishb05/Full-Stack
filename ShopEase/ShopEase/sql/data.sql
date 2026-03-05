-- =============================================
-- ShopEase Expanded Sample Data
-- 10+ Products per Category
-- =============================================

USE shopease;

-- Clear existing sample products to avoid duplicates
DELETE FROM products WHERE id > 0;
ALTER TABLE products AUTO_INCREMENT = 1;

-- ─── 1. Electronics (Category ID: 1) ───
INSERT INTO products (name, description, price, original_price, image_url, stock, category_id, rating, review_count, featured) VALUES
('iPhone 15 Pro Max', 'Titanium finish, A17 Pro chip, 256GB', 134900.00, 149900.00, 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?q=80&w=800&auto=format&fit=crop', 25, 1, 4.8, 1240, TRUE),
('Samsung Galaxy S24 Ultra', 'AI features, S Pen, 512GB', 129999.00, 144999.00, 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?q=80&w=800&auto=format&fit=crop', 30, 1, 4.7, 890, TRUE),
('MacBook Air M3', '15-inch display, 16GB RAM, 512GB SSD', 149900.00, 169900.00, 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=800&auto=format&fit=crop', 15, 1, 4.9, 650, TRUE),
('Sony WH-1000XM5', 'Industry-leading noise cancellation', 29990.00, 34990.00, 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?q=80&w=800&auto=format&fit=crop', 50, 1, 4.6, 2100, FALSE),
('Dell XPS 15', 'InfinityEdge display, i9, 32GB RAM', 189900.00, 210000.00, 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?q=80&w=800&auto=format&fit=crop', 10, 1, 4.5, 320, FALSE),
('iPad Pro M2', '12.9-inch Liquid Retina XDR, 256GB', 112900.00, 119900.00, 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?q=80&w=800&auto=format&fit=crop', 20, 1, 4.8, 540, TRUE),
('Apple Watch Series 9', 'Advanced health features, Always-On Retina display', 41900.00, 45900.00, 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?q=80&w=800&auto=format&fit=crop', 40, 1, 4.7, 1100, FALSE),
('Bose QuietComfort Ultra', 'Immersive audio, world-class quiet', 35900.00, 39900.00, 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=800&auto=format&fit=crop', 35, 1, 4.6, 780, FALSE),
('Nintendo Switch OLED', 'Vibrant 7-inch OLED screen, 64GB', 32900.00, 37900.00, 'https://images.unsplash.com/photo-1578303372764-2e4c7a363d6b?q=80&w=800&auto=format&fit=crop', 60, 1, 4.9, 3200, TRUE),
('GoPro HERO12 Black', 'HDR Video, 5.3K60 Resolution', 39900.00, 44900.00, 'https://images.unsplash.com/photo-1565538810643-b5bdb714032a?q=80&w=800&auto=format&fit=crop', 25, 1, 4.4, 450, FALSE),
('Kindle Paperwhite', 'Warm light, 6.8-inch display, 8GB', 13999.00, 15999.00, 'https://images.unsplash.com/photo-1592434134753-a70baf7979d7?q=80&w=800&auto=format&fit=crop', 100, 1, 4.7, 5600, FALSE),
('Canon EOS R6 Mark II', 'Full-frame mirrorless, 24.2 MP', 229900.00, 243900.00, 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=800&auto=format&fit=crop', 5, 1, 4.9, 120, FALSE);

-- ─── 2. Fashion (Category ID: 2) ───
INSERT INTO products (name, description, price, original_price, image_url, stock, category_id, rating, review_count, featured) VALUES
('Nike Air Max 270', 'Legendary Air cushioning, sleek design', 12995.00, 15995.00, 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=800&auto=format&fit=crop', 100, 2, 4.5, 3200, TRUE),
('Levi\'s 501 Original', 'Straight-fit denim, iconic copper hardware', 4999.00, 6999.00, 'https://images.unsplash.com/photo-1542272604-787c3835535d?q=80&w=800&auto=format&fit=crop', 200, 2, 4.3, 1500, FALSE),
('Ray-Ban Aviator', 'Classic gold frame, green lenses', 8490.00, 11990.00, 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?q=80&w=800&auto=format&fit=crop', 75, 2, 4.7, 900, FALSE),
('Adidas Ultraboost Light', 'Maximum energy return, Primeknit upper', 16999.00, 19999.00, 'https://images.unsplash.com/photo-1587563871167-1ee9c731aefb?q=80&w=800&auto=format&fit=crop', 50, 2, 4.8, 2100, TRUE),
('Zara Oversized Blazer', 'Premium wool blend, structured shoulders', 7990.00, 9990.00, 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=800&auto=format&fit=crop', 30, 2, 4.4, 250, FALSE),
('Tommy Hilfiger Polo', 'Organic cotton pique, slim fit', 3999.00, 5499.00, 'https://images.unsplash.com/photo-1581655353564-df123a1eb820?q=80&w=800&auto=format&fit=crop', 150, 2, 4.5, 680, FALSE),
('Puma Suede Classic', 'Vintage style, breathable upper', 5999.00, 7999.00, 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?q=80&w=800&auto=format&fit=crop', 80, 2, 4.6, 1200, FALSE),
('Gucci Double G Belt', 'Leather belt with gold brass hardware', 45000.00, 52000.00, 'https://images.unsplash.com/photo-1624231454019-38933cc54497?q=80&w=800&auto=format&fit=crop', 10, 2, 4.9, 150, TRUE),
('North Face Nuptse', '700-fill down insulation, stowable hood', 24900.00, 29900.00, 'https://images.unsplash.com/photo-1605518216938-7c31b7b14ad0?q=80&w=800&auto=format&fit=crop', 20, 2, 4.8, 430, FALSE),
('Fossil Heritage', 'Stainless steel chronograph, 42mm', 14495.00, 17495.00, 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?q=80&w=800&auto=format&fit=crop', 40, 2, 4.5, 320, FALSE);

-- ─── 3. Home & Living (Category ID: 3) ───
INSERT INTO products (name, description, price, original_price, image_url, stock, category_id, rating, review_count, featured) VALUES
('Modern Desk Lamp', 'LED with wireless charging base', 3499.00, 4999.00, 'https://images.unsplash.com/photo-1507473885765-e6ed057ab6fe?q=80&w=800&auto=format&fit=crop', 120, 3, 4.4, 450, FALSE),
('Velvet Throw Pillow Set', 'Set of 4 luxury cushion covers', 1999.00, 2999.00, 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?q=80&w=800&auto=format&fit=crop', 200, 3, 4.2, 380, FALSE),
('Dyson V15 Detect', 'Laser-guided cordless vacuum', 65900.00, 72900.00, 'https://images.unsplash.com/photo-1558317374-067fb5f30001?q=80&w=800&auto=format&fit=crop', 15, 3, 4.9, 1200, TRUE),
('Keurig K-Elite', 'Single serve coffee maker, brushed gold', 18900.00, 21900.00, 'https://images.unsplash.com/photo-1520970014086-2208d157c9e2?q=80&w=800&auto=format&fit=crop', 40, 3, 4.6, 850, FALSE),
('Philips Hue Starter Kit', '3 smart bulbs + bridge', 14999.00, 17999.00, 'https://images.unsplash.com/photo-1550985543-f47f38aee65e?q=80&w=800&auto=format&fit=crop', 60, 3, 4.7, 560, FALSE),
('Herman Miller Aeron', 'Ergonomic office chair, size B', 125000.00, 145000.00, 'https://images.unsplash.com/photo-1505797149-43b00fe9ee00?q=80&w=800&auto=format&fit=crop', 10, 3, 4.9, 320, TRUE),
('Casper Original Mattress', 'Memory foam with cooling technology', 85000.00, 99000.00, 'https://images.unsplash.com/photo-1505693357370-58c31c93a137?q=80&w=800&auto=format&fit=crop', 25, 3, 4.8, 4100, FALSE),
('Le Creuset Dutch Oven', 'Enameled cast iron, 5.5 qt', 32000.00, 38000.00, 'https://images.unsplash.com/photo-1591589330101-7ba0eb507cd5?q=80&w=800&auto=format&fit=crop', 30, 3, 4.9, 900, TRUE),
('Nest Learning Thermostat', 'Automatic temperature control', 24900.00, 28900.00, 'https://images.unsplash.com/photo-1534073828943-f801091bb18c?q=80&w=800&auto=format&fit=crop', 50, 3, 4.5, 1500, FALSE),
('iRobot Roomba j7+', 'Self-emptying robot vacuum', 74900.00, 89900.00, 'https://images.unsplash.com/photo-1518640467707-6811f4a6ab73?q=80&w=800&auto=format&fit=crop', 20, 3, 4.7, 640, FALSE);

-- ─── 4. Books (Category ID: 4) ───
INSERT INTO products (name, description, price, original_price, image_url, stock, category_id, rating, review_count, featured) VALUES
('Atomic Habits', 'James Clear — Proven way to build good habits', 499.00, 799.00, 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=800&auto=format&fit=crop', 500, 4, 4.9, 15000, TRUE),
('The Psychology of Money', 'Morgan Housel — Timeless lessons on wealth', 399.00, 599.00, 'https://images.unsplash.com/photo-1592496431122-2349e0fbc666?q=80&w=800&auto=format&fit=crop', 400, 4, 4.8, 8900, FALSE),
('Clean Code', 'Robert C. Martin — A handbook of agile software', 2499.00, 3299.00, 'https://images.unsplash.com/photo-1532012197367-2d5970d7758d?q=80&w=800&auto=format&fit=crop', 100, 4, 4.9, 4500, TRUE),
('Sapiens', 'Yuval Noah Harari — A brief history of humankind', 549.00, 899.00, 'https://images.unsplash.com/photo-1553729459-efe14ef6055d?q=80&w=800&auto=format&fit=crop', 300, 4, 4.8, 12000, FALSE),
('Thinking, Fast and Slow', 'Daniel Kahneman — Insights on cognition', 649.00, 999.00, 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?q=80&w=800&auto=format&fit=crop', 250, 4, 4.7, 7800, FALSE),
('The Alchemist', 'Paulo Coelho — A magical story about following dreams', 299.00, 499.00, 'https://images.unsplash.com/photo-1543004218-ee14110497f9?q=80&w=800&auto=format&fit=crop', 450, 4, 4.9, 21000, TRUE),
('Deep Work', 'Cal Newport — Rules for focused success', 599.00, 899.00, 'https://images.unsplash.com/photo-1550399105-c4db5fb85c18?q=80&w=800&auto=format&fit=crop', 200, 4, 4.8, 5400, FALSE),
('Zero to One', 'Peter Thiel — Notes on startups', 449.00, 699.00, 'https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=800&auto=format&fit=crop', 150, 4, 4.7, 6200, FALSE),
('The Lean Startup', 'Eric Ries — Constant innovation', 599.00, 999.00, 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=800&auto=format&fit=crop', 180, 4, 4.6, 4800, FALSE),
('Design Patterns', 'Gang of Four — Elements of reusable software', 3900.00, 4500.00, 'https://images.unsplash.com/photo-1589998059171-988d887df646?q=80&w=800&auto=format&fit=crop', 50, 4, 4.9, 1200, TRUE);

-- ─── 5. Sports (Category ID: 5) ───
INSERT INTO products (name, description, price, original_price, image_url, stock, category_id, rating, review_count, featured) VALUES
('Yoga Mat Premium', '8mm non-slip with carrying strap', 1299.00, 1999.00, 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?q=80&w=800&auto=format&fit=crop', 150, 5, 4.5, 670, FALSE),
('Wilson Evolution', 'Official game basketball, micro-fiber cover', 4999.00, 6499.00, 'https://images.unsplash.com/photo-1519861531473-9200262188bf?q=80&w=800&auto=format&fit=crop', 100, 5, 4.8, 1200, TRUE),
('Fitbit Charge 6', 'Health & fitness tracker with Google apps', 14999.00, 17999.00, 'https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?q=80&w=800&auto=format&fit=crop', 80, 5, 4.6, 2100, FALSE),
('Garmin Forerunner 255', 'Premium GPS running smartwatch', 32900.00, 38900.00, 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=800&auto=format&fit=crop', 30, 5, 4.8, 890, TRUE),
('Bowflex SelectTech', 'Adjustable dumbbells (pair), 5-52.5 lbs', 45000.00, 55000.00, 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?q=80&w=800&auto=format&fit=crop', 20, 5, 4.9, 6500, TRUE),
('Hydro Flask 32oz', 'Vacuum insulated stainless steel bottle', 4999.00, 6999.00, 'https://images.unsplash.com/photo-1602143302703-f75d775c23d2?q=80&w=800&auto=format&fit=crop', 200, 5, 4.7, 12000, FALSE),
('TRX All-in-One', 'Suspension training system', 18900.00, 24900.00, 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=800&auto=format&fit=crop', 40, 5, 4.8, 320, FALSE),
('Speedo Vanquisher', 'Mirrored swimming goggles, UV protection', 1999.00, 2999.00, 'https://images.unsplash.com/photo-1530549387631-fbb129c1525a?q=80&w=800&auto=format&fit=crop', 150, 5, 4.5, 2400, FALSE),
('Callaway Strata Set', 'Complete 12-piece golf club set with bag', 48000.00, 55000.00, 'https://images.unsplash.com/photo-1535131749006-b7f58c99034b?q=80&w=800&auto=format&fit=crop', 15, 5, 4.7, 180, TRUE),
('Coleman 4-Person Tent', 'Instant setup, dark room technology', 14900.00, 19900.00, 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?q=80&w=800&auto=format&fit=crop', 25, 5, 4.6, 1100, FALSE);
