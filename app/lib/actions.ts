'use server';
import { z } from 'zod';
import { PrismaClient } from "@prisma/client";
import { generateUniqueNumber } from "./data";
const prisma = new PrismaClient();
import { customerFormValidation } from "./validation";
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function createCustomer(formData: any) {
    console.log('formData ============= ', formData);

		const parsedData = customerFormValidation.safeParse(formData);

		if (!parsedData.success) {
			return { error: parsedData.error.format() }; // Return errors
		}
    const generate_id = await generateUniqueNumber('CT');
    console.log('generate_id ============= ', generate_id);
    const customerData = {
        generate_id,
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