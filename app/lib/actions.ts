'use server';
import { PrismaClient } from "@prisma/client";
import { generateUniqueNumber } from "./data";
const prisma = new PrismaClient();
import { customerFormValidation } from "./validation";
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';


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
	ic: string;
	passport?: string;
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
	console.log('formData inside ============= ', formData);
	const parsedData = customerFormValidation.safeParse(formData);
	if (!parsedData.success) {
		return { error: parsedData.error.format() }; // Return errors
	}

	if (formData.relations.length > 0) {
		const temp = await updatedCustomerRelations(formData.relations);
		formData.relations = temp;
		console.log('formData.relations ============= ', temp);
	}

	if (formData.bank_details.length > 0) {
		const temp = await updatedCustomerBank(formData.bank_details);
		formData.bank_details = temp;
		console.log('formData.bank_details ============= ', temp);
	}

	if (!formData.generate_id) {
		const generate_id = await fetchUniqueNumber('CT');
		formData.generate_id = generate_id;
	}

	// const customerData = {
	// 	name: formData.name,
	// 	generate_id: formData.generate_id,
	// 	ic: formData.ic,
	// 	passport: formData.passport,
	// 	race: formData.race,
	// 	gender: formData.gender,
	// 	marital_status: formData.marital_status,
	// 	no_of_child: formData.no_of_child ? Number(formData.no_of_child) : null,
	// 	car_plate: formData.car_plate,
	// 	mobile_no: formData.mobile_no,
	// 	status: formData.status,
	// 	customer_address: formData.customer_address,
	// 	employment: formData.employment,
	// 	relations: formData.relations,
	// 	bank_details: formData.bank_details,
	// 	remarks: formData.remarks,
	// };

	// console.log('customerData ============= ', customerData);
	return formData;
}

export async function createCustomer(formData: CustomerFormData) {
	const customerData = await transformPayload(formData);

	try {
		const customer = await prisma.customer.create({
			data: customerData,
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
	const customerData = await transformPayload(formData);

	console.log('customerData ============= ', customerData);

	await prisma.customer.update({
		data: customerData,
		where: { id },
	});
	console.log('Customer Successfully Updated');
	revalidatePath('/dashboard/customers');
	redirect('/dashboard/customers');

}

export async function deleteCustomer(id: string) {
	console.log('id ============= deleteCustomer ', id);
	await prisma.customer.update({
		data: { deleted_at: new Date() },
		where: { id },
	});
	console.log('Customer Successfully Deleted');
	revalidatePath('/dashboard/customers');
	// redirect('/dashboard/customers');
}


