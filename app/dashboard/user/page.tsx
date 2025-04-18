import Search from '@/app/ui/search';
import Table from '@/app/ui/user/table';
import { inter } from '@/app/ui/fonts';
import { CreateUser } from '@/app/ui/user/button';

export default async function Page(props: {
  searchParams?: Promise<{
    query?: string;
    page?: string;
  }>
}) {
  const searchParams = await props.searchParams;
  const query = searchParams?.query || '';
  const currentPage = Number(searchParams?.page) || 1;

  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className={`${inter.className} text-2xl`}>User</h1>
      </div>
      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        <Search placeholder="Search user..." />
        <CreateUser />
      </div>
       {/* <Suspense key={query + currentPage} fallback={<CustomerTableSkeleton />}> */}
        <Table query={query} currentPage={currentPage}/>
      {/* </Suspense> */}
    </div>
  );
}