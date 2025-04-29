const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkEnum() {
  try {
    // Check if we can use the new enum value
    console.log("OrderStatus values in Prisma:", prisma.OrderStatus);
    
    // Try to create a test order with the new status
    const testOrder = await prisma.order.create({
      data: {
        status: 'PAYMENT_REQUIRED',
        totalAmount: 0,
      }
    });
    
    console.log("Created test order with PAYMENT_REQUIRED status:", testOrder);
    
    // Clean up
    await prisma.order.delete({
      where: { id: testOrder.id }
    });
    
    console.log("PAYMENT_REQUIRED status is available in the database");
  } catch (error) {
    console.error("Error:", error);
    console.log("PAYMENT_REQUIRED status might not be available");
  } finally {
    await prisma.$disconnect();
  }
}

checkEnum();