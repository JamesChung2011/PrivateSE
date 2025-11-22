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
    avatar_url TEXT, -- Added for frontend consistency
    is_active BOOLEAN DEFAULT true, -- Added for soft deletes
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
    status VARCHAR(20) DEFAULT 'On Time', -- Updated to match Frontend (Capitalized)
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
    status VARCHAR(20) DEFAULT 'Pending', -- Updated to match Frontend (Capitalized)
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
    status VARCHAR(20) DEFAULT 'Issued',
    UNIQUE (instance_id, seat_label)
);

-- PAYMENT
CREATE TABLE payment (
    payment_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id UUID REFERENCES booking(booking_id) ON DELETE CASCADE,
    amount NUMERIC(10,2) NOT NULL CHECK (amount >= 0),
    method VARCHAR(30), -- e.g., 'Card', 'PayPal'
    transaction_ref VARCHAR(100), -- Added for security (don't store card details)
    status VARCHAR(20) DEFAULT 'Paid',
    processed_at TIMESTAMP DEFAULT now()
);

-- REFUND
CREATE TABLE refund (
    refund_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    payment_id UUID REFERENCES payment(payment_id) ON DELETE CASCADE,
    amount NUMERIC(10,2) NOT NULL CHECK (amount >= 0),
    reason TEXT,
    status VARCHAR(20) DEFAULT 'Processed',
    processed_at TIMESTAMP DEFAULT now()
);

-- NOTIFICATION
CREATE TABLE notification (
    notification_id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES app_user(user_id),
    message TEXT,
    is_read BOOLEAN DEFAULT false,
    sent_at TIMESTAMP DEFAULT now()
);

-- STAFF SCHEDULE (New Table)
CREATE TABLE staff_schedule (
    schedule_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES app_user(user_id) ON DELETE CASCADE,
    shift_start TIMESTAMPTZ NOT NULL,
    shift_end TIMESTAMPTZ NOT NULL,
    role VARCHAR(50), -- e.g., 'Gate Agent', 'Ground Handler'
    status VARCHAR(20) DEFAULT 'Scheduled', -- 'Scheduled', 'On Duty', 'Off'
    CHECK (shift_end > shift_start)
);

-- EXPENSES (New Table for Profit Calculation)
CREATE TABLE expenses (
    expense_id SERIAL PRIMARY KEY,
    category VARCHAR(50) NOT NULL, -- 'Fuel', 'Maintenance', 'Salary'
    amount NUMERIC(10, 2) NOT NULL,
    description TEXT,
    recorded_at TIMESTAMP DEFAULT now()
);

-- =========================================================
-- SEED DATA (BASIC)
-- =========================================================

-- ROLES (Lowercase to match frontend keys)
INSERT INTO role(name, description) VALUES
('owner','System Owner'),
('admin','System Administrator'),
('staff','Airline Staff'),
('customer','Passenger Customer');

-- USERS
INSERT INTO app_user(email, password_hash, full_name, phone, role_id, avatar_url) VALUES
('owner@fms.com','hash','Nguyen Ngoc Minh Thu','0900000001',(SELECT role_id FROM role WHERE name='owner'), 'https://api.dicebear.com/7.x/avataaars/svg?seed=owner'),
('admin@fms.com','hash','Cao Pham Tuan Minh','0900000002',(SELECT role_id FROM role WHERE name='admin'), 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin'),
('staff@fms.com','hash','Do Thanh Minh','0900000003',(SELECT role_id FROM role WHERE name='staff'), 'https://api.dicebear.com/7.x/avataaars/svg?seed=staff'),
('customer@fms.com','hash','Chung Trieu Man','0900000004',(SELECT role_id FROM role WHERE name='customer'), 'https://api.dicebear.com/7.x/avataaars/svg?seed=customer');

-- AIRPORTS
INSERT INTO airport VALUES
('SGN','Tan Son Nhat','Ho Chi Minh','Vietnam'),
('HAN','Noi Bai','Hanoi','Vietnam'),
('DAD','Da Nang Intl','Da Nang','Vietnam'),
('LAX','Los Angeles Intl','Los Angeles','USA'),
('NYC','JFK Intl','New York','USA');

-- ROUTES
INSERT INTO route(origin, destination) VALUES
('SGN','HAN'),
('HAN','DAD'),
('SGN','DAD'),
('NYC','LAX');

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
('VN202',2,'Vietnam Airlines'),
('FL001',4,'FlightHub Air');

-- FLIGHT INSTANCES
INSERT INTO flight_instance(flight_id, aircraft_id, departure_time, arrival_time, base_price, status)
VALUES
(1,1,'2025-11-12 08:00+07','2025-11-12 10:00+07',1500000, 'On Time'),
(2,2,'2025-11-12 15:00+07','2025-11-12 16:20+07',1200000, 'Delayed'),
(3,2,'2025-02-15 08:00+07','2025-02-15 11:30+07',245, 'On Time');

-- FARE CLASS
INSERT INTO fare_class(name, refund_policy) VALUES
('Economy Saver','No refund after 24h'),
('Business Flex','Full refund anytime');

-- BOOKING / PASSENGER / PAYMENT (sample)
INSERT INTO booking(booking_code, user_id, status)
VALUES ('PNR001',(SELECT user_id FROM app_user WHERE email='customer@fms.com'),'Confirmed');

INSERT INTO passenger(booking_id, full_name, dob)
VALUES ((SELECT booking_id FROM booking WHERE booking_code='PNR001'),'Nguyen Van A','1999-01-01');

INSERT INTO ticket(passenger_id, instance_id, fare_id, seat_label, price)
VALUES (
 (SELECT passenger_id FROM passenger WHERE full_name='Nguyen Van A'),
 (SELECT instance_id FROM flight_instance LIMIT 1),
 (SELECT fare_id FROM fare_class WHERE name='Economy Saver'),
 '10A',1500000
);

INSERT INTO payment(booking_id, amount, method, transaction_ref)
VALUES ((SELECT booking_id FROM booking WHERE booking_code='PNR001'),1500000,'Card', 'TXN-12345');

-- STAFF SCHEDULE SAMPLE
INSERT INTO staff_schedule(user_id, shift_start, shift_end, role, status)
VALUES 
((SELECT user_id FROM app_user WHERE email='staff@fms.com'), '2025-11-12 06:00+07', '2025-11-12 14:00+07', 'Ground Handler', 'Scheduled');

-- EXPENSES SAMPLE
INSERT INTO expenses(category, amount, description) 
VALUES ('Fuel', 5000000, 'Fuel for flight VN101');

-- =========================================================
-- END OF FILE
-- =========================================================