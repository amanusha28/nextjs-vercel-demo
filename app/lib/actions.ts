"use server"
import { PrismaClient } from "@prisma/client";
import { generateUniqueNumber } from "./data";
const prisma = new PrismaClient();
import { customerFormValidation } from "./validation";
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { signIn, signOut, auth } from '@/auth';
import { AuthError } from 'next-auth';
import bcrypt from "bcryptjs";


export async function authenticate(
	prevState: string | undefined,
	formData: FormData,
) {
	try {
		await signIn('credentials', formData);
	} catch (error) {
		if (error instanceof AuthError) {
			switch (error.type) {
				case 'CredentialsSignin':
					return 'Invalid credentials.';
				default:
					return 'Something went wrong.';
			}
		}
		throw error;
	}
}

export async function handleSignOut() {
	await signOut({ redirectTo: '/login' });
}

/**
 * ###########################################################
 * 						User Data
 * ###########################################################
 */

interface ChangePasswordFormData {
	currentPassword: string;
	newPassword: string;
}

export async function changePassword(formData: FormData): Promise<{ success: boolean }> {
	const { currentPassword, newPassword } = Object.fromEntries(formData) as unknown as ChangePasswordFormData;

	// Get the current session
	const session = await auth();
	if (!session?.user?.email) {
		throw new Error('User not authenticated');
	}
	console.log('session data', session);

	// Fetch the user from the database
	const user = await prisma.user.findUnique({
		where: { id: session.user.id },
	});
	console.log('user data after session', user);
	if (!user) {
		throw new Error('User not found');
	}

	// Verify the current password
	if (!user.password) {
		throw new Error('User password is not set');
	}
	const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
	console.log('isPasswordValid', isPasswordValid)
	if (!isPasswordValid) {
		throw new Error('Current password is incorrect');
	}

	// Hash the new password
	const hashedPassword = await bcrypt.hash(newPassword, 10);

	// Update the user's password in the database
	await prisma.user.update({
		where: { email: session.user.email },
		data: { password: hashedPassword },
	});

	return { success: true };
}



/**
 * ###########################################################
 * 						Customer Data
 * ###########################################################
 */

interface CustomerRelation {
	id?: string;
	[key: string]: any;
}

interface CustomerBank {
	id?: string;
	[key: string]: any;
}

interface CustomerRemark {
	id?: string;
	[key: string]: any;
}

interface CustomerFormData {
	name: string;
	generate_id?: string;
	ic: string | null;
	passport?: string | null;
	race: string;
	gender: string;
	marital_status: string;
	no_of_child?: number | null;
	car_plate?: string;
	mobile_no: string;
	status: string;
	customer_address: Record<string, any>;
	employment: Record<string, any>;
	relations: CustomerRelation[];
	bank_details: CustomerBank[];
	remarks?: CustomerRemark[];
	document?: Record<string, any>[];
}


export async function fetchUniqueNumber(category: string) {
	const generate_rId = await generateUniqueNumber(category);
	return generate_rId;
}


async function updatedCustomerRelations(relations: CustomerRelation[]) {
	return await Promise.all(relations.map(async (relation: any) => {
		// console.log('relation.id ============= ', relation.id);
		if (relation.id === 'temp-id') {
			// console.log('relation.id inside if============= ');
			const generate_rId = await generateUniqueNumber('CR');
			// console.log(generate_rId)
			delete relation.id;
			return {
				id: generate_rId,
				...relation,
			};
		}
		return relation;
	}));
}

async function updatedCustomerBank(bank_details: CustomerBank[]) {
	return await Promise.all(bank_details.map(async (bank: any) => {
		// console.log('bank.id ============= ', bank.id);
		if (bank.id === 'temp-id') {
			// console.log('bank.id inside if============= ');
			const generate_rId = await generateUniqueNumber('CB');
			// console.log(generate_rId)
			delete bank.id;
			return {
				id: generate_rId,
				...bank,
			};
		}
		return bank;
	}));
}

export async function transformPayload(formData: CustomerFormData) {
	// console.log('formData inside ============= ', formData);
	const parsedData = customerFormValidation.safeParse(formData);
	if (!parsedData.success) {
		return { error: parsedData.error.format() }; // Return errors
	}

	if (formData.relations.length > 0) {
		const temp = await updatedCustomerRelations(formData.relations);
		formData.relations = temp;
		// console.log('formData.relations ============= ', temp);
	}

	if (formData.bank_details.length > 0) {
		const temp = await updatedCustomerBank(formData.bank_details);
		formData.bank_details = temp;
		// console.log('formData.bank_details ============= ', temp);
	}

	if (!formData.generate_id) {
		const generate_id = await fetchUniqueNumber('CT');
		formData.generate_id = generate_id;
	}

	if (formData.document?.length === 0) {
		delete formData.document;
	}
	const customerData: CustomerFormData & { document?: Record<string, any>[] } = {
		name: formData.name,
		generate_id: formData.generate_id,
		ic: (formData.ic === '') ? null : formData.ic,
		passport: (formData.passport === '') ? null : formData.passport,
		race: formData.race,
		gender: formData.gender,
		marital_status: formData.marital_status,
		no_of_child: formData.no_of_child ? Number(formData.no_of_child) : null,
		car_plate: formData.car_plate,
		mobile_no: formData.mobile_no,
		status: formData.status,
		customer_address: formData.customer_address,
		employment: formData.employment,
		relations: formData.relations,
		bank_details: formData.bank_details,
		remarks: formData.remarks,
	};

	if (formData.document?.length === 0) {
		delete formData.document;
	} else {
		customerData.document = formData.document;
	}

	// console.log('customerData ============= ', customerData);
	return customerData;
}

export async function createCustomer(formData: CustomerFormData) {
	const customerData = await transformPayload(formData);

	const session = await auth()
	console.log(session)

	try {
		const customer = await prisma.customer.create({
			data: { ...customerData, created_by: session?.user.id },
		});
		console.log('Customer created successfully:', customer);
		revalidatePath('/dashboard/customers');
		redirect('/dashboard/customers');
	} catch (error) {
		console.error('Error creating customer:', error);
		throw error;
	}
}

export async function updateCustomer(id: string, formData: CustomerFormData) {
	// const session = await auth();

	// console.log('session ============= ', session);
	const customerData = await transformPayload(formData);

	if (formData.passport) {
		const isExisting = await checkUniqueConstraint('passport', formData.passport)
		console.log('isExisting ->', isExisting);
	}

	if (formData.ic) {
		const isExisting = await checkUniqueConstraint('ic', formData.ic)
		console.log('isExisting ->', isExisting);
	}

	// console.log(' updateCustomer customerData ============= ', customerData);

	await prisma.customer.update({
		data: customerData,
		where: { id },
	});
	console.log('Customer Successfully Updated');
	revalidatePath('/dashboard/customers');
	redirect('/dashboard/customers');

}

// Soft Delete Customer
export async function deleteCustomer(id: string) {
	// console.log('id ============= deleteCustomer ', id);
	await prisma.customer.update({
		data: { deleted_at: new Date() },
		where: { id },
	});
	console.log('Customer Successfully Deleted');
	revalidatePath('/dashboard/customers');
	// redirect('/dashboard/customers');
}

export async function checkUniqueConstraint(col: string, val: string) {
	return prisma.customer.findFirst({
		where: {
			[col]: val,
		},
	});
}

/**
 * ###############################################
 *                    Loan Data
 * ###############################################
 */

interface LoanFormData {
	customer_id?: any
	created_by?: string | null
	loan_remark?: string | null
	generate_id?: any
	status?: string | null
	agent_1?: any
	agent_2?: any
	created_at?: Date
	unit_period?: string | null
	repayment_date?: string | null
	principal_amount?: string | null
	deposit_amount?: string | null
	application_fee?: string | null
	interest?: string | null
	date_period?: string | null
	repayment_term?: string | null
	amount_given?: string | null
	interest_amount?: string | null
	payment_per_term?: string | null
	deleted_at?: Date | null
}

// Soft Delete Loan
export async function deleteLoan(id: string) {
	// console.log('id ============= deleteCustomer ', id);
	await prisma.loan.update({
		data: { deleted_at: new Date() },
		where: { id },
	});
	console.log('Customer Successfully Deleted');
	revalidatePath('/dashboard/loan');
	// redirect('/dashboard/customers');
}

export async function createLoan(formData: LoanFormData) {
	const session = await auth()
	// console.log(session)
	// console.log('createLoan createLoan createLoan createLoan')
	// console.log({ ...formData, created_by: session?.user.id });
	if (!formData.generate_id) {
		formData.generate_id = await fetchUniqueNumber('LN'); // Ensure generate_id is provided
	}

	const loanData = {
		...formData,
		generate_id: formData.generate_id, // Ensure generate_id is always defined
		created_by: session?.user.id,
	};

	await prisma.loan.create({
		data: loanData,
	});
	console.log(
		formData.repayment_date,
		formData.date_period,
		formData.date_period,
		formData.repayment_term,
	);
	revalidatePath('/dashboard/loan');
	redirect('/dashboard/loan');
}

export async function updateLoan(id: string, formData: LoanFormData) {
	const session = await auth()
	// console.log(session)
	// console.log('createLoan createLoan createLoan createLoan')
	// console.log({ ...formData, created_by: session?.user.id });
	await prisma.loan.update({
		where: { id },
		data: {
			...formData,
			created_by: session?.user.id,
		},
	});
	revalidatePath('/dashboard/loan');
	redirect('/dashboard/loan');
}

export async function getInstallmentDates(
	startDate: string,
	period: string,
	interval: number,
	repaymentTerm: number
): Promise<string[]> {
	const dates: string[] = [];
	let currentDate = new Date(startDate);

	for (let i = 0; i < repaymentTerm; i++) {
		dates.push(currentDate.toISOString().split('T')[0]); // Formats date as YYYY-MM-DD

		switch (period) {
			case 'day':
				currentDate.setDate(currentDate.getDate() + interval);
				break;
			case 'week':
				currentDate.setDate(currentDate.getDate() + interval * 7);
				break;
			case 'month':
				currentDate.setMonth(currentDate.getMonth() + interval);
				break;
			case 'year':
				currentDate.setFullYear(currentDate.getFullYear() + interval);
				break;
			default:
				throw new Error('Invalid period type');
		}
	}

	return dates;
}



/**
 * ###############################################
 *            Country, State, City Data
 * ###############################################
 */

export async function fetchCountry() {
	return await prisma.country.findMany();
}

export async function fetchState() {
	return await prisma.state.findMany();
}

export async function fetchCity() {
	return await prisma.city.findMany();
}