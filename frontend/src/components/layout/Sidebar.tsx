// frontend/src/components/layout/Sidebar.tsx
import React from "react";
import {
  ChartBarIcon,
  UserGroupIcon,
  ChatBubbleLeftRightIcon,
  CogIcon,
} from "@heroicons/react/24/outline";

interface SidebarProps {
  currentPage: string;
  onNavigate: (page: "dashboard" | "leads" | "messages") => void;
}

const navigation = [
  { name: "Dashboard", key: "dashboard", icon: ChartBarIcon },
  { name: "Leads", key: "leads", icon: UserGroupIcon },
  { name: "Messages", key: "messages", icon: ChatBubbleLeftRightIcon },
];

const Sidebar: React.FC<SidebarProps> = ({ currentPage, onNavigate }) => {
  return (
    <div className="hidden md:flex md:w-64 md:flex-col">
      <div className="flex flex-col flex-grow pt-5 bg-white overflow-y-auto shadow-sm">
        {/* Logo */}
        <div className="flex items-center flex-shrink-0 px-4">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">G</span>
            </div>
            <div className="ml-3">
              <h1 className="text-xl font-bold text-gray-900">Grok SDR</h1>
              <p className="text-xs text-gray-500">Sales Assistant</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="mt-8 flex-1 px-2 space-y-1">
          {navigation.map((item) => {
            const isActive = currentPage === item.key;
            return (
              <button
                key={item.key}
                onClick={() => onNavigate(item.key as any)}
                className={`${
                  isActive
                    ? "bg-primary-50 border-r-2 border-primary-600 text-primary-700"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                } group flex items-center w-full px-2 py-2 text-sm font-medium rounded-md transition-colors`}>
                <item.icon
                  className={`${
                    isActive
                      ? "text-primary-500"
                      : "text-gray-400 group-hover:text-gray-500"
                  } mr-3 flex-shrink-0 h-6 w-6`}
                />
                {item.name}
              </button>
            );
          })}
        </nav>

        {/* Bottom section */}
        <div className="flex-shrink-0 p-4 border-t border-gray-200">
          <button className="group flex items-center w-full px-2 py-2 text-sm font-medium text-gray-600 rounded-md hover:text-gray-900 hover:bg-gray-50">
            <CogIcon className="text-gray-400 group-hover:text-gray-500 mr-3 flex-shrink-0 h-6 w-6" />
            Settings
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
