// frontend/src/pages/messages/MessagesPage.tsx
import React from "react";
import {
  PlusIcon,
  ChatBubbleLeftRightIcon,
  EnvelopeIcon,
  PhoneIcon,
  SparklesIcon,
} from "@heroicons/react/24/outline";

const MessagesPage: React.FC = () => {
  const messageTypes = [
    { name: "Email", icon: EnvelopeIcon, color: "bg-blue-500", count: 0 },
    {
      name: "LinkedIn",
      icon: ChatBubbleLeftRightIcon,
      color: "bg-indigo-500",
      count: 0,
    },
    { name: "Call", icon: PhoneIcon, color: "bg-green-500", count: 0 },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Messages & Outreach
          </h2>
          <p className="text-gray-600 mt-1">
            Create personalized messages with Grok AI assistance
          </p>
        </div>
        <div className="flex space-x-3">
          <button className="btn-outline">
            <SparklesIcon className="h-5 w-5 mr-2" />
            Generate with Grok
          </button>
          <button className="btn-primary">
            <PlusIcon className="h-5 w-5 mr-2" />
            New Message
          </button>
        </div>
      </div>

      {/* Message Type Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {messageTypes.map((type) => (
          <div
            key={type.name}
            className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className={`${type.color} p-3 rounded-lg`}>
                <type.icon className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  {type.name} Messages
                </p>
                <p className="text-2xl font-bold text-gray-900">{type.count}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Quick Actions
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors text-center">
            <EnvelopeIcon className="h-8 w-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm font-medium text-gray-700">
              Create Email Template
            </p>
          </button>
          <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors text-center">
            <ChatBubbleLeftRightIcon className="h-8 w-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm font-medium text-gray-700">
              LinkedIn Outreach
            </p>
          </button>
          <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors text-center">
            <SparklesIcon className="h-8 w-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm font-medium text-gray-700">
              AI-Generated Message
            </p>
          </button>
        </div>
      </div>

      {/* Recent Messages */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">
            Recent Messages (0)
          </h3>
        </div>

        {/* Empty State */}
        <div className="text-center py-12">
          <div className="w-12 h-12 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <ChatBubbleLeftRightIcon className="h-6 w-6 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No messages yet
          </h3>
          <p className="text-gray-500 mb-6">
            Create your first personalized outreach message with Grok AI
          </p>
          <div className="flex justify-center space-x-3">
            <button className="btn-primary">
              <SparklesIcon className="h-5 w-5 mr-2" />
              Generate with Grok
            </button>
            <button className="btn-outline">
              <PlusIcon className="h-5 w-5 mr-2" />
              Create Manually
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessagesPage;
