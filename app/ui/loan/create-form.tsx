"use client"

import React, { useEffect, useState } from 'react';
import "react-datepicker/dist/react-datepicker.css";
import { Button } from '../button';
import Link from 'next/link';
import AgentDropdownInput from './agent-dropdown';
import CustomerDropdownInput from './customer-dropdown';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { createLoan, fetchUniqueNumber, updateLoan } from "@/app/lib/actions";

type LoanData = {
  id?: string;
  generate_id?: any;
  agent_1?: string | null;
  agent_2?: string | null;
  customer_id?: string | null;
  principal_amount?: string | null;
  deposit_amount?: string | null;
  application_fee?: string | null;
  repayment_date?: string | null;
  unit_period?: string | null;  // Ensure consistent naming
  date_period?: string | null;   // Match backend type
  repayment_term?: string | null;
  interest?: string | null;
  amount_given?: string | null;
  interest_amount?: string | null;
  payment_per_term?: string | null;
  loan_remark?: string | null;
  status?: string | null;
  created_at?: any;
  created_by?: string;
  supervisor?: string | null;
  supervisor_2?: string | null;
  [key: string]: any;
};


export default function LoanForm({ loan }: { loan?: any | null }) {
  const [errors, setErrors] = useState<Record<any, any>>({}); // Initialize errors state

  const [isDisabled, setIsDisabled] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const [formData, setFormData] = useState<LoanData>({
    ...loan,
    repayment_date: loan?.repayment_date || null, // Ensuring consistency
    agent_1: loan?.user_loan_agent_1Touser?.id || null, // Access nested agent ID
    agent_2: loan?.user_loan_agent_2Touser?.id || null, // Access nested agent ID
    customer_id: loan?.customer.id || null,
    unit_period: loan?.unit_period || null, // Ensuring type consistency
    date_period: loan?.date_period || null, // Ensuring type consistency
    repayment_term: loan?.repayment_term || null, // Ensuring type consistency
  });
  const [selectedDate, setSelectedDate] = useState<Date | null>(
    loan?.repayment_date ? new Date(loan.repayment_date) : null
  );

  const handleDropdownChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };
  
  // Function to update calculated values
  const updateCalculatedValues = () => {
    const principal_amount = formData.principal_amount ?? 0;
    const deposit_amount = formData.deposit_amount ?? 0;
    const application_fee = formData.application_fee ?? 0;
    const interest = formData.interest ?? 0;
    const repayment_term = formData.repayment_term ?? 0;
  
    if (Number(repayment_term) > 0) {
      const amount_given = Number(principal_amount) - Number(deposit_amount) - Number(application_fee);
      const interest_amount = Number(principal_amount) * (Number(interest) / 100) * Number(repayment_term);
      const payment_per_term = (Number(principal_amount) - Number(deposit_amount)) / Number(repayment_term);
  
      setFormData((prev) => ({
        ...prev,
        amount_given: amount_given.toString(),
        interest_amount: interest_amount.toString(),
        payment_per_term: payment_per_term.toString(),
      }));
    }
  };
  // Use useEffect to recalculate values when relevant form data changes
  useEffect(() => {
    updateCalculatedValues();
  }, [formData.principal_amount, formData.deposit_amount, formData.application_fee, formData.interest, formData.repayment_term]);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsDisabled(true); // Disable the button after submission

    // Simulate an async operation (e.g., API call)
    // setTimeout(() => {
    //   console.log('Form submitted successfully!');
    //   setIsDisabled(false); // Re-enable the button after completion
    // }, 3000); // Example delay of 3 seconds

    delete formData.customer
    delete formData.user_loan_agent_1Touser
    delete formData.user_loan_agent_2Touser

    if (loan?.id) {
      const result = await updateLoan(loan.id, formData);
      // if (result) {
        console.log('Loan Created', result)
    }else {
      // get custom id
      const loId =await fetchUniqueNumber('LO');
      const result = await createLoan({...formData, generate_id: loId});
      console.log('Loan Created', result)
    }
    setSuccessMessage("Loan Created!");
    setIsDisabled(false)
  };


  return (
    <form id="customerForm" onSubmit={handleSubmit} >
      <div>
        {/* Basic Info Section */}
        <div className="rounded-md bg-gray-50 p-4 md:p-6">
        <AgentDropdownInput 
        onChange={(agent1, agent2) => {
          handleDropdownChange("agent_1", agent1);
          handleDropdownChange("agent_2", agent2);
        }}
        initialAgent1={loan?.user_loan_agent_1Touser?.id || null}
        initialAgent2={loan?.user_loan_agent_2Touser?.id || null}
        />
          <CustomerDropdownInput 
          onChange={(customer_id) => handleDropdownChange("customer_id", customer_id)}
          initialCustomer={loan?.customer.id || null}
          />
          <div className="space-y-2">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 gap-y-6">

              {/* principal_amount */}
              <div className="space-y-2">
                <label htmlFor="principal_amount" className="mb-2 block text-sm font-medium">
                  Principal Amount
                </label>
                <input
                  id="principal_amount"
                  name="principal_amount"
                  type="text"
                  placeholder="Principal Amount"
                  value={formData?.principal_amount ?? ''}
                  onChange={(e) => {
                    setFormData((prev: LoanData) => ({
                      ...prev,
                      [e.target.name]: e.target.value || '', // Ensure controlled behavior
                    }));
                  }}
                  className={`block w-full rounded-md border ${errors?.name ? 'border-red-500' : 'border-gray-200'
                    } py-2 px-3 text-sm outline-2 placeholder:text-gray-500`}

                />
                {errors?.name?.[0] && (
                  <p className="text-red-500 text-xs mt-1">{errors.name[0]}</p>
                )}

              </div>

              {/* deposit_amount */}
              <div className="space-y-2">
                <label htmlFor="deposit_amount" className="mb-2 block text-sm font-medium">
                  Deposit Amount
                </label>
                <input
                  id="deposit_amount"
                  name="deposit_amount"
                  type="text"
                  placeholder="Deposit Amount"
                  value={formData?.deposit_amount ?? ''}
                  onChange={(e) => {
                    setFormData((prev: LoanData) => ({
                      ...prev,
                      [e.target.name]: e.target.value || '', // Ensure controlled behavior
                    }));
                  }}
                  className={`block w-full rounded-md border ${errors?.name ? 'border-red-500' : 'border-gray-200'
                    } py-2 px-3 text-sm outline-2 placeholder:text-gray-500`}

                />
                {errors?.name?.[0] && (
                  <p className="text-red-500 text-xs mt-1">{errors.name[0]}</p>
                )}
              </div>

              {/* application_fee */}
              <div className="space-y-2">
                <label htmlFor="application_fee" className="mb-2 block text-sm font-medium">
                  Application fee
                </label>
                <input
                  id="application_fee"
                  name="application_fee"
                  type="text"
                  placeholder="Application fee"
                  value={formData?.application_fee ?? ''}
                  onChange={(e) => {
                    setFormData((prev: LoanData) => ({
                      ...prev,
                      [e.target.name]: e.target.value || '', // Ensure controlled behavior
                    }));
                  }}
                  className={`block w-full rounded-md border ${errors?.name ? 'border-red-500' : 'border-gray-200'
                    } py-2 px-3 text-sm outline-2 placeholder:text-gray-500`}

                />
                {errors?.name?.[0] && (
                  <p className="text-red-500 text-xs mt-1">{errors.name[0]}</p>
                )}
              </div>

              {/* repayment_date */}
              <div className="relative max-w-sm space-y-2">
                <label htmlFor="repayment_date" className="block text-sm font-medium text-gray-700 mb-1">
                  Income Date
                </label>
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <svg
                    className="w-4 h-4 text-gray-500"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M20 4a2 2 0 0 0-2-2h-2V1a1 1 0 0 0-2 0v1h-3V1a1 1 0 0 0-2 0v1H6V1a1 1 0 0 0-2 0v1H2a2 2 0 0 0-2 2v2h20V4ZM0 18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8H0v10Zm5-8h10a1 1 0 0 1 0 2H5a1 1 0 0 1 0-2Z" />
                  </svg>
                </div>
                <DatePicker
                  id="repayment_date"
                  selected={selectedDate}
                  onChange={(date) => {
                    setSelectedDate(date);
                    setFormData((prev) => ({
                      ...prev,
                      repayment_date: date ? date.toISOString().split('T')[0] : '', // Save as YYYY-MM-DD
                    }));
                  }}
                  placeholderText="Select date"
                  className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5"
                />
              </div>

              <div> 
                <label htmlFor="unit_period" className="mb-2 block text-sm font-medium">
                 Unit period
                </label>
                <select
                  id="unit_period"
                  name="unit_period"
                  value={formData.unit_period || ''}
                  onChange={(e) => {
                    setFormData((prev: LoanData) => ({
                      ...prev,
                      [e.target.name]: e.target.value || '', // Ensure controlled behavior
                    }));
                  }}
                  className="block w-full rounded-md border border-gray-200 py-2 px-3 text-sm outline-2 placeholder:text-gray-500"
                >
                  <option value="">Select Status</option>
                  <option value="day">Day</option>
                  <option value="week">Week</option>
                  <option value="month">Month</option>
                  <option value="year">Year</option>
                </select>
              </div>

              {/* date_period */}
              <div className="space-y-2">
                <label htmlFor="date_period" className="mb-2 block text-sm font-medium">
                  Date period
                </label>
                <input
                  id="date_period"
                  name="date_period"
                  type="text"
                  placeholder="Date period"
                  value={formData?.date_period ?? ''}
                  onChange={(e) => {
                    setFormData((prev: LoanData) => ({
                      ...prev,
                      [e.target.name]: e.target.value || '', // Ensure controlled behavior
                    }));
                  }}
                  className={`block w-full rounded-md border ${errors?.name ? 'border-red-500' : 'border-gray-200'
                    } py-2 px-3 text-sm outline-2 placeholder:text-gray-500`}

                />
                {errors?.name?.[0] && (
                  <p className="text-red-500 text-xs mt-1">{errors.name[0]}</p>
                )}
              </div>

              {/* repayment_term */}
              <div className="space-y-2">
                <label htmlFor="repayment_term" className="mb-2 block text-sm font-medium">
                  Repayment term
                </label>
                <input
                  id="repayment_term"
                  name="repayment_term"
                  type="int"
                  placeholder="Repayment term"
                  value={formData?.repayment_term ?? ''}
                  onChange={(e) => {
                    setFormData((prev: LoanData) => ({
                      ...prev,
                      [e.target.name]: e.target.value || '', // Ensure controlled behavior
                    }));
                  }}
                  className={`block w-full rounded-md border ${errors?.name ? 'border-red-500' : 'border-gray-200'
                    } py-2 px-3 text-sm outline-2 placeholder:text-gray-500`}

                />
                {errors?.name?.[0] && (
                  <p className="text-red-500 text-xs mt-1">{errors.name[0]}</p>
                )}
              </div>

              {/* interest */}
              <div className="space-y-2">
                <label htmlFor="interest" className="mb-2 block text-sm font-medium">
                  interest
                </label>
                <input
                  id="interest"
                  name="interest"
                  type="text"
                  placeholder="interest"
                  value={formData?.interest ?? ''}
                  onChange={(e) => {
                    setFormData((prev: LoanData) => ({
                      ...prev,
                      [e.target.name]: e.target.value || '', // Ensure controlled behavior
                    }));
                  }}
                  className={`block w-full rounded-md border ${errors?.name ? 'border-red-500' : 'border-gray-200'
                    } py-2 px-3 text-sm outline-2 placeholder:text-gray-500`}

                />
                {errors?.name?.[0] && (
                  <p className="text-red-500 text-xs mt-1">{errors.name[0]}</p>
                )}
              </div>

              {/* amount_given */}
              <div className="space-y-2">
                <label htmlFor="amount_given" className="mb-2 block text-sm font-medium">
                  Amount Given
                </label>
                <input
                  id="amount_given"
                  name="amount_given"
                  type="text"
                  disabled
                  placeholder="Amount given"
                  value={formData?.amount_given ?? ''}
                  onChange={(e) => {
                    setFormData((prev: LoanData) => ({
                      ...prev,
                      [e.target.name]: e.target.value || '', // Ensure controlled behavior
                    }));
                  }}
                  className={`block w-full rounded-md border ${errors?.name ? 'border-red-500' : 'border-gray-200'
                    } py-2 px-3 text-sm outline-2 placeholder:text-gray-500`}

                />
                {errors?.name?.[0] && (
                  <p className="text-red-500 text-xs mt-1">{errors.name[0]}</p>
                )}
              </div>
              {/* interest_amount */}
              <div className="space-y-2">
                <label htmlFor="interest_amount" className="mb-2 block text-sm font-medium">
                  Interest Amount
                </label>
                <input
                  id="interest_amount"
                  name="interest_amount"
                  type="text"
                  disabled
                  placeholder="Interest Amount"
                  value={formData?.interest_amount ?? ''}
                  onChange={(e) => {
                    setFormData((prev: LoanData) => ({
                      ...prev,
                      [e.target.name]: e.target.value || '', // Ensure controlled behavior
                    }));
                  }}
                  className={`block w-full rounded-md border ${errors?.name ? 'border-red-500' : 'border-gray-200'
                    } py-2 px-3 text-sm outline-2 placeholder:text-gray-500`}

                />
                {errors?.name?.[0] && (
                  <p className="text-red-500 text-xs mt-1">{errors.name[0]}</p>
                )}
              </div>
              {/* payment_per_term */}
              <div className="space-y-2">
                <label htmlFor="payment_per_term" className="mb-2 block text-sm font-medium">
                  Payment per term
                </label>
                <input
                  id="payment_per_term"
                  name="payment_per_term"
                  type="text"
                  disabled
                  placeholder="Payment per term"
                  value={formData?.payment_per_term ?? ''}
                  onChange={(e) => {
                    setFormData((prev: LoanData) => ({
                      ...prev,
                      [e.target.name]: e.target.value || '', // Ensure controlled behavior
                    }));
                  }}
                  className={`block w-full rounded-md border ${errors?.name ? 'border-red-500' : 'border-gray-200'
                    } py-2 px-3 text-sm outline-2 placeholder:text-gray-500`}

                />
                {errors?.name?.[0] && (
                  <p className="text-red-500 text-xs mt-1">{errors.name[0]}</p>
                )}
              </div>
              {/* loan_remark */}
              <div className="space-y-2">
                <label htmlFor="loan_remark" className="mb-2 block text-sm font-medium">
                  Loan remark
                </label>
                <input
                  id="loan_remark"
                  name="loan_remark"
                  type="text"
                  placeholder="Loan Remark"
                  value={formData?.loan_remark ?? ''}
                  onChange={(e) => {
                    setFormData((prev: LoanData) => ({
                      ...prev,
                      [e.target.name]: e.target.value || '', // Ensure controlled behavior
                    }));
                  }}
                  className={`block w-full rounded-md border ${errors?.name ? 'border-red-500' : 'border-gray-200'
                    } py-2 px-3 text-sm outline-2 placeholder:text-gray-500`}

                />
                {errors?.name?.[0] && (
                  <p className="text-red-500 text-xs mt-1">{errors.name[0]}</p>
                )}
              </div>
              {/* status */}
              <div>
                <label htmlFor="status" className="mb-2 block text-sm font-medium">
                  Status
                </label>
                <select
                  id="status"
                  name="status"
                  value={formData.status || ''}
                  onChange={(e) => {
                    setFormData((prev: LoanData) => ({
                      ...prev,
                      [e.target.name]: e.target.value || '', // Ensure controlled behavior
                    }));
                  }}
                  className="block w-full rounded-md border border-gray-200 py-2 px-3 text-sm outline-2 placeholder:text-gray-500"
                >
                  <option value="">Select Status</option>
                  <option value="normal">Normal</option>
                  <option value="bad_debt">Bad Debt</option>
                  <option value="bad_debt_completed">Bad Debt Completed</option>
                </select>
              </div>

            </div>
          </div>
        </div>
        {/* Success Message */}
				{successMessage && (
					<div className="mb-4 rounded-lg bg-green-100 p-3 text-green-700">
						{successMessage}
					</div>
				)}
        {/* Submit Button Outside Tabs */}
        <div className="mt-6 flex justify-end gap-4">
          <Link
            href="/dashboard/customers"
            className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
          >
            Cancel
          </Link>
          <Button type="submit" form="customerForm"  disabled={isDisabled}>{isDisabled ? 'Submitting...' : 'Save Loan'}</Button>
        </div>
      </div>
    </form>
  );
}

