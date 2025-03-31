// components/StateDropdown.tsx
"use client";

import { useEffect, useState } from "react";
import { fetchState } from "../lib/actions";

interface Option {
  id: string;
  name: string;
}


interface StateDropdownProps {
  selected?: string;
  onSelect: (id: string) => void;
}

export default function StateDropdown({ selected, onSelect }: StateDropdownProps) {
  const [states, setstates] = useState<Option[]>([]);
  const [loading, setLoading] = useState(true);

  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    async function fetchstates() {
      try {
        const data = await fetchState();
        setstates(data);
      } catch (error) {
        console.error("Error fetching states:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchstates();
  }, []);

  if (loading) return <p>Loading states...</p>;

  return (
    <div>
      <label htmlFor="state" className="mb-2 block text-sm font-medium">
        State
      </label>
      {loading ? (
        <p className="text-sm text-gray-500">Loading states...</p>
      ) : error ? (
        <p className="text-sm text-red-500">{error}</p>
      ) : (
        <select
          id="state"
          value={selected || ""}
          onChange={(e) => onSelect(e.target.value)}
          className="block w-full rounded-md border border-gray-200 py-2 px-3 text-sm outline-2 placeholder:text-gray-500"
        >
          <option value="">Select State</option>
          {states.map((state) => (
            <option key={state.id} value={state.id}>
              {state.name}
            </option>
          ))}
        </select>
      )}
    </div>
  );
}
