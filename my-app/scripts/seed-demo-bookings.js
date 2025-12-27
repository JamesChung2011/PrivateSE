// Quick demo seeder to create extra bookings/tickets for passenger counts
const { PrismaClient } = require("@prisma/client")
const p = new PrismaClient()

async function main() {
  const insts = await p.flight_instance.findMany({ take: 5, include: { flight: true } })
  const user = await p.app_user.findFirst({ where: { email: "mike@customer.com" } })
  let created = 0

  for (const inst of insts) {
    const random = Math.random().toString(36).slice(2, 6).toUpperCase()
    const code = "BK" + random
    const booking = await p.booking.create({
      data: { booking_code: code, user_id: user?.user_id, status: "Confirmed" },
    })
    const passenger = await p.passenger.create({
      data: { booking_id: booking.booking_id, full_name: "Demo User", dob: new Date("1990-01-01") },
    })
    const seat = String.fromCharCode(65 + (created % 26)) + String(created + 1)
    await p.ticket.create({
      data: {
        passenger_id: passenger.passenger_id,
        instance_id: inst.instance_id,
        fare_id: 1,
        seat_label: seat,
        price: Number(inst.base_price || 200),
        status: "Issued",
      },
    })
    await p.payment.create({
      data: {
        booking_id: booking.booking_id,
        amount: Number(inst.base_price || 200),
        method: "Credit Card",
        transaction_ref: "TX" + code,
        status: "Paid",
      },
    })
    created++
  }

  console.log("Seeded bookings:", created)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await p.$disconnect()
  })
