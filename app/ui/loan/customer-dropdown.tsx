"use client"; // Ensure it's a client component

import { useEffect, useState } from "react";
import { fetchCustomers } from "@/app/lib/data";

export default function CustomerDropdownInput({
  onChange,
}: {
  onChange: (customer_id: string | null) => void;
}) {
  const [customerQuery, setCustomerQuery] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState<string | null>(null);
  const [showDropdown1, setShowDropdown1] = useState(false);
  const [data, setData] = useState<{ id: string; name: string }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCustomers() {
      try {
        const customer = await fetchCustomers({ 
          query: customerQuery, 
          currentPage: 1, 
          pageSize: 50
        });
        setData(customer.customers.map((c) => ({ id: c.id, name: c.name || "" })));
      } catch (error) {
        console.error("Error fetching customers:", error);
      } finally {
        setLoading(false);
      }
    }
    loadCustomers();
  }, []);

  const handleSelectCustomer = (id: string, name: string) => {
    setCustomerQuery(name);
    setSelectedCustomer(id);
    setShowDropdown1(false);
    onChange(id);
  };

  return (
    <div className="">
      <div className="flex flex-col md:flex-row gap-4 w-full">
        {/* Customer */}
        <div className="relative w-full">
          <label htmlFor="customer_id" className="mb-2 block text-sm font-medium">
            Customer
          </label>
          <input
            type="text"
            value={customerQuery}
            onChange={(e) => {
              setCustomerQuery(e.target.value);
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
                    onMouseDown={() => handleSelectCustomer(item.id, item.name)}
                  >
                    {item.name}
                  </li>
                ))}
              </ul>
            )
          )}
        </div>
      </div>
    </div>
  );
}
