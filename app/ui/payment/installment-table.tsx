import React, { useState } from 'react';
import EditInstallment from './edit-installment';
import DeleteInstallment from './delete-installment';

interface Installment {
  id: number;
  generate_id: string;
  installment_date: string;
  due_amount: string;
  receiving_date: string;
  accepted_amount: string;
}

interface InstallmentTableProps {
itData: Installment[];
  onEdit: (id: number, formData: Installment) => void;
  onDelete: (id: number) => void;
}

export default function InstallmentTable({ itData, onEdit, onDelete }: InstallmentTableProps) {
    const [editingRow, setEditingRow] = useState<number | null>(null);

    const [installmentData, setInstallmentData] = useState<any>(null);

  
    const handleEdit = (row: Installment): void => {
      setEditingRow(row.id);
    };
  
    interface SaveEditFormData {
      id: number;
      generate_id: string;
      installment_date: string;
      due_amount: string;
      receiving_date: string;
      accepted_amount: string;
      status?: string;
    }

    const handleSaveEdit = (id: number, formData: SaveEditFormData): void => {
      onEdit(id, formData);
      setEditingRow(null);
    };
  
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
                    {itData.map((x) => (
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
                            {editingRow === x.id ? (
                              <input
                                type="text"
                                value={x.due_amount}
                                onChange={(e) => {
                                  const updatedData = itData.map((item) =>
                                    item.id === x.id
                                      ? { ...item, due_amount: e.target.value }
                                      : item
                                  );
                                  setInstallmentData(updatedData);
                                }}
                              />
                            ) : (
                              <p>{x.due_amount}</p>
                            )}
                          </div>
                        </td>
  
                        <td className="whitespace-nowrap bg-white py-5 pl-4 pr-3 text-sm text-black group-first-of-type:rounded-md group-last-of-type:rounded-md sm:pl-6">
                          <div className="flex items-center gap-3">
                            <p>{x.receiving_date}</p>
                          </div>
                        </td>
  
                        <td className="whitespace-nowrap bg-white py-5 pl-4 pr-3 text-sm text-black group-first-of-type:rounded-md group-last-of-type:rounded-md sm:pl-6">
                          <div className="flex items-center gap-3">
                            {editingRow === x.id ? (
                              <select
                                value={x.status}
                                onChange={(e) => {
                                  const updatedData = itData.map((item) =>
                                    item.id === x.id
                                      ? { ...item, status: e.target.value }
                                      : item
                                  );
                                  setInstallmentData(updatedData);
                                }}
                              >
                                <option value="">Select Status</option>
                                <option value="paid">Paid</option>
                                <option value="unpaid">Unpaid</option>
                                <option value="contra">Contra</option>
                                <option value="void">Void</option>
                                <option value="late">Late</option>
                              </select>
                            ) : (
                              <p>{x.status}</p>
                            )}
                          </div>
                        </td>
  
                        <td className="whitespace-nowrap bg-white py-5 pl-4 pr-3 text-sm text-black group-first-of-type:rounded-md group-last-of-type:rounded-md sm:pl-6">
                          <div className="flex items-center gap-3">
                            <p>{x.accepted_amount}</p>
                          </div>
                        </td>
  
                        <td className="whitespace-nowrap bg-white py-5 pl-4 pr-3 text-sm text-black group-first-of-type:rounded-md group-last-of-type:rounded-md sm:pl-6">
                          <div className="flex items-center gap-3">
                            {editingRow === x.id ? (
                              <button onClick={() => handleSaveEdit(x.id, x)}>Save</button>
                            ) : (
                              <button onClick={() => handleEdit(x)}>Edit</button>
                            )}
                            <DeleteInstallment row={x} onDelete={onDelete} />
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