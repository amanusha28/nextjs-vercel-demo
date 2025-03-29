"use client"

import React, { useEffect, useState } from 'react';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Button } from '../button';
import { createCustomer, updateCustomer } from '@/app/lib/actions';
import Link from 'next/link';
import { CustomerField } from '@/app/lib/definitions';
import { customerFormValidation, transformError } from '@/app/lib/validation';


// Define the tab type
type TabKey = 'customer_address' | 'employment' | 'relations' | 'bank_details' | 'documents';

// Define the tab object type
type TabObject = {
  key: TabKey;
  label: string;
};

// Define the tabs as a Set of TabObject
const tabs: Set<TabObject> = new Set([
  { key: 'customer_address', label: 'Address' },
  { key: 'employment', label: 'Employment & Company' },
  { key: 'relations', label: 'Family & Guarantor' },
  { key: 'bank_details', label: 'Banking' },
  { key: 'documents', label: 'Documents' },
  // { key: 'remarks', label: 'Remarks' },
]);

// Define the form data type
type FormData = {
  name: string;
  ic: string;
  passport: string;
  race: string;
  gender: string;
  marital_status: string;
  no_of_child: string;
  car_plate: string;
  mobile_no: string;
  status: string;
  customer_address: Record<string, any>;

  employment: { income: string; business_type: string; department: string; employee_no: string; income_date: string; occupation_category: string; position: string; telephone_no: string; employment_remarks: string; };
  
  relations: { id?: any; guarantor_name: string; guarantor_ic: string; guarantor_contact_number: string; guarantor_relationship: string; }[];
  guarantor_name: string;
  guarantor_ic: string;
  guarantor_contact_number: string;
  guarantor_relationship: string;
  
  bank_details: { id?: any; bank_name: string; bank_account_no: string; bank_account_holder: string; bank_card_no: string; bank_card_pin: string; bank_remark: string; }[];
  bank_name: string;
  bank_account_no: string;
  bank_account_holder: string;
  bank_card_no: string;
  bank_card_pin: string;
  bank_remark: string;
  
  documents: Record<string, any>;
  
  // remarks: { id?: any; customer_remark: string; created_at: any; updated_at: string }[];
  // customer_remark: string; // Add this optional field for temporary input

};

export default function CustomerForm({ customers }: { customers?: CustomerField | null }) {
  console.log('customers ============= ', customers);

  const [errors, setErrors] = useState<Record<any,any>>({}); // Initialize errors state
  
  // Initialize activeTab with the key of the first tab
  const initialTab = tabs.values().next().value?.key;
  const [activeTab, setActiveTab] = useState<TabKey>(initialTab || 'customer_address');

  const [sameAsPermanent, setSameAsPermanent] = useState(false);
  
  const [selectedDate, setSelectedDate] = useState<Date | null>(
    customers?.employment?.income_date ? new Date(customers.employment.income_date) : null
  );
  // Ensure `selectedDate` updates when `customers` data changes
  useEffect(() => {
    if (customers?.employment?.income_date) {
      setSelectedDate(new Date(customers.employment.income_date));
    }
  }, [customers]);

  console.log('selectedDate ============= ', selectedDate);

  const [formData, setFormData] = useState<FormData>({
    name: customers?.name || '',
    ic: customers?.ic || '',
    passport: customers?.passport || '',
    race: customers?.race || '',
    gender: customers?.gender || '',
    marital_status: customers?.marital_status || '',
    no_of_child: customers?.no_of_child?.toString() || '',
    car_plate: customers?.car_plate || '',
    mobile_no: customers?.mobile_no || '',
    status: customers?.status || '',
    customer_address: customers?.customer_address || {},
    
    employment: {
      income: customers?.employment?.income || '',
      business_type: customers?.employment?.business_type || '',
      department: customers?.employment?.department || '',
      employee_no: customers?.employment?.employee_no || '',
      income_date: customers?.employment?.income_date || '',
      occupation_category: customers?.employment?.occupation_category || '',
      position: customers?.employment?.position || '',
      telephone_no: customers?.employment?.telephone_no || '',
      employment_remarks: customers?.employment?.employment_remarks || '',
    },
    
    relations: customers?.relations?.map((relation) => ({
      id: relation.id || null,
      guarantor_name: relation.guarantor_name || '',
      guarantor_ic: relation.guarantor_ic || '',
      guarantor_contact_number: relation.guarantor_contact_number || '',
      guarantor_relationship: relation.guarantor_relationship || '',
    })) || [],
    

    bank_details: customers?.bank_details?.map((bank) => ({
      id: bank.id || null,
      bank_name: bank.bank_name || '',
      bank_account_no: bank.bank_account_no || '',
      bank_account_holder: bank.bank_account_holder || '',
      bank_card_no: bank.bank_card_no || '',
      bank_card_pin: bank.bank_card_pin || '',
      bank_remark: bank.bank_remark || '',
    })) || [],

    documents: customers?.documents || [],

    // remarks: customers?.remarks?.map((remark) => {
    //   return {
    //     id: remark.id || null,
    //     customer_remark: remark.customer_remark || '',
    //     created_at: remark.created_at || '',
    //     updated_at: remark.updated_at || '',
    //   };
    // }) || [],

    guarantor_name: '',
    guarantor_ic: '',
    guarantor_contact_number: '',
    guarantor_relationship: '',

    bank_name: '',
    bank_account_no: '',
    bank_account_holder: '',
    bank_card_no: '',
    bank_card_pin: '',
    bank_remark: '',

    // customer_remark: '', // Add this optional field for temporary input
  });
  // console.log('========= formData ============= ', formData);

  // Handle input changes dynamically based on active tab
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [activeTab]: {
        ...prev[activeTab],
        [name]: value || '', // Ensure the value is always a string
      },
    }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Submitted Data:', formData);

    const submitter = (e.nativeEvent as SubmitEvent).submitter as HTMLButtonElement;
    console.log('Submitter Button ID:', submitter?.id);

    // Handle the Customer Relations (Family & Guarantor) form
    if (submitter?.id === "addGuaranter") {
      await setFormData((prev) => ({
        ...prev,
        relations: [
          ...(Array.isArray(prev.relations) ? prev.relations : []),
          {
            id: 'temp-id',
            guarantor_ic: prev.guarantor_ic,
            guarantor_name: prev.guarantor_name,
            guarantor_contact_number: prev.guarantor_contact_number,
            guarantor_relationship: prev.guarantor_relationship,
          },
        ],
        // Reset input fields after adding
        guarantor_name: "",
        guarantor_ic: "",
        guarantor_contact_number: "",
        guarantor_relationship: "",
      }));
  
      // console.log("Updated formData.relations: ", formData.relations);
      return;
    }

    // Handle the Bank Details form
    if (submitter?.id === "addBankDetails") {
      await setFormData((prev) => ({
        ...prev,
        bank_details: [
          ...(Array.isArray(prev.bank_details) ? prev.bank_details : []),
          {
            id: 'temp-id',
            bank_name: prev.bank_name,
            bank_account_no: prev.bank_account_no,
            bank_account_holder: prev.bank_account_holder,
            bank_card_no: prev.bank_card_no,
            bank_card_pin: prev.bank_card_pin,
            bank_remark: prev.bank_remark,
          },
        ],
        // Reset input fields after adding
        bank_name: "",
        bank_account_no: "",
        bank_account_holder: "",
        bank_card_no: "",
        bank_card_pin: "",
        bank_remark: "",
      }));
      // console.log("Updated formData.bank_details: ", formData.bank_details);
      return;
    }

    const validationResult = customerFormValidation.safeParse(formData);
    console.log('validationResult ============= ', validationResult);
    
    if (!validationResult.success) {
      setErrors(transformError(validationResult));
      return;
    }
    
    setErrors({}); // Clear previous errors if validation passes

    if (customers?.id) {
      // Update customer
      const result = await updateCustomer(customers.id, formData);
      console.log('result ============= ', result);
    } else {
      const result = await createCustomer(formData);
      console.log('result ============= ', result);
    }
  };

  return (
    <div>
      {/* Basic Info Section */}
      <div className="rounded-md bg-gray-50 p-4 md:p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Customer Name */}
          <div>
            <label htmlFor="name" className="mb-2 block text-sm font-medium">
              Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              placeholder="Enter name"
              value={formData?.name || ''}
              onChange={(e) => {
                setFormData((prev) => ({
                  ...prev,
                  [e.target.name]: e.target.value || '', // Ensure controlled behavior
                }));
              }}
              className={`block w-full rounded-md border ${
                errors?.name ? 'border-red-500' : 'border-gray-200'
              } py-2 px-3 text-sm outline-2 placeholder:text-gray-500`}
              
            />
            {errors?.name?.[0] && (
              <p className="text-red-500 text-xs mt-1">{errors.name[0]}</p>
            )}


          </div>

          {/* IC (Identity Card) */}
          <div>
            <label htmlFor="ic" className="mb-2 block text-sm font-medium">
              IC (Identity Card)
            </label>
            <input
              id="ic"
              name="ic"
              type="text"
              placeholder="Enter IC number"
              value={formData?.ic || ''}
              onChange={(e) => {
                setFormData((prev) => ({
                  ...prev,
                  [e.target.name]: e.target.value || '', // Ensure controlled behavior
                }));
              }}
              className={`block w-full rounded-md border ${
                errors?.ic ? 'border-red-500' : 'border-gray-200'
              } py-2 px-3 text-sm outline-2 placeholder:text-gray-500`}
            />
            {errors?.ic?.[0] && (
              <p className="text-red-500 text-xs mt-1">{errors.ic[0]}</p>
            )}
          </div>

          {/* Passport */}
          <div>
            <label htmlFor="passport" className="mb-2 block text-sm font-medium">
              Passport
            </label>
            <input
              id="passport"
              name="passport"
              type="text"
              placeholder="Enter passport number"
              value={formData?.passport || ''}
              onChange={(e) => {
                setFormData((prev) => ({
                  ...prev,
                  [e.target.name]: e.target.value || '', // Ensure controlled behavior
                }));
              }}
              className={`block w-full rounded-md border ${
                errors?.passport ? 'border-red-500' : 'border-gray-200'
              } py-2 px-3 text-sm outline-2 placeholder:text-gray-500`}
            />
            {errors?.passport?.[0] && (
              <p className="text-red-500 text-xs mt-1">{errors.passport[0]}</p>
            )}
          </div>

          {/* Race */}
          <div>
            <label htmlFor="race" className="mb-2 block text-sm font-medium">
              Race
            </label>
            <input
              id="race"
              name="race"
              type="text"
              placeholder="Enter race"
              value={formData?.race || ''}
              onChange={(e) => {
                setFormData((prev) => ({
                  ...prev,
                  [e.target.name]: e.target.value || '', // Ensure controlled behavior
                }));
              }}
              className="block w-full rounded-md border border-gray-200 py-2 px-3 text-sm outline-2 placeholder:text-gray-500"
            />
          </div>

          {/* Gender */}
          <div>
            <label htmlFor="gender" className="mb-2 block text-sm font-medium">
              Gender
            </label>
            <select
              id="gender"
              name="gender"
              value={formData?.gender || ''}
              onChange={(e) => {
                setFormData((prev) => ({
                  ...prev,
                  [e.target.name]: e.target.value || '', // Ensure controlled behavior
                }));
              }}
              className="block w-full rounded-md border border-gray-200 py-2 px-3 text-sm outline-2 placeholder:text-gray-500"
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Marital Status */}
          <div>
            <label htmlFor="marital_status" className="mb-2 block text-sm font-medium">
              Marital Status
            </label>
            <select
              id="marital_status"
              name="marital_status"
              value={formData?.marital_status || ''}
              onChange={(e) => {
                setFormData((prev) => ({
                  ...prev,
                  [e.target.name]: e.target.value || '', // Ensure controlled behavior
                }));
              }}
              className="block w-full rounded-md border border-gray-200 py-2 px-3 text-sm outline-2 placeholder:text-gray-500"
            >
              <option value="">Select Status</option>
              <option value="Single">Single</option>
              <option value="Married">Married</option>
              <option value="Divorced">Divorced</option>
              <option value="Widowed">Widowed</option>
            </select>
          </div>

          {/* Number of Children */}
          <div>
            <label htmlFor="no_of_child" className="mb-2 block text-sm font-medium">
              No. of Children
            </label>
            <input
              id="no_of_child"
              name="no_of_child"
              type="number"
              value={formData?.no_of_child || ''}
              onChange={(e) => {
                setFormData((prev) => ({
                  ...prev,
                  [e.target.name]: e.target.value || '', // Ensure controlled behavior
                }));
              }}
              placeholder="Enter number of children"
              className="block w-full rounded-md border border-gray-200 py-2 px-3 text-sm outline-2 placeholder:text-gray-500"
            />
          </div>

          {/* Car Plate */}
          <div>
            <label htmlFor="car_plate" className="mb-2 block text-sm font-medium">
              Car Plate
            </label>
            <input
              id="car_plate"
              name="car_plate"
              type="text"
              value={formData?.car_plate || ''}
              onChange={(e) => {
                setFormData((prev) => ({
                  ...prev,
                  [e.target.name]: e.target.value || '', // Ensure controlled behavior
                }));
              }}
              placeholder="Enter car plate number"
              className="block w-full rounded-md border border-gray-200 py-2 px-3 text-sm outline-2 placeholder:text-gray-500"
            />
          </div>

          {/* Contact Number */}
          <div>
            <label htmlFor="mobile_no" className="mb-2 block text-sm font-medium">
              Contact Number
            </label>
            <input
              id="mobile_no"
              name="mobile_no"
              type="tel"
              value={formData?.mobile_no || ''}
              onChange={(e) => {
                setFormData((prev) => ({
                  ...prev,
                  [e.target.name]: e.target.value || '', // Ensure controlled behavior
                }));
              }}
              placeholder="Enter contact number"
              className="block w-full rounded-md border border-gray-200 py-2 px-3 text-sm outline-2 placeholder:text-gray-500"
            />
          </div>

          {/* Status */}
          <div>
            <label htmlFor="status" className="mb-2 block text-sm font-medium">
              Status
            </label>
            <select
              id="status"
              name="status"
              value={formData?.status || ''}
              onChange={(e) => {
                setFormData((prev) => ({
                  ...prev,
                  [e.target.name]: e.target.value || '', // Ensure controlled behavior
                }));
              }}
              className="block w-full rounded-md border border-gray-200 py-2 px-3 text-sm outline-2 placeholder:text-gray-500"
            >
              <option value="">Select Status</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
              <option value="Suspended">Suspended</option>
            </select>
          </div>
        </div>
      </div>
      {/* Tabs Navigation */}
      <div className="mt-6 border-b mb-4">
        <div className="flex flex-wrap space-x-4">
          {Array.from(tabs).map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              style={{ fontWeight: activeTab === tab.key ? 'bold' : 'normal' }}
              className={`py-2 px-4 text-sm font-medium border-b-2 transition-all ${
                activeTab === tab.key ? '"border-blue-500 text-blue-600 font-semibold"' : 'border-transparent text-gray-600 hover:text-blue-500'
              }`}

            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Form */}
      <div className="rounded-md bg-gray-50 p-4 md:p-6">
        <form id="customerForm" onSubmit={handleSubmit}>
          {/* Tab Content */}
          {activeTab === 'customer_address' && (
            <div>
              <h3 className="text-lg font-semibold mb-4">Address Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                {/* Address Lines */}
                <div>
                  <label htmlFor="perm_address_line" className="mb-2 block text-sm font-medium">
                    Address Lines
                  </label>
                  <textarea
                    id="perm_address_line"
                    name="perm_address_line"
                    value={formData.customer_address.perm_address_line || ''}
                    onChange={handleInputChange}
                    placeholder="Enter Address Lines"
                    className="block w-full rounded-md border border-gray-200 py-2 px-3 text-sm outline-2 placeholder:text-gray-500"
                  />
                </div>
                {/* Postal Code */}
                <div>
                  <label htmlFor="perm_postal_code" className="mb-2 block text-sm font-medium">
                    Postal Code
                  </label>
                  <input
                    id="perm_postal_code"
                    name="perm_postal_code"
                    value={formData.customer_address.perm_postal_code || ''}
                    onChange={handleInputChange}
                    type="number"
                    placeholder="Enter Postal Code"
                    className="block w-full rounded-md border border-gray-200 py-2 px-3 text-sm outline-2 placeholder:text-gray-500"
                  />
                </div>

                {/* Country */}
                <div>
                  <label htmlFor="perm_country" className="mb-2 block text-sm font-medium">
                    Country
                  </label>
                  <select
                    id="perm_country"
                    name="perm_country"
                    value={formData.customer_address.perm_country || ''}
                    onChange={handleInputChange}
                    className="block w-full rounded-md border border-gray-200 py-2 px-3 text-sm outline-2 placeholder:text-gray-500"
                  >
                    <option value="">Select Country</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                {/* State */}
                <div>
                  <label htmlFor="perm_state" className="mb-2 block text-sm font-medium">
                    State
                  </label>
                  <select
                    id="perm_state"
                    name="perm_state"
                    value={formData.customer_address.perm_state || ''}
                    onChange={handleInputChange}
                    className="block w-full rounded-md border border-gray-200 py-2 px-3 text-sm outline-2 placeholder:text-gray-500"
                  >
                    <option value="">Select State</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                {/* City */}
                <div>
                  <label htmlFor="perm_city" className="mb-2 block text-sm font-medium">
                    City
                  </label>
                  <select
                    id="perm_city"
                    name="perm_city"
                    value={formData.customer_address.perm_city || ''}
                    onChange={handleInputChange}
                    className="block w-full rounded-md border border-gray-200 py-2 px-3 text-sm outline-2 placeholder:text-gray-500"
                  >
                    <option value="">Select City</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

              </div>

              <div className="mt-4">
                <input
                  type="checkbox"
                  id="sameAsPermanent"
                  checked={sameAsPermanent}
                  onChange={() => setSameAsPermanent(!sameAsPermanent)}
                />
                <label htmlFor="sameAsPermanent" className="ml-2">
                  Correspondence address same as Permanent Address
                </label>
              </div>

              {!sameAsPermanent && (
                <div className="mt-4">
                  <h3 className="text-lg font-semibold mb-2">
                    Correspondence Address
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                    {/* Address Lines */}
                    <div>
                      <label htmlFor="corr_address_line" className="mb-2 block text-sm font-medium">
                        Address Lines
                      </label>
                      <textarea
                        id="corr_address_line"
                        name="corr_address_line"
                        value={formData.customer_address.corr_address_line || ''}
                        onChange={handleInputChange}
                        placeholder="Enter Address Lines"
                        className="block w-full rounded-md border border-gray-200 py-2 px-3 text-sm outline-2 placeholder:text-gray-500"
                      />
                    </div>
                    {/* Postal Code */}
                    <div>
                      <label htmlFor="corr_postal_code" className="mb-2 block text-sm font-medium">
                        Postal Code
                      </label>
                      <input
                        id="corr_postal_code"
                        name="corr_postal_code"
                        value={formData.customer_address.corr_postal_code || ''}
                        onChange={handleInputChange}
                        type="number"
                        placeholder="Enter Postal Code"
                        className="block w-full rounded-md border border-gray-200 py-2 px-3 text-sm outline-2 placeholder:text-gray-500"
                      />
                    </div>

                    {/* Country */}
                    <div>
                      <label htmlFor="corr_country" className="mb-2 block text-sm font-medium">
                        Country
                      </label>
                      <select
                        id="corr_country"
                        name="corr_country"
                        value={formData.customer_address.corr_country || ''}
                        onChange={handleInputChange}
                        className="block w-full rounded-md border border-gray-200 py-2 px-3 text-sm outline-2 placeholder:text-gray-500"
                      >
                        <option value="">Select Country</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>

                    {/* State */}
                    <div>
                      <label htmlFor="corr_state" className="mb-2 block text-sm font-medium">
                        State
                      </label>
                      <select
                        id="corr_state"
                        name="corr_state"
                        value={formData.customer_address.corr_state || ''}
                        onChange={handleInputChange}
                        className="block w-full rounded-md border border-gray-200 py-2 px-3 text-sm outline-2 placeholder:text-gray-500"
                      >
                        <option value="">Select State</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>

                    {/* City */}
                    <div>
                      <label htmlFor="corr_city" className="mb-2 block text-sm font-medium">
                        City
                      </label>
                      <select
                        id="corr_city"
                        name="corr_city"
                        value={formData.customer_address.corr_city || ''}
                        onChange={handleInputChange}
                        className="block w-full rounded-md border border-gray-200 py-2 px-3 text-sm outline-2 placeholder:text-gray-500"
                      >
                        <option value="">Select City</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>

                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'employment' && (
            <div>
            {/* <h3 className="text-lg font-semibold mb-4">Employment & Company</h3> */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label htmlFor="income" className="mb-2 block text-sm font-medium">
                    Income
                  </label>
                  <input
                    id="income"
                    name="income"
                    type="number"
                    value={formData.employment.income || ''}
                    onChange={handleInputChange}
                    placeholder="Enter income"
                    className="block w-full rounded-md border border-gray-200 py-2 px-3 text-sm outline-2 placeholder:text-gray-500"
                  />
                </div>

                <div>
                  <label htmlFor="business_type" className="mb-2 block text-sm font-medium">
                    Business Type
                  </label>
                  <input
                    id="business_type"
                    name="business_type"
                    value={formData.employment.business_type || ''}
                    onChange={handleInputChange}
                    placeholder="Enter Business Type"
                    className="block w-full rounded-md border border-gray-200 py-2 px-3 text-sm outline-2 placeholder:text-gray-500"
                  />
                </div>

                <div>
                  <label htmlFor="department" className="mb-2 block text-sm font-medium">
                    Department
                  </label>
                  <input
                    id="department"
                    name="department"
                    value={formData.employment.department || ''}
                    onChange={handleInputChange}
                    placeholder="Enter Business Type"
                    className="block w-full rounded-md border border-gray-200 py-2 px-3 text-sm outline-2 placeholder:text-gray-500"
                  />
                </div>

                <div>
                  <label htmlFor="employee_no" className="mb-2 block text-sm font-medium">
                    Employee no
                  </label>
                  <input
                    id="employee_no"
                    name="employee_no"
                    value={formData.employment.employee_no || ''}
                    onChange={handleInputChange}
                    placeholder="Enter Business Type"
                    className="block w-full rounded-md border border-gray-200 py-2 px-3 text-sm outline-2 placeholder:text-gray-500"
                  />
                </div>

                <div className="relative max-w-sm">
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
                        employment: {
                          ...prev.employment,
                          income_date: date ? date.toISOString().split('T')[0] : '', // Save as YYYY-MM-DD
                        },
                      }));
                    }}
                    placeholderText="Select date"
                    className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5"
                  />
                </div>

                <div>
                  <label htmlFor="occupation_category" className="mb-2 block text-sm font-medium">
                    Occupation category
                  </label>
                  <input
                    id="occupation_category"
                    name="occupation_category"
                    value={formData.employment.occupation_category || ''}
                    onChange={handleInputChange}
                    placeholder="Enter Occupation category"
                    className="block w-full rounded-md border border-gray-200 py-2 px-3 text-sm outline-2 placeholder:text-gray-500"
                  />
                </div>

                <div>
                  <label htmlFor="position" className="mb-2 block text-sm font-medium">
                    Position
                  </label>
                  <input
                    id="position"
                    name="position"
                    value={formData.employment.position || ''}
                    onChange={handleInputChange}
                    placeholder="Enter Occupation category"
                    className="block w-full rounded-md border border-gray-200 py-2 px-3 text-sm outline-2 placeholder:text-gray-500"
                  />
                </div>

                <div>
                  <label htmlFor="telephone_no" className="mb-2 block text-sm font-medium">
                    Telephone no
                  </label>
                  <input
                    id="telephone_no"
                    name="telephone_no"
                    value={formData.employment.telephone_no || ''}
                    onChange={handleInputChange}
                    placeholder="Enter Telephone no"
                    className="block w-full rounded-md border border-gray-200 py-2 px-3 text-sm outline-2 placeholder:text-gray-500"
                  />
                </div>

                <div>
                  <label htmlFor="employment_remarks" className="mb-2 block text-sm font-medium">
                    Remark
                  </label>
                  <input
                    id="employment_remarks"
                    name="employment_remarks"
                    value={formData.employment.employment_remarks || ''}
                    onChange={handleInputChange}
                    placeholder="Enter Remark"
                    className="block w-full rounded-md border border-gray-200 py-2 px-3 text-sm outline-2 placeholder:text-gray-500"
                  />
                </div>

              </div>
          </div>
          )}

          {activeTab === 'relations' && (
            <div><div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Guarantor name */}
              <div>
                <label
                  htmlFor="guarantor_name"
                  className="mb-2 block text-sm font-medium"
                >
                  Guarantor Name
                </label>
                <input
                  id="guarantor_name"
                  name="guarantor_name"
                  value={formData?.guarantor_name || ''}
                  onChange={(e) => setFormData({ ...formData, guarantor_name: e.target.value })}
                  type="text"
                  placeholder="Enter guarantor name"
                  className="block w-full rounded-md border border-gray-300 py-2 px-3 text-sm placeholder-gray-500" />
              </div>

              {/* Guarantor IC */}
              <div>
                <label htmlFor="guarantor_ic" className="mb-2 block text-sm font-medium">
                  IC
                </label>
                <input
                  id="guarantor_ic"
                  name="guarantor_ic"
                  value={formData?.guarantor_ic || ''}
                  onChange={(e) => setFormData({ ...formData, guarantor_ic: e.target.value })}
                  type="text"
                  placeholder="Enter Guarantor ic"
                  className="block w-full rounded-md border border-gray-200 py-2 px-3 text-sm outline-2 placeholder:text-gray-500" />
              </div>
              {/* Guarantor Contact_number */}
              <div>
                <label htmlFor="guarantor_contact_number" className="mb-2 block text-sm font-medium">
                  Contact Number
                </label>
                <input
                  id="guarantor_contact_number"
                  name="guarantor_contact_number"
                  value={formData?.guarantor_contact_number || ''}
                  onChange={(e) => setFormData({ ...formData, guarantor_contact_number: e.target.value })}
                  type="text"
                  placeholder="Enter Guarantor Contact Number"
                  className="block w-full rounded-md border border-gray-200 py-2 px-3 text-sm outline-2 placeholder:text-gray-500" />
              </div>

              {/* Relationship */}
              <div>
                <label htmlFor="guarantor_relationship" className="mb-2 block text-sm font-medium">
                  Relationship
                </label>
                <input
                  id="guarantor_relationship"
                  name="guarantor_relationship"
                  value={formData?.guarantor_relationship || ''}
                  onChange={(e) => setFormData({ ...formData, guarantor_relationship: e.target.value })}
                  placeholder="Relationship"
                  className="block w-full rounded-md border border-gray-200 py-2 px-3 text-sm outline-2 placeholder:text-gray-500" />
              </div>
            </div>
              <div className="mt-6 flex justify-end gap-4">
                <Button id='addGuaranter'>Add Guaranter</Button>
              </div>

              <div className="w-full">
                <div className="mt-6 flow-root">
                  <div className="overflow-x-auto">
                    <div className="inline-block min-w-full align-middle">
                      <div className="overflow-hidden rounded-md bg-gray-50 p-2 md:pt-0">
                        <div className="md:hidden">
                          {/* mobile table */}
                        </div>
                        <table id='customerRelationTable' className="hidden min-w-full rounded-md text-gray-900 md:table">
                          <thead className="rounded-md bg-gray-50 text-left text-sm font-normal">
                            <tr>
                              <th scope="col" className="px-3 py-5 font-mediums">
                                Name
                              </th>
                              <th scope="col" className="px-3 py-5 font-mediums">
                                IC
                              </th>
                              <th scope="col" className="px-3 py-5 font-mediums">
                                Contact Number
                              </th>
                              <th scope="col" className="px-3 py-5 font-mediums">
                                Relationship
                              </th>
                            </tr>
                          </thead>

                          <tbody className="divide-y divide-gray-200 text-gray-900">
                            {formData?.relations?.map((gua) => (
                              <tr key={gua.id} className="group">
                                <td className="whitespace-nowrap bg-white py-5 pl-4 pr-3 text-sm text-black group-first-of-type:rounded-md group-last-of-type:rounded-md sm:pl-6">
                                  <div className="flex items-center gap-3">
                                    <p>{gua.guarantor_name}</p>
                                  </div>
                                </td>

                                <td className="whitespace-nowrap bg-white py-5 pl-4 pr-3 text-sm text-black group-first-of-type:rounded-md group-last-of-type:rounded-md sm:pl-6">
                                  <div className="flex items-center gap-3">
                                    <p>{gua.guarantor_ic}</p>
                                  </div>
                                </td>

                                <td className="whitespace-nowrap bg-white py-5 pl-4 pr-3 text-sm text-black group-first-of-type:rounded-md group-last-of-type:rounded-md sm:pl-6">
                                  <div className="flex items-center gap-3">
                                    <p>{gua.guarantor_contact_number}</p>
                                  </div>
                                </td>

                                <td className="whitespace-nowrap bg-white py-5 pl-4 pr-3 text-sm text-black group-first-of-type:rounded-md group-last-of-type:rounded-md sm:pl-6">
                                  <div className="flex items-center gap-3">
                                    <p>{gua.guarantor_relationship}</p>
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
                  {/* <Pagination totalPages={totalCustomer} /> */}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'bank_details' && (
            <div><div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Bank name */}
            <div>
              <label
                htmlFor="bank_name"
                className="mb-2 block text-sm font-medium"
              >
                Bank Name
              </label>
              <input
                id="bank_name"
                name="bank_name"
                value={formData?.bank_name || ''}
                onChange={(e) => setFormData({ ...formData, bank_name: e.target.value })}
                type="text"
                placeholder="Enter bank name"
                className="block w-full rounded-md border border-gray-300 py-2 px-3 text-sm placeholder-gray-500" />
            </div>

            {/* Bank Account No */}
            <div>
              <label htmlFor="bank_account_no" className="mb-2 block text-sm font-medium">
                Bank Account no
              </label>
              <input
                id="bank_account_no"
                name="bank_account_no"
                value={formData?.bank_account_no || ''}
                onChange={(e) => setFormData({ ...formData, bank_account_no: e.target.value })}
                type="text"
                placeholder="Enter Account Np"
                className="block w-full rounded-md border border-gray-200 py-2 px-3 text-sm outline-2 placeholder:text-gray-500" />
            </div>
            {/* Bank holder */}
            <div>
              <label htmlFor="bank_account_holder" className="mb-2 block text-sm font-medium">
                Bank Account Holder
              </label>
              <input
                id="bank_account_holder"
                name="bank_account_holder"
                value={formData?.bank_account_holder || ''}
                onChange={(e) => setFormData({ ...formData, bank_account_holder: e.target.value })}
                type="text"
                placeholder="Enter Bank Account Holder"
                className="block w-full rounded-md border border-gray-200 py-2 px-3 text-sm outline-2 placeholder:text-gray-500" />
            </div>

            {/* Bank Card */}
            <div>
              <label htmlFor="bank_card_no" className="mb-2 block text-sm font-medium">
                Bank Card
              </label>
              <input
                id="bank_card_no"
                name="bank_card_no"
                value={formData?.bank_card_no || ''}
                onChange={(e) => setFormData({ ...formData, bank_card_no: e.target.value })}
                placeholder="Bank Card no"
                className="block w-full rounded-md border border-gray-200 py-2 px-3 text-sm outline-2 placeholder:text-gray-500" />
            </div>

            {/* Bank Remark */}
            <div>
              <label htmlFor="bank_card_pin" className="mb-2 block text-sm font-medium">
                Bank Card Pin
              </label>
              <input
                id="bank_card_pin"
                name="bank_card_pin"
                value={formData?.bank_card_pin || ''}
                onChange={(e) => setFormData({ ...formData, bank_card_pin: e.target.value })}
                placeholder="Bank Card Pin"
                className="block w-full rounded-md border border-gray-200 py-2 px-3 text-sm outline-2 placeholder:text-gray-500" />
            </div>
            
            {/* Bank Remark */}
            <div>
              <label htmlFor="bank_remark" className="mb-2 block text-sm font-medium">
                Bank Remark
              </label>
              <input
                id="bank_remark"
                name="bank_remark"
                value={formData?.bank_remark || ''}
                onChange={(e) => setFormData({ ...formData, bank_remark: e.target.value })}
                placeholder="Bank Card no"
                className="block w-full rounded-md border border-gray-200 py-2 px-3 text-sm outline-2 placeholder:text-gray-500" />
            </div>

          </div>
            <div className="mt-6 flex justify-end gap-4">
              <Button id='addBankDetails'>Add Bank Detail</Button>
            </div>

            <div className="w-full">
              <div className="mt-6 flow-root">
                <div className="overflow-x-auto">
                  <div className="inline-block min-w-full align-middle">
                    <div className="overflow-hidden rounded-md bg-gray-50 p-2 md:pt-0">
                      <div className="md:hidden">
                        {/* mobile table */}
                      </div>
                      <table id='bankTable' className="hidden min-w-full rounded-md text-gray-900 md:table">
                        <thead className="rounded-md bg-gray-50 text-left text-sm font-normal">
                          <tr>
                            <th scope="col" className="px-3 py-5 font-mediums">
                              Bank Name
                            </th>
                            <th scope="col" className="px-3 py-5 font-mediums">
                              Account No
                            </th>
                            <th scope="col" className="px-3 py-5 font-mediums">
                              Account Holder
                            </th>
                            <th scope="col" className="px-3 py-5 font-mediums">
                              Card No
                            </th>
                            <th scope="col" className="px-3 py-5 font-mediums">
                              Card Pin
                            </th>
                            <th scope="col" className="px-3 py-5 font-mediums">
                              Remark
                            </th>
                            
                          </tr>
                        </thead>

                        <tbody className="divide-y divide-gray-200 text-gray-900">
                          {formData?.bank_details?.map((bank) => (
                            <tr key={bank.id} className="group">
                              
                              <td className="whitespace-nowrap bg-white py-5 pl-4 pr-3 text-sm text-black group-first-of-type:rounded-md group-last-of-type:rounded-md sm:pl-6">
                                <div className="flex items-center gap-3">
                                  <p>{bank.bank_name}</p>
                                </div>
                              </td>
                              <td className="whitespace-nowrap bg-white py-5 pl-4 pr-3 text-sm text-black group-first-of-type:rounded-md group-last-of-type:rounded-md sm:pl-6">
                                <div className="flex items-center gap-3">
                                  <p>{bank.bank_account_no}</p>
                                </div>
                              </td>
                              <td className="whitespace-nowrap bg-white py-5 pl-4 pr-3 text-sm text-black group-first-of-type:rounded-md group-last-of-type:rounded-md sm:pl-6">
                                <div className="flex items-center gap-3">
                                  <p>{bank.bank_account_holder}</p>
                                </div>
                              </td>
                              <td className="whitespace-nowrap bg-white py-5 pl-4 pr-3 text-sm text-black group-first-of-type:rounded-md group-last-of-type:rounded-md sm:pl-6">
                                <div className="flex items-center gap-3">
                                  <p>{bank.bank_card_no}</p>
                                </div>
                              </td>
                              <td className="whitespace-nowrap bg-white py-5 pl-4 pr-3 text-sm text-black group-first-of-type:rounded-md group-last-of-type:rounded-md sm:pl-6">
                                <div className="flex items-center gap-3">
                                  <p>{bank.bank_card_pin}</p>
                                </div>
                              </td>
                              <td className="whitespace-nowrap bg-white py-5 pl-4 pr-3 text-sm text-black group-first-of-type:rounded-md group-last-of-type:rounded-md sm:pl-6">
                                <div className="flex items-center gap-3">
                                  <p>{bank.bank_remark}</p>
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
                {/* <Pagination totalPages={totalCustomer} /> */}
              </div>
            </div>
          </div>
          )}

          {activeTab === 'documents' && (
            <div>
              <label
                htmlFor="documents"
                className="mb-2 block text-sm font-medium"
              >
                Upload Documents
              </label>
              <input
                id="documents"
                name="documents"
                type="file"
                className="block w-full rounded-md border border-gray-300 py-2 px-3 text-sm"
              />
            </div>
          )}
        </form>
      </div>

      {/* Submit Button Outside Tabs */}
      <div className="mt-6 flex justify-end gap-4">
        <Link
          href="/dashboard/customers"
          className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
        >
          Cancel
        </Link>
        <Button type="submit" form="customerForm">Save Customer</Button>
      </div>
    </div>
  );
}

