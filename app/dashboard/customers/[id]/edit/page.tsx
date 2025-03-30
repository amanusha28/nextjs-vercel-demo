import Breadcrumbs from '@/app/ui/customers/breadcrumbs';
import { fetchCustomerById } from '@/app/lib/data';
import CustomerForm from '@/app/ui/customers/create-form';
import { notFound } from 'next/navigation';

export default async function Page(props: { params: Promise<{ id: string }> }) {
	const params = await props.params;
	const id = params.id;
	const customers = await fetchCustomerById(id);
	// console.log('*********** customers in the edit page **********', customers);
	if (!customers) {
		notFound();
	}
	return (
		<main>
			<Breadcrumbs
				breadcrumbs={[
					{ label: 'Customer', href: '/dashboard/customers' },
					{
						label: 'Edit Customer',
						href: `/dashboard/customers/${id}/edit`,
						active: true,
					},
				]}
			/>
			<CustomerForm customers={customers} />
		</main>
	);
}