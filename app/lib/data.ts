import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

// interface FetchCustomersPayload {
//   query: string;
//   currentPage: number;
// }

// interface Customer {
//   id: string;
//   name: string | null;
//   email: string | null;
// }

export async function fetchCustomers(payload: { 
  query: any; currentPage: any; 
}) {
  const { query, currentPage } = payload;
  try {
    const customers = await prisma.customer.findMany({
      where: {
        deleted_at: null,
      },
    });

    const totalCustomer = await prisma.customer.count({
      where: {
        deleted_at: null
      }
    });

    return { totalCustomer, customers};
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch all customers.');
  }
}

export async function generateUniqueNumber(category: string): Promise<string> {
  const now = new Date();
  const year = now.getFullYear() % 100;

  // Check if a record exists for this category, year, and month
  let record = await prisma.tracker.findFirst({
    where: { category, year },
  });

  let newNumber = 1; // Default if no record exists

  if (record) {
    newNumber = record.lastNumber + 1; // Corrected field name
    // Update the last number
    await prisma.tracker.update({
      where: { id: record.id },
      data: { lastNumber: newNumber }, // Corrected field name
    });
  } else {
    // Insert new record for the month
    await prisma.tracker.create({
      data: { category, year, lastNumber: newNumber },
    });
  }

  // Format running number to 5 digits
  const formattedNumber = String(newNumber).padStart(5, '0');

  return `${category.toUpperCase()}${year}${formattedNumber}`;
}
