"use client"
export default function InstallmentTable({ installmentData }: { installmentData: any }) {
  return (
    <div className="w-full">
      <div className="mt-6 flow-root">
        <div className="overflow-x-auto">
          <div className="inline-block min-w-full align-middle">
            <div className="overflow-hidden rounded-md bg-gray-50 p-2 md:pt-0">
              <table className="hidden min-w-full rounded-md text-gray-900 md:table">
                <thead className="rounded-md bg-gray-50 text-left text-sm font-normal">
                  <tr>
                    <th scope="col" className="px-3 py-5 font-mediums">
                      Installment id
                    </th>
                    <th scope="col" className="px-3 py-5 font-mediums">
                      Installment Date
                    </th>
                    <th scope="col" className="px-3 py-5 font-mediums">
                      Due amount
                    </th>
                    <th scope="col" className="px-3 py-5 font-mediums">
                      Receiving Date
                    </th>
                    <th scope="col" className="px-3 py-5 font-mediums">
                      Status
                    </th>
                    <th scope="col" className="px-3 py-5 font-mediums">
                      Accepted amount
                    </th>
                    <th scope="col" className="px-3 py-5 font-mediums">
                      ...
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-200 text-gray-900">
                  {installmentData.map((x:any) => (
                    <tr key={x.id} className="group">
                      <td className="whitespace-nowrap bg-white py-5 pl-4 pr-3 text-sm text-black group-first-of-type:rounded-md group-last-of-type:rounded-md sm:pl-6">
                        <div className="flex items-center gap-3">
                          <p>{x.generate_id}</p>
                        </div>
                      </td>

                      <td className="whitespace-nowrap bg-white py-5 pl-4 pr-3 text-sm text-black group-first-of-type:rounded-md group-last-of-type:rounded-md sm:pl-6">
                        <div className="flex items-center gap-3">
                          <p>{x.installment_date}</p>
                        </div>
                      </td>

                      <td className="whitespace-nowrap bg-white py-5 pl-4 pr-3 text-sm text-black group-first-of-type:rounded-md group-last-of-type:rounded-md sm:pl-6">
                        <div className="flex items-center gap-3">
                          <p>{x.due_amount}</p>
                        </div>
                      </td>

                      <td className="whitespace-nowrap bg-white py-5 pl-4 pr-3 text-sm text-black group-first-of-type:rounded-md group-last-of-type:rounded-md sm:pl-6">
                        <div className="flex items-center gap-3">
                          <p>{x.receiving_date}</p>
                        </div>
                      </td>

                      <td className="whitespace-nowrap bg-white py-5 pl-4 pr-3 text-sm text-black group-first-of-type:rounded-md group-last-of-type:rounded-md sm:pl-6">
                        <div className="flex items-center gap-3">
                          <p>{x.status}</p>
                        </div>
                      </td>

                      <td className="whitespace-nowrap bg-white py-5 pl-4 pr-3 text-sm text-black group-first-of-type:rounded-md group-last-of-type:rounded-md sm:pl-6">
                        <div className="flex items-center gap-3">
                          <p>{x.accepted_amount}</p>
                        </div>
                      </td>

                      <td className="whitespace-nowrap bg-white py-5 pl-4 pr-3 text-sm text-black group-first-of-type:rounded-md group-last-of-type:rounded-md sm:pl-6">
                      <div className="flex items-center gap-3">
                        {/* <UpdateInstallment row={x} />
                        <DeleteInstallment row={x} /> */}
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
    </div>
  );
}
