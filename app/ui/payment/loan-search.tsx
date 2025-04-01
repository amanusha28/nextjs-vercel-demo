"use client"

import { useEffect, useState } from "react";
import { fetchLoan } from "@/app/lib/data";

interface Loan {
  id: string;
  generate_id: string;
  principal_amount: string | null;
  customer: customer | null;
  user_loan_agent_1Touser: agentType | null;
  user_loan_agent_2Touser: agentType | null;
}
interface customer {
  id: string;
  name: string | null;
}
interface agentType {
  id: string;
  name: string | null;
}

export default function LoanSearchDropdownInput({
  onChange
}: {
  onChange: (loanData: string) => void;
}) {
  const [loanQuery, setLoanQuery] = useState("");
  const [showDropdown1, setShowDropdown1] = useState(false);
  const [data, setData] = useState<Loan[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLoan, setSelectedLoan] = useState<Loan | null>(null);

  useEffect(() => {
    async function loadLoan() {
      try {
        const { loan } = await fetchLoan({
          query: loanQuery,
          currentPage: 1,
          pageSize: 50,
        });
        console.log(loan);
        setData(
          loan.map((l: Loan) => ({
            id: l.id,
            generate_id: l.generate_id || "",
            principal_amount: l.principal_amount || "",
            customer: l.customer || { id: "", name: "" },
            user_loan_agent_1Touser: l.user_loan_agent_1Touser || { id: "", name: "" },
            user_loan_agent_2Touser: l.user_loan_agent_2Touser || { id: "", name: "" },
          }))
        );
      } catch (error) {
        console.error("Error fetching loan:", error);
      } finally {
        setLoading(false);
      }
    }
    loadLoan();
  }, []);

  const handleSelectLoan = (id: string, generate_id: string) => {
    const loan = data.find((item) => item.id === id);
    if (loan) {
      setSelectedLoan(loan);
    }
    setLoanQuery(generate_id);
    setShowDropdown1(false);
    onChange(id); // To return id
    // onChange(loan);
  };

  return (
    <div className="space-y-6">
      {/* Loan Section */}
      <div className="w-full">
        <label htmlFor="generate_id" className="mb-2 block text-sm font-medium">
          Loan
        </label>
        <div className="relative w-full">
          <input
            type="text"
            value={loanQuery}
            onChange={(e) => {
              setLoanQuery(e.target.value);
              setShowDropdown1(e.target.value.length > 0);
            }}
            onBlur={() => setTimeout(() => setShowDropdown1(false), 200)}
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Search..."
          />
          {loading ? (
            <p className="text-gray-500 mt-1">Loading...</p>
          ) : (
            showDropdown1 &&
            data.length > 0 && (
              <ul className="absolute w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-40 overflow-auto">
                {data.map((item) => (
                  <li
                    key={item.id}
                    className="p-2 cursor-pointer hover:bg-blue-500 hover:text-white"
                    onMouseDown={() => handleSelectLoan(item.id, item.generate_id)}
                  >
                    {item.generate_id}
                  </li>
                ))}
              </ul>
            )
          )}
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-gray-300"></div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 gap-y-6">

        {/* Principal Amount */}
        <div className="w-full">
          <label htmlFor="principal_amount" className="mb-2 block text-sm font-medium">
            Principal Amount
          </label>
          <input
            id="principal_amount"
            name="principal_amount"
            type="text"
            value={selectedLoan?.principal_amount || ""}
            readOnly
            className="block w-full rounded-md border border-gray-300 py-2 px-3 text-sm outline-none bg-gray-100"
          />
        </div>

        {/* Customer Name */}
        <div className="w-full">
          <label htmlFor="customer_name" className="mb-2 block text-sm font-medium">
            Customer Name
          </label>
          <input
            id="customer_name"
            name="customer_name"
            type="text"
            value={selectedLoan?.customer?.name || ""}
            readOnly
            className="block w-full rounded-md border border-gray-300 py-2 px-3 text-sm outline-none bg-gray-100"
          />
        </div>

        {/* Agent1 */}
        <div className="w-full">
          <label htmlFor="agent1" className="mb-2 block text-sm font-medium">
            Agent1
          </label>
          <input
            id="agent1"
            name="agent1"
            type="text"
            value={selectedLoan?.user_loan_agent_1Touser?.name || ""}
            readOnly
            className="block w-full rounded-md border border-gray-300 py-2 px-3 text-sm outline-none bg-gray-100"
          />
        </div>

        {/* Agent2 */}
        <div className="w-full">
          <label htmlFor="agent2" className="mb-2 block text-sm font-medium">
            Agent2
          </label>
          <input
            id="agent2"
            name="agent2"
            type="text"
            value={selectedLoan?.user_loan_agent_2Touser?.name || ""}
            readOnly
            className="block w-full rounded-md border border-gray-300 py-2 px-3 text-sm outline-none bg-gray-100"
          />
        </div>
      </div>
    </div>
  );

}
