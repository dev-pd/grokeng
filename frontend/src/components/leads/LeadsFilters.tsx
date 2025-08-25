// components/leads/LeadsFilters.tsx
import React from "react";
import { FunnelIcon } from "@heroicons/react/24/outline";

interface LeadsFiltersProps {
  filters: {
    status?: string;
    industry?: string;
    company_size?: string;
    score_range?: string;
    search?: string;
  };
  onFilterChange: (key: string, value: string) => void;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onResetFilters: () => void;
}

const LeadsFilters: React.FC<LeadsFiltersProps> = ({
  filters,
  onFilterChange,
  onSearchChange,
  onResetFilters,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-gray-900">Filters</h3>
        <button
          className="btn-outline text-sm"
          onClick={onResetFilters}>
          <FunnelIcon className="h-4 w-4 mr-2" />
          Reset Filters
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div>
          <label className="label">Status</label>
          <select
            className="input"
            value={filters.status || "All Statuses"}
            onChange={(e) => onFilterChange("status", e.target.value)}>
            <option>All Statuses</option>
            <option>New Lead</option>
            <option>Qualified</option>
            <option>Contacted</option>
            <option>Converted</option>
            <option>Not Qualified</option>
          </select>
        </div>
        <div>
          <label className="label">Industry</label>
          <select
            className="input"
            value={filters.industry || "All Industries"}
            onChange={(e) => onFilterChange("industry", e.target.value)}>
            <option>All Industries</option>
            <option>Technology</option>
            <option>Healthcare</option>
            <option>Finance</option>
          </select>
        </div>
        <div>
          <label className="label">Company Size</label>
          <select
            className="input"
            value={filters.company_size || "All Sizes"}
            onChange={(e) => onFilterChange("company_size", e.target.value)}>
            <option>All Sizes</option>
            <option>1-10</option>
            <option>11-50</option>
            <option>51-200</option>
            <option>200+</option>
          </select>
        </div>
        <div>
          <label className="label">Score Range</label>
          <select
            className="input"
            value={filters.score_range || "All Scores"}
            onChange={(e) => onFilterChange("score_range", e.target.value)}>
            <option>All Scores</option>
            <option>High (80-100)</option>
            <option>Medium (50-79)</option>
            <option>Low (0-49)</option>
          </select>
        </div>
        <div>
          <label className="label">Search</label>
          <input
            type="text"
            className="input"
            placeholder="Search by name, email, or company"
            value={filters.search || ""}
            onChange={onSearchChange}
          />
        </div>
      </div>
    </div>
  );
};

export default LeadsFilters;
