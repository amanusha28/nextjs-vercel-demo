import { z } from "zod";

export const customerFormValidation = z.object({
	name: z.string().min(1, "Name is required"),
	ic: z.string().optional(),
	passport: z.string().optional(),
	race: z.string().optional(),
	gender: z.string().optional(),
	marital_status: z.string().optional(),
	no_of_child: z.string().optional(),
	car_plate: z.string().optional(),
	mobile_no: z.string().optional(),
	status: z.string().optional(),
	customer_address: z.object({}).optional(),
	employment: z.object({}).optional(),
	relations: z.array(z.object({})).optional(),
	bank_details: z.array(z.object({})).optional(),
	documents: z.array(z.object({})).optional(),
	remarks: z.array(z.object({})).optional(),
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