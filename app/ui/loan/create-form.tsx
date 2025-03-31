"use client"

import React, { useEffect, useState } from 'react';
import "react-datepicker/dist/react-datepicker.css";
import { Button } from '../button';
import Link from 'next/link';
import AgentDropdownInput from './agent-dropdown';
import CustomerDropdownInput from './customer-dropdown';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

type LoanData = {
  id?: string;
  generate_id?: string;
  agent_1?: string | null;
  agent_2?: string | null;
  customer_id?: string | null;
  principal_amount?: number | null;
  deposit_amount?: number | null;
  application_fee?: number | null;
  repayment_date?: string | null;
  unit_period?: number | null;
  date_period?: number | null;
  repayment_term?: number | null;
  interest?: number | null;
  amount_given?: number | null;
  interest_amount?: number | null;
  payment_per_term?: number | null;
  loan_remark?: string | null;
  status?: string | null;
  created_at?: string;
  created_by?: string | null;
  [key: string]: any; // Allow additional dynamic properties
};


export default function LoanForm({ loan }: { loan?: any | null }) {
  const [errors, setErrors] = useState<Record<any, any>>({}); // Initialize errors state
  const [formData, setFormData] = useState<LoanData>({
    ...loan,
    repayment_date: loan?.repayment_date || "",
    agent_1: loan?.agent_1 || null,
    agent_2: loan?.agent_2 || null,
    customer_id: loan?.customer_id || null,
  });
  const [selectedDate, setSelectedDate] = useState<Date | null>(
    loan?.repayment_date ? new Date(loan.repayment_date) : null
  );

  const handleDropdownChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form Data:", formData);
    // Add API call logic here
  };


  return (
    <form id="customerForm" onSubmit={handleSubmit} >
      <div>
        {/* Basic Info Section */}
        <div className="rounded-md bg-gray-50 p-4 md:p-6">
        <AgentDropdownInput onChange={(agent1, agent2) => {
          handleDropdownChange("agent_1", agent1);
          handleDropdownChange("agent_2", agent2);
        }}/>
          <CustomerDropdownInput onChange={(customerId) => handleDropdownChange("customer_id", customerId)}/>
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
                <label htmlFor="income_date" className="block text-sm font-medium text-gray-700 mb-1">
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
                  id="income_date"
                  selected={selectedDate}
                  onChange={(date) => {
                    setSelectedDate(date);
                    setFormData((prev) => ({
                      ...prev,
                      income_date: date ? date.toISOString().split('T')[0] : '', // Save as YYYY-MM-DD
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
                  type="text"
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
                  disabled
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
        {/* Submit Button Outside Tabs */}
        <div className="mt-6 flex justify-end gap-4">
          <Link
            href="/dashboard/customers"
            className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
          >
            Cancel
          </Link>
          <Button type="submit" form="customerForm">Save Loan</Button>
        </div>
      </div>
    </form>
  );
}

