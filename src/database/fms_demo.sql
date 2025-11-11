-- =========================================================
-- Flight Management System (FMS)
-- =========================================================

-- INITIAL SETUP
-- Drop everything if exists (safe reset)
DROP SCHEMA IF EXISTS public CASCADE;
CREATE SCHEMA public;
GRANT ALL ON SCHEMA public TO public;

-- Create extension AFTER schema recreation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =========================================================
-- TABLE DEFINITIONS (DDL)
-- =========================================================

-- ROLES
CREATE TABLE role (
    role_id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL,
    description TEXT
);

-- USERS
CREATE TABLE app_user (
    user_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash TEXT,
    full_name VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    role_id INT REFERENCES role(role_id) ON DELETE RESTRICT,
    created_at TIMESTAMP DEFAULT now()
);

-- AIRPORTS
CREATE TABLE airport (
    airport_code CHAR(3) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    city VARCHAR(100),
    country VARCHAR(100)
);

-- ROUTE
CREATE TABLE route (
    route_id SERIAL PRIMARY KEY,
    origin CHAR(3) REFERENCES airport(airport_code),
    destination CHAR(3) REFERENCES airport(airport_code),
    CHECK (origin <> destination)
);

-- AIRCRAFT
CREATE TABLE aircraft (
    aircraft_id SERIAL PRIMARY KEY,
    registration VARCHAR(50) UNIQUE NOT NULL,
    model VARCHAR(100) NOT NULL,
    total_seats INT NOT NULL CHECK (total_seats > 0)
);

-- AIRCRAFT SEATS
CREATE TABLE aircraft_seat (
    seat_id SERIAL PRIMARY KEY,
    aircraft_id INT REFERENCES aircraft(aircraft_id) ON DELETE CASCADE,
    seat_label VARCHAR(5) NOT NULL,
    seat_class VARCHAR(20) NOT NULL,
    UNIQUE (aircraft_id, seat_label)
);

-- FLIGHT TEMPLATE
CREATE TABLE flight (
    flight_id SERIAL PRIMARY KEY,
    flight_number VARCHAR(10) UNIQUE NOT NULL,
    route_id INT REFERENCES route(route_id) ON DELETE CASCADE,
    carrier VARCHAR(50),
    status VARCHAR(20) DEFAULT 'active'
);

-- FLIGHT INSTANCE
CREATE TABLE flight_instance (
    instance_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    flight_id INT REFERENCES flight(flight_id) ON DELETE CASCADE,
    aircraft_id INT REFERENCES aircraft(aircraft_id) ON DELETE CASCADE,
    departure_time TIMESTAMPTZ NOT NULL,
    arrival_time TIMESTAMPTZ NOT NULL,
    status VARCHAR(20) DEFAULT 'scheduled',
    base_price NUMERIC(10,2) NOT NULL CHECK (base_price >= 0),
    CHECK (arrival_time > departure_time)
);

-- FARE CLASS
CREATE TABLE fare_class (
    fare_id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    refund_policy TEXT
);

-- BOOKING
CREATE TABLE booking (
    booking_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_code VARCHAR(10) UNIQUE NOT NULL,
    user_id UUID REFERENCES app_user(user_id),
    status VARCHAR(20) DEFAULT 'reserved',
    created_at TIMESTAMP DEFAULT now()
);

-- PASSENGER
CREATE TABLE passenger (
    passenger_id SERIAL PRIMARY KEY,
    booking_id UUID REFERENCES booking(booking_id) ON DELETE CASCADE,
    full_name VARCHAR(100) NOT NULL,
    dob DATE
);

-- TICKET
CREATE TABLE ticket (
    ticket_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    passenger_id INT REFERENCES passenger(passenger_id) ON DELETE CASCADE,
    instance_id UUID REFERENCES flight_instance(instance_id) ON DELETE CASCADE,
    fare_id INT REFERENCES fare_class(fare_id),
    seat_label VARCHAR(5),
    price NUMERIC(10,2),
    status VARCHAR(20) DEFAULT 'issued',
    UNIQUE (instance_id, seat_label)
);

-- PAYMENT
CREATE TABLE payment (
    payment_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id UUID REFERENCES booking(booking_id) ON DELETE CASCADE,
    amount NUMERIC(10,2) NOT NULL CHECK (amount >= 0),
    method VARCHAR(30),
    status VARCHAR(20) DEFAULT 'paid',
    processed_at TIMESTAMP DEFAULT now()
);

-- REFUND
CREATE TABLE refund (
    refund_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    payment_id UUID REFERENCES payment(payment_id) ON DELETE CASCADE,
    amount NUMERIC(10,2) NOT NULL CHECK (amount >= 0),
    reason TEXT,
    status VARCHAR(20) DEFAULT 'processed',
    processed_at TIMESTAMP DEFAULT now()
);

-- NOTIFICATION
CREATE TABLE notification (
    notification_id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES app_user(user_id),
    message TEXT,
    sent_at TIMESTAMP DEFAULT now()
);

-- =========================================================
-- SEED DATA (BASIC)
-- =========================================================

-- ROLES
INSERT INTO role(name, description) VALUES
('Owner','System Owner'),
('Admin','System Administrator'),
('Staff','Airline Staff'),
('Customer','Passenger Customer');

-- USERS
INSERT INTO app_user(email, password_hash, full_name, phone, role_id) VALUES
('owner@fms.com','hash','Nguyen Ngoc Minh Thu','0900000001',(SELECT role_id FROM role WHERE name='Owner')),
('admin@fms.com','hash','Cao Pham Tuan Minh','0900000002',(SELECT role_id FROM role WHERE name='Admin')),
('staff@fms.com','hash','Do Thanh Minh','0900000003',(SELECT role_id FROM role WHERE name='Staff')),
('customer@fms.com','hash','Chung Trieu Man','0900000004',(SELECT role_id FROM role WHERE name='Customer'));

-- AIRPORTS
INSERT INTO airport VALUES
('SGN','Tan Son Nhat','Ho Chi Minh','Vietnam'),
('HAN','Noi Bai','Hanoi','Vietnam'),
('DAD','Da Nang Intl','Da Nang','Vietnam');

-- ROUTES
INSERT INTO route(origin, destination) VALUES
('SGN','HAN'),
('HAN','DAD'),
('SGN','DAD');

-- AIRCRAFT
INSERT INTO aircraft(registration, model, total_seats) VALUES
('VN-A321','Airbus A321',180),
('VN-B737','Boeing 737-800',160);

-- SEATS (few samples)
INSERT INTO aircraft_seat(aircraft_id, seat_label, seat_class) VALUES
(1,'1A','Business'),(1,'1B','Business'),(1,'10A','Economy'),(1,'10B','Economy'),
(2,'1A','Business'),(2,'5A','Economy');

-- FLIGHTS
INSERT INTO flight(flight_number, route_id, carrier) VALUES
('VN101',1,'Vietnam Airlines'),
('VN202',2,'Vietnam Airlines');

-- FLIGHT INSTANCES
INSERT INTO flight_instance(flight_id, aircraft_id, departure_time, arrival_time, base_price)
VALUES
(1,1,'2025-11-12 08:00+07','2025-11-12 10:00+07',1500000),
(2,2,'2025-11-12 15:00+07','2025-11-12 16:20+07',1200000);

-- FARE CLASS
INSERT INTO fare_class(name, refund_policy) VALUES
('Economy Saver','No refund after 24h'),
('Business Flex','Full refund anytime');

-- BOOKING / PASSENGER / PAYMENT (sample)
INSERT INTO booking(booking_code, user_id, status)
VALUES ('PNR001',(SELECT user_id FROM app_user WHERE email='customer@fms.com'),'confirmed');

INSERT INTO passenger(booking_id, full_name, dob)
VALUES ((SELECT booking_id FROM booking WHERE booking_code='PNR001'),'Nguyen Van A','1999-01-01');

INSERT INTO ticket(passenger_id, instance_id, fare_id, seat_label, price)
VALUES (
 (SELECT passenger_id FROM passenger WHERE full_name='Nguyen Van A'),
 (SELECT instance_id FROM flight_instance LIMIT 1),
 (SELECT fare_id FROM fare_class WHERE name='Economy Saver'),
 '10A',1500000
);

INSERT INTO payment(booking_id, amount, method)
VALUES ((SELECT booking_id FROM booking WHERE booking_code='PNR001'),1500000,'Card');

-- =========================================================
-- SAMPLE QUERIES FOR TESTING
-- =========================================================

-- View all flights with routes and base prices
SELECT f.flight_number, a1.city AS origin, a2.city AS destination,
       fi.departure_time, fi.arrival_time, fi.base_price
FROM flight f
JOIN route r ON f.route_id = r.route_id
JOIN airport a1 ON r.origin = a1.airport_code
JOIN airport a2 ON r.destination = a2.airport_code
JOIN flight_instance fi ON fi.flight_id = f.flight_id;

-- Show available seats for a flight instance
SELECT s.seat_label, s.seat_class
FROM aircraft_seat s
JOIN flight_instance fi ON fi.aircraft_id = s.aircraft_id
LEFT JOIN ticket t ON t.instance_id = fi.instance_id AND t.seat_label = s.seat_label
WHERE fi.flight_id = 1 AND t.ticket_id IS NULL;

-- List all bookings and payments
SELECT b.booking_code, u.full_name AS customer, b.status, p.amount, p.method, p.processed_at
FROM booking b
JOIN app_user u ON b.user_id = u.user_id
LEFT JOIN payment p ON p.booking_id = b.booking_id;

-- Revenue by route (Owner analytics)
SELECT r.origin, r.destination, SUM(p.amount) AS total_revenue
FROM payment p
JOIN booking b ON p.booking_id = b.booking_id
JOIN passenger pa ON pa.booking_id = b.booking_id
JOIN ticket t ON t.passenger_id = pa.passenger_id
JOIN flight_instance fi ON fi.instance_id = t.instance_id
JOIN flight f ON f.flight_id = fi.flight_id
JOIN route r ON f.route_id = r.route_id
GROUP BY r.origin, r.destination;

-- Notifications (for testing)
INSERT INTO notification(user_id, message) VALUES
((SELECT user_id FROM app_user WHERE email='customer@fms.com'),
 'Your flight VN101 has been delayed 30 minutes.');
SELECT * FROM notification;

-- =========================================================
-- END OF FILE
-- =========================================================
