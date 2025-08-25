// components/leads/MessageModal.tsx
import React, { useState } from "react";
import {
  XMarkIcon,
  ClipboardDocumentIcon,
  CheckIcon,
  ChatBubbleLeftRightIcon,
  EnvelopeIcon,
  PhoneIcon,
  CalendarIcon,
} from "@heroicons/react/24/outline";
import type { Lead, GrokMessageResponse } from "../../types";

interface MessageModalProps {
  isOpen: boolean;
  onClose: () => void;
  lead: Lead;
  message: GrokMessageResponse;
  onGenerateNew: (
    lead: Lead,
    messageType: "email" | "linkedin" | "call" | "meeting"
  ) => Promise<void>;
}

const MessageModal: React.FC<MessageModalProps> = ({
  isOpen,
  onClose,
  lead,
  message,
  onGenerateNew,
}) => {
  const [copied, setCopied] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState<"content" | "preview">("content");

  if (!isOpen) return null;

  const handleCopyToClipboard = async (
    text: string,
    field: string = "content"
  ) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setCopiedField(field);
      setTimeout(() => {
        setCopied(false);
        setCopiedField(null);
      }, 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  const handleGenerateNew = async (
    messageType: "email" | "linkedin" | "call" | "meeting"
  ) => {
    setGenerating(true);
    try {
      await onGenerateNew(lead, messageType);
    } catch (error) {
      console.error("Failed to generate new message:", error);
    } finally {
      setGenerating(false);
    }
  };

  const getMessageTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "email":
        return <EnvelopeIcon className="h-4 w-4" />;
      case "linkedin":
        return <ChatBubbleLeftRightIcon className="h-4 w-4" />;
      case "call":
        return <PhoneIcon className="h-4 w-4" />;
      case "meeting":
        return <CalendarIcon className="h-4 w-4" />;
      default:
        return <ChatBubbleLeftRightIcon className="h-4 w-4" />;
    }
  };

  const getPersonalizationBadge = (level: string) => {
    const colors = {
      high: "bg-green-100 text-green-800 border-green-200",
      medium: "bg-yellow-100 text-yellow-800 border-yellow-200",
      low: "bg-red-100 text-red-800 border-red-200",
      basic: "bg-gray-100 text-gray-800 border-gray-200",
    };

    return colors[level as keyof typeof colors] || colors.basic;
  };

  const formatMessageForEmail = () => {
    if (message.message.message_type !== "email")
      return message.message.content;

    return `Subject: ${message.message.subject || "Follow up"}

${message.message.content}

Best regards,
[Your Name]
[Your Title]
[Your Company]
[Your Contact Information]`;
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                {getMessageTypeIcon(message.message.message_type)}
                <span className="ml-2 capitalize">
                  {message.message.message_type} Message for {lead.first_name}{" "}
                  {lead.last_name}
                </span>
              </h3>
              <div className="flex items-center space-x-4 mt-2">
                <p className="text-sm text-gray-600">
                  {lead.title} at {lead.company} • {lead.email}
                </p>
                <span
                  className={`px-2 py-1 text-xs font-medium rounded border ${getPersonalizationBadge(
                    message.message.personalization_level
                  )}`}>
                  {message.message.personalization_level} personalization
                </span>
                {message.message.grok_generated && (
                  <span className="px-2 py-1 text-xs font-medium rounded bg-blue-100 text-blue-800 border border-blue-200">
                    AI Generated
                  </span>
                )}
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors">
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav
            className="flex space-x-8 px-6"
            aria-label="Tabs">
            <button
              onClick={() => setActiveTab("content")}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === "content"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}>
              Content
            </button>
            <button
              onClick={() => setActiveTab("preview")}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === "preview"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}>
              Email Preview
            </button>
          </nav>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          {activeTab === "content" && (
            <div className="space-y-6">
              {/* Subject Line (for emails) */}
              {message.message.subject && (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Subject Line
                    </label>
                    <button
                      onClick={() =>
                        handleCopyToClipboard(
                          message.message.subject,
                          "subject"
                        )
                      }
                      className="flex items-center text-xs text-gray-500 hover:text-gray-700 transition-colors">
                      {copied && copiedField === "subject" ? (
                        <>
                          <CheckIcon className="h-4 w-4 mr-1 text-green-500" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <ClipboardDocumentIcon className="h-4 w-4 mr-1" />
                          Copy
                        </>
                      )}
                    </button>
                  </div>
                  <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                    <p className="text-sm font-medium text-gray-900">
                      {message.message.subject}
                    </p>
                  </div>
                </div>
              )}

              {/* Message Content */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Message Content
                  </label>
                  <button
                    onClick={() =>
                      handleCopyToClipboard(message.message.content, "content")
                    }
                    className="flex items-center text-xs text-gray-500 hover:text-gray-700 transition-colors">
                    {copied && copiedField === "content" ? (
                      <>
                        <CheckIcon className="h-4 w-4 mr-1 text-green-500" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <ClipboardDocumentIcon className="h-4 w-4 mr-1" />
                        Copy
                      </>
                    )}
                  </button>
                </div>
                <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                  <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
                    {message.message.content}
                  </p>
                </div>
              </div>

              {/* Message Details */}
              <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                <h4 className="text-sm font-medium text-blue-900 mb-3">
                  Message Details
                </h4>
                <dl className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <dt className="font-medium text-blue-800">Message Type:</dt>
                    <dd className="text-blue-700 capitalize">
                      {message.message.message_type}
                    </dd>
                  </div>
                  <div>
                    <dt className="font-medium text-blue-800">
                      Generated For:
                    </dt>
                    <dd className="text-blue-700">
                      {message.message.generated_for}
                    </dd>
                  </div>
                  <div>
                    <dt className="font-medium text-blue-800">Company:</dt>
                    <dd className="text-blue-700">{message.message.company}</dd>
                  </div>
                  <div>
                    <dt className="font-medium text-blue-800">
                      Personalization:
                    </dt>
                    <dd className="text-blue-700 capitalize">
                      {message.message.personalization_level}
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
          )}

          {activeTab === "preview" && (
            <div className="space-y-4">
              <div className="bg-white border border-gray-300 rounded-lg shadow-sm">
                {/* Email Header */}
                <div className="bg-gray-100 px-4 py-3 border-b border-gray-300">
                  <div className="space-y-2 text-sm">
                    <div className="flex">
                      <span className="text-gray-600 w-16">To:</span>
                      <span className="text-gray-900">{lead.email}</span>
                    </div>
                    <div className="flex">
                      <span className="text-gray-600 w-16">From:</span>
                      <span className="text-gray-900">you@yourcompany.com</span>
                    </div>
                    <div className="flex">
                      <span className="text-gray-600 w-16">Subject:</span>
                      <span className="text-gray-900 font-medium">
                        {message.message.subject || "Follow up"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Email Body */}
                <div className="p-4">
                  <pre className="text-sm text-gray-700 whitespace-pre-wrap font-sans leading-relaxed">
                    {formatMessageForEmail()}
                  </pre>
                </div>
              </div>

              <button
                onClick={() =>
                  handleCopyToClipboard(formatMessageForEmail(), "email")
                }
                className="w-full btn-outline flex items-center justify-center">
                {copied && copiedField === "email" ? (
                  <>
                    <CheckIcon className="h-4 w-4 mr-2 text-green-500" />
                    Copied Full Email!
                  </>
                ) : (
                  <>
                    <ClipboardDocumentIcon className="h-4 w-4 mr-2" />
                    Copy Full Email
                  </>
                )}
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-between items-center">
          <div className="flex space-x-2">
            <button
              className="btn btn-sm btn-outline"
              onClick={() => handleGenerateNew("email")}
              disabled={generating}>
              <EnvelopeIcon className="h-4 w-4 mr-1" />
              {generating ? "Generating..." : "New Email"}
            </button>
            <button
              className="btn btn-sm btn-outline"
              onClick={() => handleGenerateNew("linkedin")}
              disabled={generating}>
              <ChatBubbleLeftRightIcon className="h-4 w-4 mr-1" />
              LinkedIn
            </button>
            <button
              className="btn btn-sm btn-outline"
              onClick={() => handleGenerateNew("call")}
              disabled={generating}>
              <PhoneIcon className="h-4 w-4 mr-1" />
              Call Script
            </button>
            <button
              className="btn btn-sm btn-outline"
              onClick={() => handleGenerateNew("meeting")}
              disabled={generating}>
              <CalendarIcon className="h-4 w-4 mr-1" />
              Meeting
            </button>
          </div>

          <div className="flex space-x-3">
            <button
              className="btn-outline"
              onClick={onClose}>
              Close
            </button>
            <button
              className="btn-primary"
              onClick={() =>
                handleCopyToClipboard(
                  activeTab === "preview"
                    ? formatMessageForEmail()
                    : message.message.content
                )
              }>
              {copied ? "Copied!" : "Copy & Use"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageModal;
