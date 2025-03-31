import { z } from "zod";

export const customerFormValidation = z.object({
	name: z.string().min(1, "Name is required"),
	ic: z.string().optional().nullable(),
	passport: z.string().optional().nullable(),
	race: z.string().optional().nullable(),
	gender: z.string().optional().nullable(),
	marital_status: z.string().optional().nullable(),
	no_of_child: z.any().optional().nullable(),
	car_plate: z.any().optional().nullable(),
	mobile_no: z.string().optional().nullable(),
	status: z.string().optional().nullable(),
	customer_address: z.object({}).optional().nullable(),
	employment: z.object({}).optional().nullable(),
	relations: z.array(z.object({})).optional().nullable(),
	bank_details: z.array(z.object({})).optional().nullable(),
	document: z.array(z.object({})).optional().nullable(),
	remarks: z.array(z.object({})).optional().nullable(),
});


export function transformError(errorObject: any) {
	const formattedError: Record<string, any> = {};

	if (errorObject?.error?.issues) {
		for (const issue of errorObject.error.issues) {
			let current = formattedError;
			for (let i = 0; i < issue.path.length; i++) {
				const key = issue.path[i];

				if (i === issue.path.length - 1) {
					if (!current[key]) {
						current[key] = [];
					}
					current[key].push(issue.message);
				} else {
					if (!current[key]) {
						current[key] = {};
					}
					current = current[key];
				}
			}
		}
	}

	return formattedError;
}  

// Loan 

export const loanFormValidation = z.object({
	customer_id: z.string().optional().nullable(),
	repayment_date: z.string().optional().nullable(),
	principal_amount: z.number().optional().nullable(),
	deposit_amount: z.number().optional().nullable(),
	application_fee: z.number().optional().nullable(),
	interest: z.number().optional().nullable(),
	remark: z.string().optional().nullable(),
	created_by: z.string().optional().nullable(),
	supervisor: z.string().optional().nullable(),
	supervisor_2: z.string().optional().nullable(),
	date_period: z.string().optional().nullable(),
	loan_remark: z.string().optional().nullable(),
	unit_of_date: z.string().optional().nullable(),
	generate_id: z.string().optional().nullable(),
	repayment_term: z.string().optional().nullable(),
	status: z.string().optional().nullable(),
	amount_given: z.number().optional().nullable(),
	interest_amount: z.number().optional().nullable(),
	payment_per_term: z.number().optional().nullable(),
});

