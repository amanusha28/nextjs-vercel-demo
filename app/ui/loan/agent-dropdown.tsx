"use client"; // Ensure it's a client component

import { useEffect, useState } from "react";
import { fetchAllAgent } from "@/app/lib/data";

export default function AgentDropdownInput({
  onChange,
}: {
  onChange: (agent_1: string | null, agent_2: string | null) => void;
}) {
  const [agent1Query, setAgent1Query] = useState("");
  const [agent2Query, setAgent2Query] = useState("");
  const [selectedAgent1, setSelectedAgent1] = useState<string | null>(null);
  const [selectedAgent2, setSelectedAgent2] = useState<string | null>(null);
  const [data, setData] = useState<{ id: string; name: string }[]>([]);
  const [showDropdown1, setShowDropdown1] = useState(false);
  const [showDropdown2, setShowDropdown2] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAgents() {
      try {
        const agents = await fetchAllAgent();
        setData(agents.filter((agent) => agent.name !== null) as { id: string; name: string }[]);
      } catch (error) {
        console.error("Error fetching agents:", error);
      } finally {
        setLoading(false);
      }
    }
    loadAgents();
  }, []);

  const handleSelectAgent1 = (id: string, name: string) => {
    setAgent1Query(name);
    setSelectedAgent1(id);
    setShowDropdown1(false);
    onChange(id, selectedAgent2);
  };

  const handleSelectAgent2 = (id: string, name: string) => {
    setAgent2Query(name);
    setSelectedAgent2(id);
    setShowDropdown2(false);
    onChange(selectedAgent1, id);
  };

  return (
    <div className="">
      <div className="flex flex-col md:flex-row gap-4 w-full gap-y-6">
        {/* Agent 1 */}
        <div className="relative w-full z-50">
          <label htmlFor="agent1" className="mb-2 block text-sm font-medium">
            Agent 1
          </label>
          <input
            type="text"
            value={agent1Query}
            onChange={(e) => {
              setAgent1Query(e.target.value);
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
                    onMouseDown={() => handleSelectAgent1(item.id, item.name)}
                  >
                    {item.name}
                  </li>
                ))}
              </ul>
            )
          )}
        </div>

        {/* Agent 2 */}
        <div className="relative w-full z-50">
          <label htmlFor="agent2" className="mb-2 block text-sm font-medium">
            Agent 2
          </label>
          <input
            type="text"
            value={agent2Query}
            onChange={(e) => {
              setAgent2Query(e.target.value);
              setShowDropdown2(e.target.value.length > 0);
            }}
            onBlur={() => setTimeout(() => setShowDropdown2(false), 200)}
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Search..."
          />
          {loading ? (
            <p className="text-gray-500 mt-1">Loading...</p>
          ) : (
            showDropdown2 &&
            data.length > 0 && (
              <ul className="absolute w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-40 overflow-auto">
                {data.map((item) => (
                  <li
                    key={item.id}
                    className="p-2 cursor-pointer hover:bg-blue-500 hover:text-white"
                    onMouseDown={() => handleSelectAgent2(item.id, item.name)}
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
