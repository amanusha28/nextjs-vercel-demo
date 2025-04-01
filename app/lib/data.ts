"use server"
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

import { auth } from '@/auth';

export async function generateUniqueNumber(category: string): Promise<string> {
  const now = new Date();
  const year = now.getFullYear() % 100;

  // Check if a record exists for this category, year, and month
  const record = await prisma.tracker.findFirst({
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

/**
 * ###########################################################
 * 						User Data
 * ###########################################################
 */

export async function fetchAllAgent() {
  try {
    const agents = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
      },
      where: {
        deleted_at: null,
      },
    });

    return agents;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch all customers.');
  }
}

/**
 * ###########################################################
 * 						Customer Data
 * ###########################################################
 */

export async function fetchCustomers(payload: { 
  query: any; currentPage: number; pageSize: number; 
}) {
  const { query, currentPage, pageSize } = payload;
  try {
    const session = await auth()
    console.log(session)

    // console.log('Fetching customers with query:', query);
    const skip = (currentPage - 1) * pageSize;

    const customers = await prisma.customer.findMany({
      where: {
        created_by: session?.user.id,
        deleted_at: null,
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { ic: { contains: query, mode: 'insensitive' } },
          { passport: { contains: query, mode: 'insensitive' } },
        ]
      },
      skip,
      take: pageSize,
    });

    const totalCustomer = await prisma.customer.count({
      where: {
        deleted_at: null,
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { ic: { contains: query, mode: 'insensitive' } },
          { passport: { contains: query, mode: 'insensitive' } },
        ]
      },
    });

    return { totalCustomer, customers };
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch all customers.');
  }
}

export async function fetchCustomerById(id: string) {

  try {
    const customer = await prisma.customer.findUnique({
      where: { id },
    });

    return customer;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch the customer.');
  }
}


/**
 * ###############################################
 *                    Loan Data
 * ###############################################
 */

export async function fetchLoan(payload: { 
  query: any; currentPage: number; pageSize: number; 
}) {
  const { query, currentPage, pageSize } = payload;
  try {
    const session = await auth()
    const skip = (currentPage - 1) * pageSize;

    const loan = await prisma.loan.findMany({
      where: {
        created_by: session?.user.id,
        deleted_at: null,
        OR: [
          { generate_id: { contains: query, mode: 'insensitive' } },
        ]
      },
      include: {
        customer: {
          select: {
            id: true,
            name: true,
          },
        },
        user_loan_agent_1Touser: {
          select: {
            id: true,
            name: true,
          },
        },
        user_loan_agent_2Touser: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      skip,
      take: pageSize,
      orderBy: {
        created_at: 'desc', // Sort by createdAt in descending order
      },
    });

    const totalLoan = await prisma.loan.count({
      where: {
        deleted_at: null,
        // OR: [
        //   { name: { contains: query, mode: 'insensitive' } },
        //   { ic: { contains: query, mode: 'insensitive' } },
        //   { passport: { contains: query, mode: 'insensitive' } },
        // ]
      },
    });
    // console.log({ totalLoan, loan })
    return { totalLoan, loan };
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch all loan.');
  }
}

export async function fetchLoanById(id: string) {

  try {
    const customer = await prisma.loan.findUnique({
      where: { id },
      include: {
        customer: {
          select: {
            id: true,
            name: true,
          },
        },
        user_loan_agent_1Touser: {
          select: {
            id: true,
            name: true,
          },
        },
        user_loan_agent_2Touser: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return customer;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch the customer.');
  }
}



/**
 * ###############################################
 *            Country, State, City Data
 * ###############################################
 */
export async function fetchCountry() {
  try {
    const country = await prisma.country.findMany({
    });
    return country
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch all loan.');
  }
}

export async function fetchState() {
  try {
    const state = await prisma.state.findMany({
    });
    return state
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch all loan.');
  }
}

export async function fetchCity() {
  try {
    const city = await prisma.city.findMany({
    });
    return city
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch all loan.');
  }
}