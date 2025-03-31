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
  const [data, setData] = useState<{ id: string; name: string }[]>([]);

  const [showDropdown1, setShowDropdown1] = useState(false);
  const [showDropdown2, setShowDropdown2] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAgents() {
      try {
        const agents = await fetchAllAgent(); // Fetch only once
        setData(agents.filter((agent) => agent.name !== null) as { id: string; name: string }[]);
      } catch (error) {
        console.error("Error fetching agents:", error);
      } finally {
        setLoading(false);
      }
    }
    loadAgents();
  }, []); // Empty dependency array ensures it runs only once

  return (
    <div className="">
      {/* <h2 className="font-bold">Select Agent</h2> */}
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
              onChange(e.target.value, agent2Query);
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
                    onMouseDown={() => setAgent1Query(item.name)}
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
              onChange(agent1Query, e.target.value);
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
                    onMouseDown={() => setAgent2Query(item.name)}
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
