'use server';
import { z } from 'zod';
import { PrismaClient } from "@prisma/client";
import { generateUniqueNumber } from "./data";
const prisma = new PrismaClient();

export async function createCustomer(formData: any) {
    console.log('formData ============= ', formData);
    const generate_id = await generateUniqueNumber('CT');
    console.log('generate_id ============= ', generate_id);
    const customerData = {
        generate_id,
        name: formData.basicInfo.name,
        ic: formData.basicInfo.ic,
        passport: formData.basicInfo.passport,
        race: formData.basicInfo.race,
        gender: formData.basicInfo.gender,
        marital_status: formData.basicInfo.marital_status,
        no_of_child: formData.basicInfo.no_of_child ? parseInt(formData.basicInfo.no_of_child) : null,
        car_plate: formData.basicInfo.car_plate,
        mobile_no: formData.basicInfo.mobile_no,
        status: formData.basicInfo.status,
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
        return customer;
    } catch (error) {
        console.error('Error creating customer:', error);
        throw error;
    }
}