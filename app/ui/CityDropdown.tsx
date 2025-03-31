// components/CityDropdown.tsx
"use client";

import { useEffect, useState } from "react";
import { fetchCity } from "../lib/actions";

interface Option {
  id: string;
  name: string;
}

interface CityDropdownProps {
  selected?: string;
  onSelect: (id: string) => void;
}

export default function CityDropdown({ selected, onSelect }: CityDropdownProps) {
  const [city, setCity] = useState<Option[]>([]);
  const [loading, setLoading] = useState(true);

  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    async function fetchCities() {
      try {
        const data = await fetchCity();
        setCity(data);
      } catch (error) {
        console.error("Error fetching city:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchCities();
  }, []);

  if (loading) return <p>Loading city...</p>;

  return (
    <div>
      <label htmlFor="country" className="mb-2 block text-sm font-medium">
        City
      </label>
      {loading ? (
        <p className="text-sm text-gray-500">Loading city...</p>
      ) : error ? (
        <p className="text-sm text-red-500">{error}</p>
      ) : (
        <select
          id="city"
          value={selected || ""}
          onChange={(e) => onSelect(e.target.value)}
          className="block w-full rounded-md border border-gray-200 py-2 px-3 text-sm outline-2 placeholder:text-gray-500"
        >
          <option value="">Select Country</option>
          {city.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      )}
    </div>
  );
}
