"use server"
import { generateUniqueNumber } from "./data";
import { customerFormValidation } from "./validation";
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { signIn, signOut, auth } from '@/auth';
import { AuthError } from 'next-auth';
import bcrypt from "bcryptjs";
import prisma from "./prisma";


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
	normalStatusCounts?: number | string;
	completedStatusCounts?: number | string;
	badDebtStatusCounts?: number | string;
	badDebtCompletedStatusCounts?: number | string;
}


function generateRandomNumber(prefix: string): string {
	return `${prefix}${Math.floor(Math.random() * 900000 + 100000).toString().toUpperCase()}`;
}

export async function fetchUniqueNumber(prefix: string, model: any) {
	// if (model) {
	const randomNumber = generateRandomNumber(prefix);
	// Assuming you have a database or storage to check for uniqueness
	// This example uses Prisma for demonstration
	// const existingRecord = await prisma.[model].findFirst({
	// 	where: { generate_id: randomNumber },
	// });

	// if (existingRecord) {
	// 	return fetchUniqueNumber(prefix, model); // Recursively call until unique
	// }

	return randomNumber;
	// }
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
		const generate_id = await fetchUniqueNumber('CT', 'customer');
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
	return;

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
	const session = await auth();

	// Ensure loan generate_id is assigned
	if (!formData.generate_id) {
		formData.generate_id = await fetchUniqueNumber('LN', 'loan');
	}

	const loanData = {
		...formData,
		generate_id: formData.generate_id,
		created_by: session?.user.id,
	};

	const loanDataRes = await prisma.loan.create({
		data: loanData,
	});

	// Calculate repayment dates
	const calculateRepaymentDates = await getInstallmentDates(
		formData.repayment_date ?? '',
		formData.unit_period ?? '',
		formData.date_period ? Number(formData.date_period) : 0,
		formData.repayment_term ? Number(formData.repayment_term) : 0
	);

	// Create installments in parallel
	await Promise.all(
		calculateRepaymentDates.map(async (date) => {
			const generateId = await fetchUniqueNumber('IN', 'installment');
			return prisma.installment.create({
				data: {
					generate_id: generateId, // Ensure unique ID
					installment_date: date,
					loan: { connect: { id: loanDataRes.id } },
				},
			});
		})
	);

	// Ensure a unique generate_id for payment
	const generatePayId = await fetchUniqueNumber('PAY', 'payment');

	await prisma.payment.create({
		data: {
			type: 'Out',
			generate_id: generatePayId,
			payment_date: formData.repayment_date,
			amount: formData.amount_given?.toString(),
			balance: formData.amount_given?.toString(),
			account_details: 'Loan Disbursement',
			loan: { connect: { id: loanDataRes.id } },
		},
	});

	// Refresh and redirect
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
	const currentDate = new Date(startDate);

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
 *              Installment Data
 * ###############################################
 */
interface Installment {
	id?: string;
	generate_id?: string;
	installment_date: string;
	due_amount: string;
	receiving_date: string;
	accepted_amount: string;
	status?: string;
}
interface Payment {
	id?: string;
	generate_id?: string;
	type?: string;
	installment_id?: any;
	payment_date?: string;
	amount?: string;
	balance?: string;
	account_details?: string;
	loan_id?: any;
}
export async function updateOrCreateInstallment(payload: Installment[], loanId: string) {
	payload.map(async (x) => {
		console.log(x.id);
		if (!x.id) {
			await prisma.installment.create({
				data: { ...x, loan_id: loanId }
			})
		} else {
			await prisma.installment.update({
				where: { id: x.id },
				data: { ...x }
			})
		}
	})
}

export async function updateOrCreatePayment(payload: Payment[], loanId: string) {
	await Promise.all(
		payload.map(async (x) => {
			try {
				if (x.id) {
					// Update existing record
					const payment = await prisma.payment.update({
						where: { id: x.id },
						data: {
							type: x.type || 'In',
							installment_id: x.installment_id,
							payment_date: x.payment_date,
							amount: x.amount,
							balance: x.balance,
							account_details: x.account_details,
							loan_id: x.loan_id,
							generate_id: x.generate_id,
						}
					});
					console.log('Updated payment:', payment);
				} else {
					// Create new record
					const newPayment = await prisma.payment.create({
						data: {
							type: x.type || 'In',
							installment_id: x.installment_id,
							payment_date: x.payment_date,
							amount: x.amount,
							balance: x.balance,
							account_details: x.account_details,
							loan_id: loanId, // Ensure loanId is passed correctly
							generate_id: x.generate_id,
						}
					});
					console.log('Created payment:', newPayment);
				}
				if(x.installment_id) {

					try {
						const updatedInstallment = await prisma.installment.update({
							where: {
								id: x.installment_id
							},
							data: {
								receiving_date: x.payment_date,
								accepted_amount: x.amount,
							}
						});
						console.log('Updated installment:', updatedInstallment);
					} catch (error) {
						console.error('Error updating installment:', error);
					}
				}
			} catch (error) {
				console.error('Error processing payment:', error);
			}
		})
	);
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


/**
 * ###############################################
 *                    Loan Data
 * ###############################################
 */

export async function getLoanInstallment(loan_id: string) {
	return await prisma.installment.findMany({
		where: {
			loan_id: loan_id
		}
	})
}

export async function getPaymentData(loan_id: string) {
	return await prisma.payment.findMany({
		where: {
			loan_id: loan_id
		}
	})
}
