-- NLQ App Sample Database — Seed Data
-- Run: psql -U nlq_user -d nlq_db -f seed.sql

-- Sales Table
CREATE TABLE IF NOT EXISTS sales (
    id SERIAL PRIMARY KEY,
    product_name VARCHAR(100),
    category VARCHAR(50),
    region VARCHAR(50),
    sales_amount NUMERIC(12,2),
    quantity INTEGER,
    sale_date DATE,
    salesperson VARCHAR(100)
);

INSERT INTO sales (product_name, category, region, sales_amount, quantity, sale_date, salesperson) VALUES
('Laptop Pro', 'Electronics', 'North', 85000, 2, '2024-01-15', 'Alice'),
('Wireless Mouse', 'Accessories', 'South', 1500, 10, '2024-01-20', 'Bob'),
('Monitor 27"', 'Electronics', 'East', 32000, 3, '2024-02-05', 'Alice'),
('Keyboard', 'Accessories', 'West', 4500, 15, '2024-02-10', 'Charlie'),
('Laptop Pro', 'Electronics', 'South', 42500, 1, '2024-02-28', 'Bob'),
('Headphones', 'Accessories', 'North', 8000, 4, '2024-03-01', 'Alice'),
('Tablet X', 'Electronics', 'East', 25000, 2, '2024-03-15', 'Charlie'),
('Monitor 27"', 'Electronics', 'North', 64000, 6, '2024-04-02', 'Bob'),
('Laptop Pro', 'Electronics', 'West', 127500, 3, '2024-04-20', 'Alice'),
('Wireless Mouse', 'Accessories', 'East', 3000, 20, '2024-05-01', 'Charlie'),
('Tablet X', 'Electronics', 'South', 12500, 1, '2024-05-18', 'Bob'),
('Headphones', 'Accessories', 'West', 16000, 8, '2024-06-05', 'Alice'),
('Keyboard', 'Accessories', 'North', 9000, 30, '2024-06-22', 'Charlie'),
('Laptop Pro', 'Electronics', 'East', 85000, 2, '2024-07-10', 'Bob'),
('Monitor 27"', 'Electronics', 'South', 48000, 4, '2024-07-30', 'Alice');

-- Customers Table
CREATE TABLE IF NOT EXISTS customers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    email VARCHAR(150),
    country VARCHAR(50),
    segment VARCHAR(50),
    total_orders INTEGER,
    total_spent NUMERIC(12,2),
    joined_date DATE
);

INSERT INTO customers (name, email, country, segment, total_orders, total_spent, joined_date) VALUES
('Rahul Sharma', 'rahul@example.com', 'India', 'Premium', 15, 125000, '2022-03-01'),
('Emily Johnson', 'emily@example.com', 'USA', 'Standard', 8, 45000, '2023-01-15'),
('Liu Wei', 'liu@example.com', 'China', 'Premium', 22, 210000, '2021-07-20'),
('Maria Garcia', 'maria@example.com', 'Spain', 'Standard', 5, 18000, '2023-06-10'),
('John Smith', 'john@example.com', 'UK', 'Enterprise', 45, 480000, '2020-11-05'),
('Priya Nair', 'priya@example.com', 'India', 'Standard', 3, 12000, '2024-01-02'),
('Carlos Ruiz', 'carlos@example.com', 'Mexico', 'Premium', 18, 160000, '2022-08-14'),
('Sophie Laurent', 'sophie@example.com', 'France', 'Enterprise', 30, 320000, '2021-04-25');

-- Products Table
CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    category VARCHAR(50),
    price NUMERIC(10,2),
    stock_quantity INTEGER,
    rating NUMERIC(3,1),
    launch_date DATE
);

INSERT INTO products (name, category, price, stock_quantity, rating, launch_date) VALUES
('Laptop Pro', 'Electronics', 42500, 50, 4.7, '2023-01-10'),
('Wireless Mouse', 'Accessories', 150, 500, 4.2, '2022-06-01'),
('Monitor 27"', 'Electronics', 16000, 30, 4.5, '2023-03-15'),
('Keyboard', 'Accessories', 300, 800, 4.0, '2022-01-20'),
('Headphones', 'Accessories', 2000, 200, 4.6, '2023-07-01'),
('Tablet X', 'Electronics', 12500, 80, 4.3, '2023-09-05'),
('Webcam HD', 'Accessories', 1200, 150, 4.1, '2022-11-10'),
('SSD 1TB', 'Storage', 5500, 300, 4.8, '2023-02-28');
