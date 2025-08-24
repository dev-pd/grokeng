// frontend/src/components/layout/Header.tsx
import React from "react";
import { BellIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";

interface HeaderProps {
  currentPage: string;
}

const pageTitle = {
  dashboard: "Dashboard",
  leads: "Lead Management",
  messages: "Messages & Outreach",
};

const Header: React.FC<HeaderProps> = ({ currentPage }) => {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Left side */}
          <div className="flex items-center">
            <h1 className="text-2xl font-semibold text-gray-900">
              {pageTitle[currentPage as keyof typeof pageTitle] || "Grok SDR"}
            </h1>
          </div>

          {/* Right side */}
          <div className="flex items-center space-x-4">
            {/* Search */}
            <div className="relative hidden md:block">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search leads..."
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              />
            </div>

            {/* Notifications */}
            <button className="p-2 text-gray-400 hover:text-gray-500 relative">
              <BellIcon className="h-6 w-6" />
              <span className="absolute top-1 right-1 block h-2 w-2 rounded-full bg-red-400"></span>
            </button>

            {/* Profile */}
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">JD</span>
              </div>
              <div className="hidden md:block">
                <div className="text-sm font-medium text-gray-700">
                  John Doe
                </div>
                <div className="text-xs text-gray-500">Sales Manager</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
