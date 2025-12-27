import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding mock users...')
  const hashedPassword = await bcrypt.hash('password123', 10)

  // First, ensure roles exist
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

  // Create mock users matching user-context.tsx
  await prisma.app_user.upsert({
    where: { user_id: '00000000-0000-0000-0000-000000000001' },
    update: {},
    create: {
      user_id: '00000000-0000-0000-0000-000000000001',
      email: 'john@flightmgmt.com',
      full_name: 'John Doe',
      password_hash: hashedPassword,
      phone: '555-0101',
      role_id: ownerRole.role_id,
      is_active: true
    }
  })

  await prisma.app_user.upsert({
    where: { user_id: '00000000-0000-0000-0000-000000000002' },
    update: {},
    create: {
      user_id: '00000000-0000-0000-0000-000000000002',
      email: 'jane@flightmgmt.com',
      full_name: 'Jane Smith',
      password_hash: hashedPassword,
      phone: '555-0102',
      role_id: staffRole.role_id,
      is_active: true
    }
  })

  await prisma.app_user.upsert({
    where: { user_id: '00000000-0000-0000-0000-000000000003' },
    update: {},
    create: {
      user_id: '00000000-0000-0000-0000-000000000003',
      email: 'admin@flightmgmt.com',
      full_name: 'Admin User',
      password_hash: hashedPassword,
      phone: '555-0103',
      role_id: adminRole.role_id,
      is_active: true
    }
  })

  await prisma.app_user.upsert({
    where: { user_id: '00000000-0000-0000-0000-000000000004' },
    update: {},
    create: {
      user_id: '00000000-0000-0000-0000-000000000004',
      email: 'mike@customer.com',
      full_name: 'Mike Johnson',
      password_hash: hashedPassword,
      phone: '555-0104',
      role_id: customerRole.role_id,
      is_active: true
    }
  })

  console.log('Mock users seeded successfully!')
}

main()
  .catch((e) => {
    console.error('Error seeding users:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
