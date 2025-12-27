import { PrismaClient } from '@prisma/client'
import { addDays, addHours } from 'date-fns'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('Starting database seed...')
  const hashedPassword = await bcrypt.hash('password123', 10)

  // 1. Roles
  console.log('Creating roles...')
  const customerRole = await prisma.role.upsert({
    where: { name: 'customer' },
    update: {},
    create: { name: 'customer', description: 'Customer role' }
  })
  const ownerRole = await prisma.role.upsert({
    where: { name: 'owner' },
    update: {},
    create: { name: 'owner', description: 'Owner role' }
  })
  const staffRole = await prisma.role.upsert({
    where: { name: 'staff' },
    update: {},
    create: { name: 'staff', description: 'Staff role' }
  })
  const adminRole = await prisma.role.upsert({
    where: { name: 'admin' },
    update: {},
    create: { name: 'admin', description: 'Admin role' }
  })

  // 2. Users
  console.log('Creating users...')
  const owner = await prisma.app_user.upsert({
    where: { email: 'john@flightmgmt.com' },
    update: {},
    create: {
      email: 'john@flightmgmt.com',
      full_name: 'John Doe',
      password_hash: hashedPassword,
      phone: '555-0101',
      role_id: ownerRole.role_id,
      is_active: true
    }
  })

  const staff = await prisma.app_user.upsert({
    where: { email: 'jane@flightmgmt.com' },
    update: {},
    create: {
      email: 'jane@flightmgmt.com',
      full_name: 'Jane Smith',
      password_hash: hashedPassword,
      phone: '555-0102',
      role_id: staffRole.role_id,
      is_active: true
    }
  })

  const admin = await prisma.app_user.upsert({
    where: { email: 'admin@flightmgmt.com' },
    update: {},
    create: {
      email: 'admin@flightmgmt.com',
      full_name: 'Admin User',
      password_hash: hashedPassword,
      phone: '555-0103',
      role_id: adminRole.role_id,
      is_active: true
    }
  })

  const customer = await prisma.app_user.upsert({
    where: { email: 'mike@customer.com' },
    update: {},
    create: {
      email: 'mike@customer.com',
      full_name: 'Mike Johnson',
      password_hash: hashedPassword,
      phone: '555-0104',
      role_id: customerRole.role_id,
      is_active: true
    }
  })

  // 3. Airports
  console.log('Creating airports...')
  const airports = [
    { code: 'JFK', name: 'John F. Kennedy International Airport', city: 'New York', country: 'USA' },
    { code: 'LAX', name: 'Los Angeles International Airport', city: 'Los Angeles', country: 'USA' },
    { code: 'ORD', name: "O'Hare International Airport", city: 'Chicago', country: 'USA' },
    { code: 'DFW', name: 'Dallas/Fort Worth International Airport', city: 'Dallas', country: 'USA' },
    { code: 'SFO', name: 'San Francisco International Airport', city: 'San Francisco', country: 'USA' },
    { code: 'MIA', name: 'Miami International Airport', city: 'Miami', country: 'USA' },
    { code: 'LHR', name: 'London Heathrow Airport', city: 'London', country: 'UK' },
    { code: 'CDG', name: 'Charles de Gaulle Airport', city: 'Paris', country: 'France' },
    { code: 'NRT', name: 'Narita International Airport', city: 'Tokyo', country: 'Japan' },
    { code: 'SIN', name: 'Singapore Changi Airport', city: 'Singapore', country: 'Singapore' },
  ]

  for (const airport of airports) {
    await prisma.airport.upsert({
      where: { airport_code: airport.code },
      update: {},
      create: {
        airport_code: airport.code,
        name: airport.name,
        city: airport.city,
        country: airport.country
      }
    })
  }

  // 4. Aircraft
  console.log('Creating aircraft...')
  const aircraft1 = await prisma.aircraft.upsert({
    where: { registration: 'N12345' },
    update: {},
    create: {
      registration: 'N12345',
      model: 'Boeing 737-800',
      total_seats: 189
    }
  })

  const aircraft2 = await prisma.aircraft.upsert({
    where: { registration: 'N67890' },
    update: {},
    create: {
      registration: 'N67890',
      model: 'Airbus A320',
      total_seats: 180
    }
  })

  const aircraft3 = await prisma.aircraft.upsert({
    where: { registration: 'N24680' },
    update: {},
    create: {
      registration: 'N24680',
      model: 'Boeing 787 Dreamliner',
      total_seats: 242
    }
  })

  // 5. Aircraft Seats
  console.log('Creating aircraft seats...')
  const seatClasses = [
    { class: 'First Class', rows: 2, seatsPerRow: 4, aircraftId: aircraft1.aircraft_id },
    { class: 'Business', rows: 4, seatsPerRow: 6, aircraftId: aircraft1.aircraft_id },
    { class: 'Economy', rows: 25, seatsPerRow: 6, aircraftId: aircraft1.aircraft_id },
  ]

  for (const config of seatClasses) {
    const seatLetters = ['A', 'B', 'C', 'D', 'E', 'F'].slice(0, config.seatsPerRow)
    let startRow = config.class === 'First Class' ? 1 : config.class === 'Business' ? 3 : 7
    
    for (let row = 0; row < config.rows; row++) {
      for (const letter of seatLetters) {
        const seatLabel = `${startRow + row}${letter}`
        await prisma.aircraft_seat.upsert({
          where: {
            aircraft_id_seat_label: {
              aircraft_id: config.aircraftId,
              seat_label: seatLabel
            }
          },
          update: {},
          create: {
            aircraft_id: config.aircraftId,
            seat_label: seatLabel,
            seat_class: config.class
          }
        })
      }
    }
  }

  // 6. Routes
  console.log('Creating routes...')
  const routeData = [
    { origin: 'JFK', destination: 'LAX' },
    { origin: 'LAX', destination: 'JFK' },
    { origin: 'ORD', destination: 'MIA' },
    { origin: 'SFO', destination: 'JFK' },
    { origin: 'JFK', destination: 'LHR' },
    { origin: 'LAX', destination: 'NRT' },
    { origin: 'SFO', destination: 'SIN' },
  ]

  const routes = []
  for (const route of routeData) {
    const r = await prisma.route.create({
      data: {
        origin: route.origin,
        destination: route.destination
      }
    })
    routes.push(r)
  }

  // 7. Flights
  console.log('Creating flights...')
  const flights = [
    { flightNumber: 'AA100', routeId: routes[0].route_id, carrier: 'American Airlines' },
    { flightNumber: 'UA200', routeId: routes[1].route_id, carrier: 'United Airlines' },
    { flightNumber: 'DL300', routeId: routes[2].route_id, carrier: 'Delta Air Lines' },
    { flightNumber: 'AA400', routeId: routes[3].route_id, carrier: 'American Airlines' },
    { flightNumber: 'BA500', routeId: routes[4].route_id, carrier: 'British Airways' },
    { flightNumber: 'UA600', routeId: routes[5].route_id, carrier: 'United Airlines' },
    { flightNumber: 'SQ700', routeId: routes[6].route_id, carrier: 'Singapore Airlines' },
  ]

  const createdFlights = []
  for (const flight of flights) {
    const f = await prisma.flight.upsert({
      where: { flight_number: flight.flightNumber },
      update: {},
      create: {
        flight_number: flight.flightNumber,
        route_id: flight.routeId,
        carrier: flight.carrier,
        status: 'active'
      }
    })
    createdFlights.push(f)
  }

  // 8. Flight Instances (upcoming flights)
  console.log('Creating flight instances...')
  const baseDate = new Date()
  const aircraftList = [aircraft1.aircraft_id, aircraft2.aircraft_id, aircraft3.aircraft_id]
  
  for (let i = 0; i < createdFlights.length; i++) {
    const flight = createdFlights[i]
    // Create 5 instances for each flight over next 10 days
    for (let j = 1; j <= 5; j++) {
      const departureTime = addDays(addHours(baseDate, 8 + (i * 2)), j)
      const arrivalTime = addHours(departureTime, 5 + (i % 3))
      
      await prisma.flight_instance.create({
        data: {
          flight_id: flight.flight_id,
          aircraft_id: aircraftList[i % 3],
          departure_time: departureTime,
          arrival_time: arrivalTime,
          status: 'On Time',
          base_price: 150 + (i * 50) + (j * 20)
        }
      })
    }
  }

  // 9. Fare Classes
  console.log('Creating fare classes...')
  await prisma.fare_class.upsert({
    where: { fare_id: 1 },
    update: {},
    create: {
      name: 'Economy',
      refund_policy: 'Non-refundable. Changes allowed with fee.'
    }
  })
  await prisma.fare_class.upsert({
    where: { fare_id: 2 },
    update: {},
    create: {
      name: 'Business',
      refund_policy: 'Refundable. Free changes allowed.'
    }
  })
  await prisma.fare_class.upsert({
    where: { fare_id: 3 },
    update: {},
    create: {
      name: 'First Class',
      refund_policy: 'Fully refundable. Unlimited changes.'
    }
  })

  // 10. Sample Booking
  console.log('Creating sample bookings...')
  const instances = await prisma.flight_instance.findMany({ take: 3 })
  
  const existingSample = await prisma.booking.findUnique({
    where: { booking_code: 'BK001' },
  })

  if (!existingSample && instances.length > 0) {
    const booking1 = await prisma.booking.create({
      data: {
        booking_code: 'BK001',
        user_id: customer.user_id,
        status: 'Confirmed',
        created_at: new Date()
      }
    })

    const passenger1 = await prisma.passenger.create({
      data: {
        booking_id: booking1.booking_id,
        full_name: 'Mike Johnson',
        dob: new Date('1990-05-15')
      }
    })

    await prisma.ticket.create({
      data: {
        passenger_id: passenger1.passenger_id,
        instance_id: instances[0].instance_id,
        fare_id: 1,
        seat_label: '12A',
        price: 250.00,
        status: 'Issued'
      }
    })

    await prisma.payment.create({
      data: {
        booking_id: booking1.booking_id,
        amount: 250.00,
        method: 'Credit Card',
        transaction_ref: 'TXN001',
        status: 'Paid'
      }
    })
  } else if (existingSample) {
    console.log('Sample booking already exists, skipping creation.')
  }

  // 11. Notifications
  console.log('Creating notifications...')
  await prisma.notification.create({
    data: {
      user_id: customer.user_id,
      message: 'Your flight AA100 is confirmed for tomorrow!',
      is_read: false
    }
  })

  // 12. Staff Schedules
  console.log('Creating staff schedules...')
  for (let i = 0; i < 5; i++) {
    const shiftStart = addDays(addHours(baseDate, 9), i)
    const shiftEnd = addHours(shiftStart, 8)
    
    await prisma.staff_schedule.create({
      data: {
        user_id: staff.user_id,
        shift_start: shiftStart,
        shift_end: shiftEnd,
        role: 'Ground Staff',
        status: 'Scheduled'
      }
    })
  }

  // 13. Expenses
  console.log('Creating expenses...')
  const expenseCategories = ['Fuel', 'Maintenance', 'Crew Salaries', 'Airport Fees', 'Catering']
  for (let i = 0; i < 10; i++) {
    await prisma.expenses.create({
      data: {
        category: expenseCategories[i % expenseCategories.length],
        amount: 1000 + Math.random() * 9000,
        description: `Monthly ${expenseCategories[i % expenseCategories.length].toLowerCase()} expenses`,
        recorded_at: addDays(baseDate, -i)
      }
    })
  }

  console.log('Database seeded successfully!')
  console.log(`
    Summary:
    - Roles: 4
    - Users: 4 (owner, staff, admin, customer)
    - Airports: ${airports.length}
    - Aircraft: 3
    - Routes: ${routes.length}
    - Flights: ${createdFlights.length}
    - Flight Instances: ${createdFlights.length * 5}
    - Bookings: 1 with tickets
    - Expenses: 10
  `)
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })


