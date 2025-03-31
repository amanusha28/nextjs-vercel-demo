import LoanForm from '@/app/ui/loan/create-form';
import Breadcrumbs from '@/app/ui/customers/breadcrumbs';
 
export default async function Page() {
  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Loan', href: '/dashboard/loan' },
          {
            label: 'Create Loan',
            href: '/dashboard/loan/create',
            active: true,
          },
        ]}
      />
      <LoanForm loan={null} />
    </main>
  );
}