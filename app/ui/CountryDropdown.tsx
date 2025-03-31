// components/CountryDropdown.tsx
"use client";

import { useEffect, useState } from "react";
import { fetchCountry } from "../lib/actions";

interface Option {
  id: string;
  name: string;
}

interface CountryDropdownProps {
  selected?: string;
  onSelect: (id: string) => void;
}

export default function CountryDropdown({ selected, onSelect }: CountryDropdownProps) {
  const [countries, setCountries] = useState<Option[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCountries() {
      try {
        const data = await fetchCountry();
        setCountries(data);
      } catch (error) {
        console.error("Error fetching countries:", error);
        setError("Failed to load countries");
      } finally {
        setLoading(false);
      }
    }
    fetchCountries();
  }, []);

  return (
    <div>
      <label htmlFor="country" className="mb-2 block text-sm font-medium">
        Country
      </label>
      {loading ? (
        <p className="text-sm text-gray-500">Loading countries...</p>
      ) : error ? (
        <p className="text-sm text-red-500">{error}</p>
      ) : (
        <select
          id="country"
          value={selected || ""}
          onChange={(e) => onSelect(e.target.value)}
          className="block w-full rounded-md border border-gray-200 py-2 px-3 text-sm outline-2 placeholder:text-gray-500"
        >
          <option value="">Select Country</option>
          {countries.map((country) => (
            <option key={country.id} value={country.id}>
              {country.name}
            </option>
          ))}
        </select>
      )}
    </div>
  );
}

