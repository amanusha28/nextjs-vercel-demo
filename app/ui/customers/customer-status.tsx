import { fetchCurrentUserCustomer } from '@/app/lib/data';
import Pagination from './pagination';
import { DeleteCustomer, UpdateCustomer } from './buttons';

export default async function CustomersStatusTable({
  query,
  currentPage,
  pageSize = 5,
}: {
  query: string;
  currentPage: number;
  pageSize?: number;
}) {
  const payload = { query, currentPage, pageSize }
  const { data } = await fetchCurrentUserCustomer(payload);
  console.log('customersWithLoans ->', data)
  // const paginationNo = Math.ceil(total / pageSize);

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
                      Customer ID
                    </th>
                    <th scope="col" className="px-3 py-5 font-mediums">
                      Customer name
                    </th>
                    <th scope="col" className="px-3 py-5 font-mediums">
                      Loan Id
                    </th>
                    <th scope="col" className="px-3 py-5 font-mediums">
                      Agant 1
                    </th>
                    <th scope="col" className="px-3 py-5 font-mediums">
                      Agant 2
                    </th>
                    <th scope="col" className="px-3 py-5 font-mediums">
                      Loan Status
                    </th>
                    <th scope="col" className="px-3 py-5 font-mediums">
                      Installment Id
                    </th>
                    <th scope="col" className="px-3 py-5 font-mediums">
                      Installment Date
                    </th>
                    <th scope="col" className="px-3 py-5 font-mediums">
                      Installment Status
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-200 text-gray-900">
                  {data.map((customer) => (
                    <tr key={customer.c_id} className="group">
                      
                      <td className="whitespace-nowrap bg-white py-5 pl-4 pr-3 text-sm text-black group-first-of-type:rounded-md group-last-of-type:rounded-md sm:pl-6">
                        <div className="flex items-center gap-3">
                          <p>{customer.customer_generate_id}</p>
                        </div>
                      </td>

                      <td className="whitespace-nowrap bg-white py-5 pl-4 pr-3 text-sm text-black group-first-of-type:rounded-md group-last-of-type:rounded-md sm:pl-6">
                        <div className="flex items-center gap-3">
                          <p>{customer.customer_name}</p>
                        </div>
                      </td>

                      <td className="whitespace-nowrap bg-white py-5 pl-4 pr-3 text-sm text-black group-first-of-type:rounded-md group-last-of-type:rounded-md sm:pl-6">
                        <div className="flex items-center gap-3">
                          <p>{customer.loan_generate_id}</p>
                        </div>
                      </td>

                      <td className="whitespace-nowrap bg-white py-5 pl-4 pr-3 text-sm text-black group-first-of-type:rounded-md group-last-of-type:rounded-md sm:pl-6">
                        <div className="flex items-center gap-3">
                          <p>{customer.agent_1_name}</p>
                        </div>
                      </td>

                      <td className="whitespace-nowrap bg-white py-5 pl-4 pr-3 text-sm text-black group-first-of-type:rounded-md group-last-of-type:rounded-md sm:pl-6">
                        <div className="flex items-center gap-3">
                          <p>{customer.agent_2_name}</p>
                        </div>
                      </td>

                      <td className="whitespace-nowrap bg-white py-5 pl-4 pr-3 text-sm text-black group-first-of-type:rounded-md group-last-of-type:rounded-md sm:pl-6">
                        <div className="flex items-center gap-3">
                          <p>{customer.loan_status}</p>
                        </div>
                      </td>

                      <td className="whitespace-nowrap bg-white py-5 pl-4 pr-3 text-sm text-black group-first-of-type:rounded-md group-last-of-type:rounded-md sm:pl-6">
                        <div className="flex items-center gap-3">
                          <p>{customer.installment_generate_id}</p>
                        </div>
                      </td>

                      <td className="whitespace-nowrap bg-white py-5 pl-4 pr-3 text-sm text-black group-first-of-type:rounded-md group-last-of-type:rounded-md sm:pl-6">
                        <div className="flex items-center gap-3">
                          <p>{customer.installment_date}</p>
                        </div>
                      </td>

                      <td className="whitespace-nowrap bg-white py-5 pl-4 pr-3 text-sm text-black group-first-of-type:rounded-md group-last-of-type:rounded-md sm:pl-6">
                        <div className="flex items-center gap-3">
                          <p>{customer.installment_status}</p>
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
        {/* <Pagination totalPages={paginationNo} /> */}
      </div>
    </div>
  );
}
