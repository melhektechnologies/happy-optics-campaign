import "dotenv/config";
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Start seeding...')

  // Clean up existing data
  await prisma.saleItem.deleteMany()
  await prisma.sale.deleteMany()
  await prisma.inventory.deleteMany()
  await prisma.product.deleteMany()
  await prisma.category.deleteMany()
  await prisma.supplier.deleteMany()
  await prisma.user.deleteMany()
  await prisma.branch.deleteMany()

  // 1. Create Branches
  const mainBranch = await prisma.branch.create({
    data: {
      name: 'Downtown Main',
      location: '123 Retail Ave, NY',
      phone: '+1 (555) 111-2222'
    }
  })

  const westBranch = await prisma.branch.create({
    data: {
      name: 'Westside Branch',
      location: '456 West Blvd, NY',
      phone: '+1 (555) 333-4444'
    }
  })

  // 2. Create Users
  await prisma.user.create({
    data: {
      email: 'admin@supernova.com',
      password: 'hashed_password_placeholder', // Note: Use bcrypt in real auth flow
      firstName: 'Sarah',
      lastName: 'Jenkins',
      role: 'SUPER_ADMIN',
    }
  })

  const cashier = await prisma.user.create({
    data: {
      email: 'cashier@supernova.com',
      password: 'hashed_password_placeholder',
      firstName: 'David',
      lastName: 'Miller',
      role: 'CASHIER',
      branchId: mainBranch.id
    }
  })

  // 3. Create Categories
  const catProduce = await prisma.category.create({ data: { name: 'Produce' } })
  const catDairy = await prisma.category.create({ data: { name: 'Dairy' } })
  const catBakery = await prisma.category.create({ data: { name: 'Bakery' } })
  const catPantry = await prisma.category.create({ data: { name: 'Pantry' } })

  // 4. Create Suppliers
  const supFreshFarms = await prisma.supplier.create({ data: { name: 'Fresh Farms Logistics', contact: 'John Doe' } })
  const supValleyDairy = await prisma.supplier.create({ data: { name: 'Valley Dairy Co.', contact: 'Jane Smith' } })

  // 5. Create Products
  const prodBanana = await prisma.product.create({
    data: {
      sku: 'PRD-BN-01',
      name: 'Organic Bananas',
      price: 2.99,
      cost: 1.50,
      categoryId: catProduce.id,
      supplierId: supFreshFarms.id
    }
  })

  const prodMilk = await prisma.product.create({
    data: {
      sku: 'PRD-MK-01',
      name: 'Whole Milk 1L',
      price: 1.49,
      cost: 0.80,
      categoryId: catDairy.id,
      supplierId: supValleyDairy.id
    }
  })

  const prodBread = await prisma.product.create({
    data: {
      sku: 'PRD-BD-02',
      name: 'Sourdough Bread',
      price: 4.99,
      cost: 2.00,
      categoryId: catBakery.id
    }
  })

  // 6. Allocate Inventory
  await prisma.inventory.createMany({
    data: [
      { productId: prodBanana.id, branchId: mainBranch.id, quantity: 150, minStock: 50 },
      { productId: prodBanana.id, branchId: westBranch.id, quantity: 80, minStock: 50 },
      { productId: prodMilk.id, branchId: mainBranch.id, quantity: 45, minStock: 50 }, // Low stock
      { productId: prodBread.id, branchId: westBranch.id, quantity: 0, minStock: 20 }, // Out of stock
    ]
  })

  console.log('Seeding finished.')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
