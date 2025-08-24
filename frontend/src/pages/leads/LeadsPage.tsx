// frontend/src/pages/leads/LeadsPage.tsx
import React from "react";
import {
  PlusIcon,
  FunnelIcon,
  ArrowDownTrayIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";

const LeadsPage: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Lead Management</h2>
          <p className="text-gray-600 mt-1">
            Manage and qualify your sales leads with AI assistance
          </p>
        </div>
        <div className="flex space-x-3">
          <button className="btn-outline">
            <ArrowDownTrayIcon className="h-5 w-5 mr-2" />
            Import
          </button>
          <button className="btn-primary">
            <PlusIcon className="h-5 w-5 mr-2" />
            Add Lead
          </button>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">Filters</h3>
          <button className="btn-outline text-sm">
            <FunnelIcon className="h-4 w-4 mr-2" />
            Reset Filters
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="label">Status</label>
            <select className="input">
              <option>All Statuses</option>
              <option>New Lead</option>
              <option>Qualified</option>
              <option>Contacted</option>
              <option>Converted</option>
            </select>
          </div>
          <div>
            <label className="label">Industry</label>
            <select className="input">
              <option>All Industries</option>
              <option>Technology</option>
              <option>Healthcare</option>
              <option>Finance</option>
            </select>
          </div>
          <div>
            <label className="label">Company Size</label>
            <select className="input">
              <option>All Sizes</option>
              <option>1-10</option>
              <option>11-50</option>
              <option>51-200</option>
              <option>200+</option>
            </select>
          </div>
          <div>
            <label className="label">Score Range</label>
            <select className="input">
              <option>All Scores</option>
              <option>High (80-100)</option>
              <option>Medium (50-79)</option>
              <option>Low (0-49)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Leads Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">All Leads (0)</h3>
        </div>

        {/* Empty State */}
        <div className="text-center py-12">
          <div className="w-12 h-12 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <UserGroupIcon className="h-6 w-6 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No leads yet
          </h3>
          <p className="text-gray-500 mb-6">
            Start by adding your first lead or importing from a CSV file
          </p>
          <div className="flex justify-center space-x-3">
            <button className="btn-primary">
              <PlusIcon className="h-5 w-5 mr-2" />
              Add First Lead
            </button>
            <button className="btn-outline">
              <ArrowDownTrayIcon className="h-5 w-5 mr-2" />
              Import CSV
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeadsPage;
