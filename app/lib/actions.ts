'use server';
import { z } from 'zod';
import { PrismaClient } from "@prisma/client";
import { generateUniqueNumber } from "./data";
const prisma = new PrismaClient();
import { customerFormValidation } from "./validation";
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';


async function updatedCustomerRelations(relations: any) {
	return await Promise.all(relations.map(async (relation: any) => {
		console.log('relation.id ============= ', relation.id);
		if (relation.id === 'temp-id') {
			console.log('relation.id inside if============= ');
			const generate_rId = await generateUniqueNumber('CR');
			console.log(generate_rId)
			delete relation.id;
			return {
				id: generate_rId,
				...relation,
			};
		}
		return relation;
	}));
}

async function updatedCustomerBank(bank_details: any) {
	return await Promise.all(bank_details.map(async (bank: any) => {
		console.log('bank.id ============= ', bank.id);
		if (bank.id === 'temp-id') {
			console.log('bank.id inside if============= ');
			const generate_rId = await generateUniqueNumber('CB');
			console.log(generate_rId)
			delete bank.id;
			return {
				id: generate_rId,
				...bank,
			};
		}
		return bank;
	}));
}

async function updatedCustomerRemark(remarks: any) {
	return await Promise.all(remarks.map(async (remark: any) => {
		console.log('remarks.id ============= ', remark.id);
		if (remark.id === 'temp-id') {
			console.log('remark.id inside if============= ');
			const generate_rId = await generateUniqueNumber('CR');
			console.log(generate_rId)
			delete remark.id;
			return {
				id: generate_rId,
				...remark,
			};
		}
		return remark;
	}));
}

export async function transformPayload(formData: any) {
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

	if (formData.remarks.length > 0) {
		const temp = await updatedCustomerRemark(formData.remarks);
		formData.remarks = temp;
		console.log('formData.remarks ============= ', temp);
	}

	const customerData = {
		name: formData.name,
		ic: formData.ic,
		passport: formData.passport,
		race: formData.race,
		gender: formData.gender,
		marital_status: formData.marital_status,
		no_of_child: formData.no_of_child ? parseInt(formData.no_of_child) : null,
		car_plate: formData.car_plate,
		mobile_no: formData.mobile_no,
		status: formData.status,
		customer_address: formData.customer_address,
		employment: formData.employment,
		relations: formData.relations,
		bank_details: formData.bank_details,
		remarks: formData.remarks,
	};

	console.log('customerData ============= ', customerData);
	return customerData;
}

export async function createCustomer(formData: any) {
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

export async function updateCustomer(id: string, formData: any) {
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


