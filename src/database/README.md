# Flight Management System (FMS) - Database Setup
---
## PostgreSQL
Download PostgreSQL: https://www.postgresql.org/download/

Tham khảo: 
- Cài đặt: https://www.youtube.com/watch?v=IcJvVUln-KY&t
- Sử dụng pgAdmin: https://www.youtube.com/watch?v=WFT5MaZN6g4&t
- **Lưu ý**: Nếu không connect được thì Win + R mở services.msc và khởi động dịch vụ của Postgre.



## Database

### Các bảng
- **role** - Vai trò (Owner, Admin, Staff, Customer)
- **app_user** - Người dùng
- **airport** - Sân bay (SGN, HAN, DAD)
- **route** - Lộ trình
- **aircraft** - Chi tiết máy bay
- **aircraft_seat** - Sơ đồ ghế ngồi
- **flight** - Danh sách chuyến bay
- **flight_instance** - Chi tiết chuyến bay
- **booking** - Danh sách đặt vé
- **passenger** - Thông tin khách hàng
- **ticket** - Thông tin vé
- **fare_class** - Loại vé (Economy Saver, Business Flex)
- **payment** - Các giao dịch
- **refund** - Lịch sử hoàn tiền
- **notification** - Thông báo cho người dùng

---

## Mẫu login

| Role     | Email              | Password | Name                  |
|----------|--------------------|----------|-----------------------|
| Owner    | owner@fms.com      | hash     | Nguyen Ngoc Minh Thu  |
| Admin    | admin@fms.com      | hash     | Cao Pham Tuan Minh    |
| Staff    | staff@fms.com      | hash     | Do Thanh Minh         |
| Customer | customer@fms.com   | hash     | Chung Trieu Man       |


---

## Tác vụ cơ bản (có comment trong file SQL)

### Viewing Data
```sql
-- See all flights
SELECT * FROM flight;

-- See flight schedules with details
SELECT f.flight_number, a1.city AS origin, a2.city AS destination,
       fi.departure_time, fi.arrival_time, fi.base_price
FROM flight f
JOIN route r ON f.route_id = r.route_id
JOIN airport a1 ON r.origin = a1.airport_code
JOIN airport a2 ON r.destination = a2.airport_code
JOIN flight_instance fi ON fi.flight_id = f.flight_id;
```

### Adding New Data
```sql
-- Add a new airport
INSERT INTO airport VALUES ('BMV', 'Buon Ma Thuot', 'Buon Ma Thuot', 'Vietnam');

-- Add a new flight route
INSERT INTO route(origin, destination) VALUES ('SGN', 'BMV');
```

### Updating Data
```sql
-- Change flight status
UPDATE flight_instance 
SET status = 'delayed' 
WHERE instance_id = 'YOUR_INSTANCE_ID_HERE';
```

### Deleting Data
```sql
-- Cancel a booking
UPDATE booking 
SET status = 'cancelled' 
WHERE booking_code = 'PNR001';
```

---

## Testing đơn giản

### Check Available Seats
```sql
SELECT s.seat_label, s.seat_class
FROM aircraft_seat s
JOIN flight_instance fi ON fi.aircraft_id = s.aircraft_id
LEFT JOIN ticket t ON t.instance_id = fi.instance_id AND t.seat_label = s.seat_label
WHERE fi.flight_id = 1 AND t.ticket_id IS NULL;
```

### View All Bookings
```sql
SELECT b.booking_code, u.full_name AS customer, b.status, 
       p.amount, p.method, p.processed_at
FROM booking b
JOIN app_user u ON b.user_id = u.user_id
LEFT JOIN payment p ON p.booking_id = b.booking_id;
```

### Calculate Revenue by Route
```sql
SELECT r.origin, r.destination, SUM(p.amount) AS total_revenue
FROM payment p
JOIN booking b ON p.booking_id = b.booking_id
JOIN passenger pa ON pa.booking_id = b.booking_id
JOIN ticket t ON t.passenger_id = pa.passenger_id
JOIN flight_instance fi ON fi.instance_id = t.instance_id
JOIN flight f ON f.flight_id = fi.flight_id
JOIN route r ON f.route_id = r.route_id
GROUP BY r.origin, r.destination;
```