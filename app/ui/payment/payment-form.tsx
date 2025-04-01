"use client"

import React, { useState } from 'react';
import "react-datepicker/dist/react-datepicker.css";
import LoanSearchDropdownInput from './loan-search';
import DatePicker from 'react-datepicker';
import { Button } from '../button';
import { getLoanInstallment } from '@/app/lib/actions';
import InstallmentTable from './installment-table';


// Define the tab type
type TabKey = 'installment_listing' | 'payment_listing' | 'loan_sharing';

// Define the tab object type
type TabObject = {
  key: TabKey;
  label: string;
};

// Define the tabs as a Set of TabObject
const tabs: Set<TabObject> = new Set([
  { key: 'installment_listing', label: 'Installment listing' },
  { key: 'payment_listing', label: 'Payment listing' },
  { key: 'loan_sharing', label: 'Loan sharing' }
]);

// Define the form data type
type FormData = {
  due_amount: string;
  status: string;
  installment_date?: string; // Add installment_date as optional
};


// export default function PaymentForm({ loan }: { loan?: any | null }) {
export default function PaymentForm() {
  const [errors, setErrors] = useState<Record<any, any>>({}); // Initialize errors state

  const [installmentData, setInstallmentData] = useState<any>(null);

  // Initialize activeTab with the key of the first tab
  const initialTab = tabs.values().next().value?.key;
  const [activeTab, setActiveTab] = useState<TabKey>(initialTab || 'installment_listing');

  const [selectedDate, setSelectedDate] = useState<Date | null>();

  /** 
   * ====================================
   * Handle Country, State, City
   *=====================================
   */
  // Initialize with default values
  const [formData, setFormData] = useState<FormData>({
    due_amount: '',
    status: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value, // Correctly update the value directly
    }));
  };

  const callInstallmentData = async (loan_id: string) => {
    console.log('callInstallmentData callInstallmentData');
    const _installmentData = await getLoanInstallment(loan_id)
    setInstallmentData(_installmentData);
    // return installmentData;
  }


  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log(formData)
  };

  const handleEditInstallment = async (id: number, formData: any) => {
    // Implement logic to edit installment here
    console.log('handleEditInstallment', id, formData);
  };

  const handleDeleteInstallment = async (id: number) => {
    // Implement logic to delete installment here
    console.log('id', id);
  };

  return (
    <div className="space-y-6">
      {/* Basic Info Section */}
      <div className="rounded-md bg-gray-50 p-6">
        <LoanSearchDropdownInput onChange={(loan_id) => callInstallmentData(loan_id)} />
      </div>

      {/* Tabs Navigation */}
      <div className="border-b">
        <div className="flex space-x-4">
          {["installment_listing", "payment_listing", "loan_sharing"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as TabKey)}
              className={`py-2 px-4 text-sm font-medium border-b-2 transition-all ${activeTab === tab
                ? "border-blue-500 text-blue-600 font-semibold"
                : "border-transparent text-gray-600 hover:text-blue-500"
                }`}
            >
              {tab.replace("_", " ").toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Form Section */}
      <div className="rounded-md bg-gray-50 p-6">
        <form id="paymentForm" onSubmit={handleSubmit}>
          {activeTab === "installment_listing" && (
            <div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Installment Date
                  </label>
                  <DatePicker
                    selected={selectedDate}
                    onChange={(date) => {
                      setSelectedDate(date);
                      setFormData((prev) => ({
                        ...prev,
                        installment_date: date ? date.toISOString().split('T')[0] : '', // Save as YYYY-MM-DD
                      }));
                    }}
                    placeholderText="Select date"
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">Due Amount</label>
                  <input
                    type="text"
                    name="due_amount" // Add this to ensure correct state update
                    placeholder="Due Amount"
                    value={formData.due_amount}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">Status</label>
                  <select
                    name="status" // Add this
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select Status</option>
                    <option value="paid">Paid</option>
                    <option value="unpaid">Unpaid</option>
                    <option value="contra">Contra</option>
                    <option value="void">Void</option>
                    <option value="late">Late</option>
                    <option value="delete">Delete</option>
                  </select>
                </div>
                <div className="col-span-3 flex justify-end mt-4">
                  <Button >Add Installment</Button>
                </div>
              </div>

              <div>
                {
                  installmentData 
                  && 
                  <InstallmentTable
                    itData={installmentData}
                    onEdit={handleEditInstallment}
                    onDelete={handleDeleteInstallment}
                  />
                }
                
              </div>
            </div>
          )}

          {activeTab === "payment_listing" && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div>
                <label className="block text-sm font-medium">Income</label>
                <input
                  type="number"
                  placeholder="Enter income"
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          )}

          {activeTab === "loan_sharing" && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div>
                <label className="block text-sm font-medium">Guarantor Name</label>
                <input
                  type="text"
                  placeholder="Enter guarantor name"
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}

