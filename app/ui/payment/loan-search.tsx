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

interface LoanSearchDropdownInputProps {
  onChange: (loanId: string) => void;
}

export default function LoanSearchDropdownInput({ onChange }: LoanSearchDropdownInputProps) {
  const [loanQuery, setLoanQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [loans, setLoans] = useState<Loan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedLoan, setSelectedLoan] = useState<Loan | null>(null);

  useEffect(() => {
    const loadLoans = async () => {
      setIsLoading(true);
      try {
        const { loan } = await fetchLoan({
          query: loanQuery,
          currentPage: 1,
          pageSize: 50,
        });

        setLoans(
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
        setIsLoading(false);
      }
    };

    loadLoans();
  }, [loanQuery]);

  const handleSelectLoan = (loan: Loan) => {
    setSelectedLoan(loan);
    setLoanQuery(loan.generate_id);
    setShowDropdown(false);
    onChange(loan.id);
  };

  return (
    <div>
      <div className="relative">
        <label htmlFor="loanSearch" className="block text-sm font-medium text-gray-700">
          Loan
        </label>
        <input
          type="text"
          id="loanSearch"
          value={loanQuery}
          onChange={(e) => {
            setLoanQuery(e.target.value);
            setShowDropdown(e.target.value.length > 0);
          }}
          onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
          className="mt-1 w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          placeholder="Search by Loan ID..."
        />

        {isLoading && (
          <div className="absolute z-10 mt-2 w-full bg-white border border-gray-300 rounded-md shadow-lg">
            <div className="p-2 text-gray-500">Loading...</div>
          </div>
        )}

        {!isLoading && showDropdown && loans.length > 0 && (
          <div className="absolute z-10 mt-2 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-56 overflow-y-auto">
            {loans.map((loan) => (
              <button
                key={loan.id}
                onClick={() => handleSelectLoan(loan)}
                className="w-full text-left p-2 hover:bg-gray-100 focus:outline-none focus:bg-gray-100"
              >
                <div className="font-semibold">{loan.generate_id}</div>
                <div className="text-sm text-gray-500">
                  Principal Amount: {loan.principal_amount} | Customer: {loan.customer?.name}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 gap-y-6 md-4">

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

