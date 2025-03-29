import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

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


// interface FetchCustomersPayload {
//   query: string;
//   currentPage: number;
// }

// interface Customer {
//   id: string;
//   name: string | null;
//   email: string | null;
// }

interface TransformCustomerDto {
  name: string;
  ic: string;
  passport: string;
  race: string;
  gender: string;
  marital_status: string;
  no_of_child: string | null;
  car_plate: string;
  mobile_no: string;
  status: string;
  customer_address: Record<string, any>;
  employment: Record<string, any>;
  relations: Record<string, any>;
  bank_details: Record<string, any>;
  documents: Record<string, any>;
  remarks: Record<string, any>;
}


function transformCustomerData(data: any): TransformCustomerDto {
  return {
    basicInfo: {
      name: data.name,
      ic: data.ic,
      passport: data.passport,
      race: data.race,
      gender: data.gender,
      marital_status: data.marital_status,
      no_of_child: data.no_of_child,
      car_plate: data.car_plate,
      mobile_no: data.mobile_no,
      status: data.status,
    },
    customer_address: data.customer_address || {},
    employment: data.employment || {},
    relations: data.relations || {},
    bank_details: data.bank_details || {},
    documents: {}, // Placeholder if documents exist
    remarks: data.remarks || {},
  };
}


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

export async function fetchCustomerById(id: string) {
  try {
    const customer = await prisma.customer.findUnique({
      where: { id },
    });

    return customer;
    // return transformCustomerData(customer);
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch the customer.');
  }
}
