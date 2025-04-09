"use server"

import { auth } from '@/auth';
import prisma from './prisma';
import { handleSignOut } from './actions';

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

export async function getUsers(payload: { 
  query: any; currentPage: number; pageSize: number; 
}) {
  // const { query, currentPage, pageSize } = payload;
  const session = await auth();
  if (!session) {
    await handleSignOut();
  }
  const users = await prisma.user.findMany({
    where: {
      deleted_at: null,

    }
  })
  const total = await prisma.user.count({
    where: {
      deleted_at: null
    }
  })
  return { total: total, users: users }
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
    const customerIds = customers.map((customer: any) => customer.id);

    const loanStatusCounts = await prisma.loan.groupBy({
      by: ['customer_id', 'status'],
      where: {
      customer_id: { in: customerIds },
      },
      _count: {
      status: true,
      },
    });

    const statusMap = loanStatusCounts.reduce((acc: any, item: any) => {
      if (!acc[item.customer_id]) {
      acc[item.customer_id] = {
        completedStatusCounts: 0,
        normalStatusCounts: 0,
        badDebtStatusCounts: 0,
        badDebtCompletedStatusCounts: 0,
      };
      }
      switch (item.status) {
      case 'Completed':
        acc[item.customer_id].completedStatusCounts = item._count.status;
        break;
      case 'Normal':
        acc[item.customer_id].normalStatusCounts = item._count.status;
        break;
      case 'Bad Debt':
        acc[item.customer_id].badDebtStatusCounts = item._count.status;
        break;
      case 'Bad Debt Completed':
        acc[item.customer_id].badDebtCompletedStatusCounts = item._count.status;
        break;
      }
      return acc;
    }, {});

    customers.forEach((customer: any) => {
      const counts = statusMap[customer.id] || {
        completedStatusCounts: 0,
      normalStatusCounts: 0,
      badDebtStatusCounts: 0,
      badDebtCompletedStatusCounts: 0,
      };
      customer.completedStatusCounts = counts.completedStatusCounts;
      customer.normalStatusCounts = counts.normalStatusCounts;
      customer.badDebtStatusCounts = counts.badDebtStatusCounts;
      customer.badDebtCompletedStatusCounts = counts.badDebtCompletedStatusCounts;
    });
    console.log('customerscustomerscustomerscustomerscustomers');
    console.log(customers);
    console.log('customerscustomerscustomerscustomerscustomerscustomers');
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

export async function fetchCurrentUserCustomer(payload: { 
  query: string; 
  currentPage: number; 
  pageSize: number; 
}) {
  const { query } = payload;

  if (!query || query.trim() === '') {
    return { data: [] };
  }

  try {
    const session = await auth();
    if (!session) {
      await handleSignOut()
    }

    const currentDate = new Date().toISOString().split('T')[0]; // Returns "2025-04-02"

    const customersWithMatchingLoans = await prisma.$queryRaw`
      SELECT 
        c.id AS customer_id, 
        c.generate_id AS customer_generate_id, 
        c.name AS customer_name, 
        c.ic AS customer_ic, 
        c.passport AS customer_passport, 
        c.deleted_at AS customer_deleted_at,   
        l.id AS loan_id, 
        l.generate_id AS loan_generate_id, 
        l.customer_id AS loan_customer_id, 
        l.amount_given AS loan_amount, 
        l.interest AS loan_interest_rate, 
        l.status AS loan_status, 
        l.agent_1 AS loan_agent_1_id, 
        l.agent_2 AS loan_agent_2_id, 
        i.generate_id AS installment_generate_id, 
        i.loan_id AS installment_loan_id, 
        i.due_amount AS installment_amount, 
        i.installment_date AS installment_date, 
        i.status AS installment_status,
        -- Agent 1 Details
        u1.id AS agent_1_id,
        u1.name AS agent_1_name,
        u1.email AS agent_1_email,
        -- Agent 2 Details
        u2.id AS agent_2_id,
        u2.name AS agent_2_name,
        u2.email AS agent_2_email
        
      FROM customer c
      LEFT JOIN loan l ON c.id = l.customer_id
      LEFT JOIN installment i ON l.id = i.loan_id 
          AND i.installment_date::TEXT::DATE > ${currentDate}::DATE -- Fixes Date Binding
      
      -- Join Agent 1 (User)
      LEFT JOIN "user" u1 ON l.agent_1 = u1.id

      -- Join Agent 2 (User)
      LEFT JOIN "user" u2 ON l.agent_2 = u2.id

      WHERE c.deleted_at IS NULL
        AND (
            c.generate_id ILIKE ${'%' + query + '%'}
            OR c.name ILIKE ${'%' + query + '%'}
            OR c.ic ILIKE ${'%' + query + '%'}
            OR c.passport ILIKE ${'%' + query + '%'}
        )
      ORDER BY i.installment_date DESC
    `;

    console.log('customersWithMatchingLoans', customersWithMatchingLoans);
    
    return { data: customersWithMatchingLoans || [] };
  } catch (error) {
    console.error('Error fetching customer data:', error);
    return { data: [] };
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