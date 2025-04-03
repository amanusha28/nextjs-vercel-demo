"use client";

import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import LoanSearchDropdownInput from './loan-search';
import { fetchUniqueNumber, getLoanInstallment, getPaymentData, updateOrCreateInstallment, updateOrCreatePayment } from '@/app/lib/actions';
import Link from "next/link";
import { Button } from "../button";

type TabKey = 'installment_listing' | 'payment_listing' | 'loan_sharing';

type TabObject = {
	key: TabKey;
	label: string;
};

const tabs: Set<TabObject> = new Set([
	{ key: 'installment_listing', label: 'Installment listing' },
	{ key: 'payment_listing', label: 'Payment listing' },
	{ key: 'loan_sharing', label: 'Loan sharing' }
]);

interface Installment {
	id?: any;
	generate_id?: string;
	installment_date: string;
	due_amount: string;
	receiving_date: string;
	accepted_amount: string;
	status?: string;
}

interface Payment {
	id?: string;
	generate_id?: string;
	type?: string;
	installment_id?: any;
	payment_date?: string;
	amount?: string;
	balance?: string;
	account_details?: string;
	loan_id?: any;
}

const statusOptions = ["Pending", "Completed", "Overdue"];
const paymentType = ["In", "Out"];

export default function PaymentForm() {
	const [saving, setSaving] = useState(false);
	const [successMessage, setSuccessMessage] = useState<string | null>(null);
	// Initialize activeTab with the key of the first tab
	const initialTab = tabs.values().next().value?.key;
	const [activeTab, setActiveTab] = useState<TabKey>(initialTab || 'installment_listing');

	const [installmentData, setInstallmentData] = useState<any>(null);
	const [paymentData, setPaymentData] = useState<any>(null);
	const [loanId, setLoanId] = useState<any>(null);

	const [formData, setFormData] = useState({
		installment_date: "",
		due_amount: "",
		receiving_date: "",
		status: "",
		accepted_amount: "",
	});

	const [paymentformData, setPaymentFormData] = useState({
		type: "",
		installment_id: "",
		payment_date: "",
		amount: "",
		balance: "",
		account_details: "",
		loan_id: loanId,
	});
	const [editId, setEditId] = useState(null);

	const [selectedPaymentType, setSelectedPaymentType] = useState<string>('');
	const [selectedInstallmentId, setSelectedInstallmentId] = useState<string>('');

	const callInstallmentData = async (loan_id: string) => {
		try {
			const [data, _paymentData] = await Promise.all([
				getLoanInstallment(loan_id),
				getPaymentData(loan_id)
			]);
			setLoanId(loan_id);
			setInstallmentData(data);
			console.log('paymentData->', _paymentData)
			setPaymentData(_paymentData);
		} catch (error) {
			console.error("Error fetching installment or payment data:", error);
		}
	};
	// Handle form submission
	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		const submitter = (e.nativeEvent as SubmitEvent).submitter as HTMLButtonElement;
	
		console.log('Submitter Button ID:', submitter?.id);

		// Handle the Customer Relations (Family & Guarantor) form
		const newInstallmentId = await fetchUniqueNumber('IN', 'installment');
		if (submitter?.id === "addNewInstallment") {
			console.log('editId ->', editId)
			if (editId !== null) {
				setInstallmentData((prev: Installment[]) =>
					prev.map((item: Installment) => (item.id === editId ? { ...formData, id: editId } : item))
				);
				setEditId(null);
			} else {
				setInstallmentData([...installmentData, { ...formData, generate_id: newInstallmentId }]);
			}

			setFormData({ installment_date: '', due_amount: "", receiving_date: "", status: "Pending", accepted_amount: "" });
		}

		if (submitter.id === 'addPaymentData') {
			const newPaymentId = await fetchUniqueNumber('PAY', 'payment');

			const newPayment = {
					...paymentformData,
					generate_id: newPaymentId,
					loan_id: loanId, // Ensure it is linked to the correct loan
			};

			// Update local state
			setPaymentData([...paymentData, newPayment]);

			// Reset payment form
			setPaymentFormData({
					type: "",
					installment_id: "",
					payment_date: "",
					amount: "",
					balance: "",
					account_details: "",
					loan_id: loanId,
			});

			setSelectedPaymentType('')
			setSelectedInstallmentId('')
			return;
		}

		if (submitter?.id === 'SubmitAllData') {
			setSaving(true)
			const installmentPayload = formData.installment_date && formData.due_amount 
				? [...installmentData, formData] 
				: installmentData;

			await Promise.all([
				updateOrCreateInstallment(installmentPayload, loanId),
				updateOrCreatePayment(paymentData, loanId)
			]);

			setSuccessMessage("Record submitted successfully!");
			setTimeout(() => setSuccessMessage(null), 3000); // Remove message after 3 seconds
			setSaving(false)
		}
	};

	const handleEditInstallment = (id: any) => {
		const ins = installmentData.find((x: Installment) => x.id === id);
		if (ins) {
			setFormData({ ...ins, installment_date: ins.installment_date });
			setEditId(id);
		}
	};

	const handleDeleteInstallment = (id: any) => {
		setInstallmentData(installmentData.filter((item: Installment) => item.id !== id));
	};

	/**
	 * ===================================
	 *             Payment
	 * ===================================
	 */

	const handleEditPayment = (id: any) => {
		const pay = paymentData.find((x: Installment) => x.id === id);
		if (pay) {
			setPaymentData({ ...pay, installment_date: pay.installment_date });
			setEditId(id);
		}
	};

	const handleDeletePayment = (id: any) => {
		setPaymentData(paymentData.filter((item: Installment) => item.id !== id));
	};

	return (
		<div className="p-4">
			{/* Loan Search */}
			<LoanSearchDropdownInput onChange={(loanId: string) => callInstallmentData(loanId)} />
			{installmentData &&
				<div>

					{/* Tabs Navigation */}
					<div className="mt-6 border-b mb-4">
						<div className="flex flex-wrap space-x-4">
							{Array.from(tabs).map((tab) => (
								<button
									key={tab.key}
									onClick={() => setActiveTab(tab.key)}
									style={{ fontWeight: activeTab === tab.key ? 'bold' : 'normal' }}
									className={`py-2 px-4 text-sm font-medium border-b-2 transition-all ${activeTab === tab.key ? '"border-blue-500 text-blue-600 font-semibold"' : 'border-transparent text-gray-600 hover:text-blue-500'
										}`}
								>
									{tab.label}
								</button>
							))}
						</div>
					</div>

					{/* Form */}
					<div className="rounded-md bg-gray-50 p-4 md:p-6">
						<form id="installmentForm" onSubmit={handleSubmit}>
							{/* Tab Content */}
							{activeTab === 'installment_listing' && (
								<div><div className="grid grid-cols-1 md:grid-cols-4 gap-4">
									{/* installment_date */}
									<div>
										<label className="mb-2 block text-sm font-medium">Installment Date</label>
										<DatePicker
											placeholderText="Select date"
											selected={(formData.installment_date != '') ? new Date(formData.installment_date): null}
											onChange={(date) => setFormData({ ...formData, installment_date: date ? date.toISOString().split('T')[0] : '' })}
											className="block w-full rounded-md border-gray-300 py-2 px-3 text-sm"
										/>
									</div>
									{/* due_amount */}
									<div>
										<label className="mb-2 block text-sm font-medium">Due Amount</label>
										<input
											value={formData.due_amount ?? ''}
											onChange={(e) => setFormData({ ...formData, due_amount: e.target.value })}
											className="block w-full rounded-md border-gray-300 py-2 px-3 text-sm"
										/>
									</div>
									<div>
										<label className="mb-2 block text-sm font-medium">Status</label>
										<select
											value={formData.status ?? ""}
											onChange={(e) => setFormData({ ...formData, status: e.target.value })}
											className="block w-full rounded-md border-gray-300 py-2 px-3 text-sm"
										>
											{statusOptions.map((status) => (
												<option key={status} value={status}>{status}</option>
											))}
										</select>
									</div>

								</div>
									<div className="mt-6 flex justify-end gap-4">
										<Button id='addNewInstallment'>Add</Button>
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
																		Installment Id
																	</th>
																	<th scope="col" className="px-3 py-5 font-mediums">
																		Installment Date
																	</th>
																	<th scope="col" className="px-3 py-5 font-mediums">
																		Due Amount
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
																		Action
																	</th>

																</tr>
															</thead>

															<tbody className="divide-y divide-gray-200 text-gray-900">
																{installmentData?.map((ins: Installment, index: any) => (
																	<tr key={ins.id || index || ins.generate_id} className="group">

																		<td className="whitespace-nowrap bg-white py-5 pl-4 pr-3 text-sm text-black group-first-of-type:rounded-md group-last-of-type:rounded-md sm:pl-6">
																			<div className="flex items-center gap-3">
																				<p>{ins.generate_id}</p>
																			</div>
																		</td>
																		<td className="whitespace-nowrap bg-white py-5 pl-4 pr-3 text-sm text-black group-first-of-type:rounded-md group-last-of-type:rounded-md sm:pl-6">
																			<div className="flex items-center gap-3">
																				<p>{ins.installment_date}</p>
																			</div>
																		</td>
																		<td className="whitespace-nowrap bg-white py-5 pl-4 pr-3 text-sm text-black group-first-of-type:rounded-md group-last-of-type:rounded-md sm:pl-6">
																			<div className="flex items-center gap-3">
																				<p>{ins.due_amount}</p>
																			</div>
																		</td>
																		<td className="whitespace-nowrap bg-white py-5 pl-4 pr-3 text-sm text-black group-first-of-type:rounded-md group-last-of-type:rounded-md sm:pl-6">
																			<div className="flex items-center gap-3">
																				<p>{ins.accepted_amount}</p>
																			</div>
																		</td>
																		<td className="whitespace-nowrap bg-white py-5 pl-4 pr-3 text-sm text-black group-first-of-type:rounded-md group-last-of-type:rounded-md sm:pl-6">
																			<div className="flex items-center gap-3">
																				<p>{ins.receiving_date}</p>
																			</div>
																		</td>
																		<td className="whitespace-nowrap bg-white py-5 pl-4 pr-3 text-sm text-black group-first-of-type:rounded-md group-last-of-type:rounded-md sm:pl-6">
																			<div className="flex items-center gap-3">
																				<p>{ins.status}</p>
																			</div>
																		</td>

																		<td className="whitespace-nowrap bg-white py-5 pl-4 pr-3 text-sm text-black group-first-of-type:rounded-md group-last-of-type:rounded-md sm:pl-6">
																			<div className="flex items-center gap-3">
																				<button className="mr-2 text-blue-500" onClick={() => handleEditInstallment(ins.id)}>Edit</button>
																				<button className="text-red-500" onClick={() => handleDeleteInstallment(ins.id)}>Delete</button>
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

							{activeTab === 'payment_listing' && (
								<div><div className="grid grid-cols-1 md:grid-cols-4 gap-4">
									{/* installment_date */}
									<div>
										<label className="mb-2 block text-sm font-medium">Payment Status</label>
										<select
											// selected={selectedPaymentType}
											onChange={(val) => setPaymentFormData({ ...paymentformData, type: val.target.value })}
											className="block w-full rounded-md border-gray-300 py-2 px-3 text-sm"
										>
											<option value={''}>Select Payment Type</option>
											{paymentType.map((val) => (
												<option key={val} value={val}>{val}</option>
											))}
										</select>
									</div>
									<div>
										<label className="mb-2 block text-sm font-medium">Payment Date</label>
										<DatePicker
											placeholderText="Select date"
											// selected={paymentformData.payment_date}
											onChange={(val) => setPaymentFormData({ ...paymentformData, payment_date: val ? val.toISOString().split('T')[0] : '' })}
											className="block w-full rounded-md border-gray-300 py-2 px-3 text-sm"
										/>
									</div>
									<div>
										<label className="mb-2 block text-sm font-medium">Installment Id</label>
										<select
											// selected={selectedInstallmentId}
											onChange={(val) => setPaymentFormData({ ...paymentformData, installment_id: val.target.value })}									
											className="block w-full rounded-md border-gray-300 py-2 px-3 text-sm"
										>
												<option >Select Installment Id</option>
											{installmentData.map((val: Installment) => (
												<option key={val.id} value={val.id}>{val.generate_id}</option>
											))}
										</select>
									</div>
									<div>
										<label className="mb-2 block text-sm font-medium">Payment Amount</label>
										<input
											value={paymentformData.amount}
											onChange={(e) => setPaymentFormData({ ...paymentformData, amount: e.target.value })}
											className="block w-full rounded-md border-gray-300 py-2 px-3 text-sm"
										/>
									</div>
									<div>
										<label className="mb-2 block text-sm font-medium">Balance</label>
										<input
											value={paymentformData.balance}
											onChange={(e) => setPaymentFormData({ ...paymentformData, balance: e.target.value })}
											className="block w-full rounded-md border-gray-300 py-2 px-3 text-sm"
										/>
									</div>
									<div>
										<label className="mb-2 block text-sm font-medium">Bank/Agent/Account No</label>
										<input
											value={paymentformData.account_details}
											onChange={(e) => setPaymentFormData({ ...paymentformData, account_details: e.target.value })}
											className="block w-full rounded-md border-gray-300 py-2 px-3 text-sm"
										/>
									</div>

								</div>
									<div className="mt-6 flex justify-end gap-4">
										<Button id='addPaymentData'>Add</Button>
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
																		Payment Type
																	</th>
																	<th scope="col" className="px-3 py-5 font-mediums">
																		Installment Id
																	</th>
																	<th scope="col" className="px-3 py-5 font-mediums">
																	 Payment date
																	</th>
																	<th scope="col" className="px-3 py-5 font-mediums">
																		Amount
																	</th>
																	<th scope="col" className="px-3 py-5 font-mediums">
																		Balance
																	</th>
																	<th scope="col" className="px-3 py-5 font-mediums">
																		Account details
																	</th>
																	{/* <th scope="col" className="px-3 py-5 font-mediums">
																		Action
																	</th> */}

																</tr>
															</thead>

															<tbody className="divide-y divide-gray-200 text-gray-900">
																{paymentData?.map((pay: Payment, index: any) => (
																	<tr key={pay.id || index || pay.generate_id} className="group">

																		<td className="whitespace-nowrap bg-white py-5 pl-4 pr-3 text-sm text-black group-first-of-type:rounded-md group-last-of-type:rounded-md sm:pl-6">
																			<div className="flex items-center gap-3">
																				<p>{pay.type}</p>
																			</div>
																		</td>
																		<td className="whitespace-nowrap bg-white py-5 pl-4 pr-3 text-sm text-black group-first-of-type:rounded-md group-last-of-type:rounded-md sm:pl-6">
																			<div className="flex items-center gap-3">
																				{/* <p>{pay.installment_id}</p> */}
																				<p>{installmentData.find((ins: Installment) => ins.id === pay.installment_id)?.generate_id || "N/A"}</p>
																			</div>
																		</td>
																		<td className="whitespace-nowrap bg-white py-5 pl-4 pr-3 text-sm text-black group-first-of-type:rounded-md group-last-of-type:rounded-md sm:pl-6">
																			<div className="flex items-center gap-3">
																				<p>{pay.payment_date}</p>
																			</div>
																		</td>
																		<td className="whitespace-nowrap bg-white py-5 pl-4 pr-3 text-sm text-black group-first-of-type:rounded-md group-last-of-type:rounded-md sm:pl-6">
																			<div className="flex items-center gap-3">
																				<p>{pay.amount}</p>
																			</div>
																		</td>
																		<td className="whitespace-nowrap bg-white py-5 pl-4 pr-3 text-sm text-black group-first-of-type:rounded-md group-last-of-type:rounded-md sm:pl-6">
																			<div className="flex items-center gap-3">
																				<p>{pay.balance}</p>
																			</div>
																		</td>
																		<td className="whitespace-nowrap bg-white py-5 pl-4 pr-3 text-sm text-black group-first-of-type:rounded-md group-last-of-type:rounded-md sm:pl-6">
																			<div className="flex items-center gap-3">
																				<p>{pay.account_details}</p>
																			</div>
																		</td>

																		<td className="whitespace-nowrap bg-white py-5 pl-4 pr-3 text-sm text-black group-first-of-type:rounded-md group-last-of-type:rounded-md sm:pl-6">
																			<div className="flex items-center gap-3">
																				{/* <button className="mr-2 text-blue-500" onClick={() => handleEditPayment(pay.id)}>Edit</button> */}
																				{/* <button className="text-red-500" onClick={() => handleDeletePayment(pay.id)}>Delete</button> */}
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

						</form>
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
						<Button disabled={saving} type="submit" form="installmentForm" id='SubmitAllData'>{saving ? "Saving......" : "Save"}</Button>
					</div>
				</div>
			}
		</div>
	);
}

