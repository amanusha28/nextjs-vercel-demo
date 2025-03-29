import Form from '@/app/ui/invoices/edit-form';
import Breadcrumbs from '@/app/ui/invoices/breadcrumbs';
import { fetchCustomerById } from '@/app/lib/data';
import CustomerForm from '@/app/ui/customers/create-form';

export default async function Page(props: { params: Promise<{ id: string }> }) {
	const params = await props.params;
	const id = params.id;
	const customers = await fetchCustomerById(id);
	// console.log(customers);
	return (
		<main>
			<Breadcrumbs
				breadcrumbs={[
					{ label: 'Customer', href: '/dashboard/customers' },
					{
						label: 'Edit Invoice',
						href: `/dashboard/customers/${id}/edit`,
						active: true,
					},
				]}
			/>
			<CustomerForm customers={customers} />
		</main>
	);
}