import { fetchLoan } from '@/app/lib/data';
import Pagination from './pagination';
import { DeleteLoan, UpdateLoan } from './buttons';

export default async function LoanTable({
  query,
  currentPage,
  pageSize = 5,
}: {
  query: string;
  currentPage: number;
  pageSize?: number;
}) {
  const payload = { query, currentPage, pageSize }
  const { totalLoan, loan }: { totalLoan: number; loan: { id: string; generate_id: string; customer?: { name: string }; user_loan_agent_1Touser?: { name: string }; user_loan_agent_2Touser?: { name: string }; deposit_amount: number | null }[] } = await fetchLoan(payload);
  const paginationNo = Math.ceil(totalLoan / pageSize);

  return (
    <div className="w-full">
      <div className="mt-6 flow-root">
        <div className="overflow-x-auto">
          <div className="inline-block min-w-full align-middle">
            <div className="overflow-hidden rounded-md bg-gray-50 p-2 md:pt-0">
              <div className="md:hidden">
                {/* mobile table */}
              </div>
              <table className="hidden min-w-full rounded-md text-gray-900 md:table">
                <thead className="rounded-md bg-gray-50 text-left text-sm font-normal">
                  <tr>
                    <th scope="col" className="px-3 py-5 font-mediums">
                      ID
                    </th>
                    <th scope="col" className="px-3 py-5 font-mediums">
                      customer name
                    </th>
                    <th scope="col" className="px-3 py-5 font-mediums">
                      First Agent
                    </th>
                    <th scope="col" className="px-3 py-5 font-mediums">
                      Second Agent
                    </th>
                    <th scope="col" className="px-3 py-5 font-mediums">
                      Deposit Amount
                    </th>
                    <th scope="col" className="px-3 py-5 font-mediums">
                      ...
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-200 text-gray-900">
                  {loan.map((x) => (
                    <tr key={x.id} className="group">
                      <td className="whitespace-nowrap bg-white py-5 pl-4 pr-3 text-sm text-black group-first-of-type:rounded-md group-last-of-type:rounded-md sm:pl-6">
                        <div className="flex items-center gap-3">
                          <p>{x.generate_id}</p>
                        </div>
                      </td>

                      <td className="whitespace-nowrap bg-white py-5 pl-4 pr-3 text-sm text-black group-first-of-type:rounded-md group-last-of-type:rounded-md sm:pl-6">
                        <div className="flex items-center gap-3">
                          <p>{x.customer?.name}</p>
                        </div>
                      </td>

                      <td className="whitespace-nowrap bg-white py-5 pl-4 pr-3 text-sm text-black group-first-of-type:rounded-md group-last-of-type:rounded-md sm:pl-6">
                        <div className="flex items-center gap-3">
                          <p>{x.user_loan_agent_1Touser?.name}</p>
                        </div>
                      </td>

                      <td className="whitespace-nowrap bg-white py-5 pl-4 pr-3 text-sm text-black group-first-of-type:rounded-md group-last-of-type:rounded-md sm:pl-6">
                        <div className="flex items-center gap-3">
                          <p>{x.user_loan_agent_2Touser?.name}</p>
                        </div>
                      </td>

                      <td className="whitespace-nowrap bg-white py-5 pl-4 pr-3 text-sm text-black group-first-of-type:rounded-md group-last-of-type:rounded-md sm:pl-6">
                        <div className="flex items-center gap-3">
                          <p>{x.deposit_amount}</p>
                        </div>
                      </td>

                      <td className="whitespace-nowrap bg-white py-5 pl-4 pr-3 text-sm text-black group-first-of-type:rounded-md group-last-of-type:rounded-md sm:pl-6">
                      <div className="flex items-center gap-3">
                        <UpdateLoan id={x.id} />
                        <DeleteLoan id={x.id} />
                      </div>
                      </td>
                      
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-5 flex w-full justify-center">
        <Pagination totalPages={paginationNo} />
      </div>
    </div>
  );
}
