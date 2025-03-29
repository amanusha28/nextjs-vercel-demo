// This file contains type definitions for your data.
// It describes the shape of the data, and what data type each property should accept.
// For simplicity of teaching, we're manually defining these types.
// However, these types are generated automatically if you're using an ORM such as Prisma.
export type User = {
  id: string;
  name: string;
  email: string;
  password: string;
};

export type Customer = {
  id: string;
  name: string | null;
  generate_id: string | null;
  gender: string | null;
  ic: string | null;
  passport: string | null;
  race: string | null;
  marital_status: string | null;
  mobile_no: string | null;
  no_of_child: number | null;
  tel_code: string | null;
  tel_no: string | null;
  status: string | null;
};

export type CustomersTableType = {
  id: string;
  name: string | null;
  generate_id: string | null;
  gender: string | null;
  ic: string | null;
  passport: string | null;
  race: string | null;
  marital_status: string | null;
  mobile_no: string | null;
  no_of_child: number | null;
  tel_code: string | null;
  tel_no: string | null;
  status: string | null;
};

export type FormattedCustomersTable = {
  id: string;
  name: string | null;
  generate_id: string | null;
  gender: string | null;
  ic: string | null;
  passport: string | null;
  race: string | null;
  marital_status: string | null;
  mobile_no: string | null;
  no_of_child: number | null;
  tel_code: string | null;
  tel_no: string | null;
  status: string | null;
};

export type CustomerField = {
  id: string;
  name: string | null;
  ic: string | null;
  passport: string | null;
  race: string | null;
  gender: string | null;
  marital_status: string | null;
  no_of_child: number | null;
  car_plate: string | null;
  mobile_no: string | null;
  status: string | null;
  generate_id: string | null;
  tel_code: string | null;
  tel_no: string | null;
  customer_address?: Record<string, any>; 
  employment?: Record<string, any>; 
  relations?: Record<string, any>; 
  bank_details?: Record<string, any>; 
  documents?: Record<string, any>; 
  remarks?: Record<string, any>; 
};
