import CustomerForm from '@/app/ui/customers/create-form';
import { inter } from '@/app/ui/fonts';

export default async function Page() {
	return (
		<main>
			<div className="w-full">
				<div className="flex w-full items-center justify-between">
					<h1 className={`${inter.className} text-2xl`}>Loan</h1>
				</div>
			</div>
			<CustomerForm customers={null} />
		</main>
	);
}