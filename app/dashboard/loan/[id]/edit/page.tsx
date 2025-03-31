import { fetchLoanById } from '@/app/lib/data';
import Breadcrumbs from '@/app/ui/loan/breadcrumbs';
import LoanForm from '@/app/ui/loan/create-form';
import { notFound } from 'next/navigation';

export default async function Page(props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    const id = params.id;
    const loan = await fetchLoanById(id);
    // console.log('*********** customers in the edit page **********', customers);
    if (!loan) {
        notFound();
    }
    return (
        <main>
            <Breadcrumbs
                breadcrumbs={[
                    { label: 'Loan', href: '/dashboard/loan' },
                    {
                        label: 'Edit Loan',
                        href: `/dashboard/loan/${id}/edit`,
                        active: true,
                    },
                ]}
            />
            <LoanForm loan={loan} />
        </main>
    );
}
