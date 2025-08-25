// components/leads/AddLeadModal.tsx
import React, { useState } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import type { LeadCreate } from "../../types";

interface AddLeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (leadData: LeadCreate) => Promise<void>;
}

const AddLeadModal: React.FC<AddLeadModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [newLead, setNewLead] = useState<LeadCreate>({
    first_name: "",
    last_name: "",
    email: "",
    company: "",
    title: "",
    phone: "",
    industry: "",
    company_size: "",
    budget_range: "",
    lead_source: "",
    notes: "",
    linkedin_url: "",
    website: "",
  });

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    setNewLead((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    // Clear error when user starts typing
    if (error) setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      await onSubmit(newLead);
      // Reset form on success
      setNewLead({
        first_name: "",
        last_name: "",
        email: "",
        company: "",
        title: "",
        phone: "",
        industry: "",
        company_size: "",
        budget_range: "",
        lead_source: "",
        notes: "",
        linkedin_url: "",
        website: "",
      });
    } catch (err: any) {
      setError(err.message || "Failed to create lead");
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!submitting) {
      setError(null);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Add New Lead</h3>
          <button
            onClick={handleClose}
            disabled={submitting}
            className="text-gray-400 hover:text-gray-600">
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Basic Information */}
            <div>
              <label className="label">First Name *</label>
              <input
                type="text"
                name="first_name"
                className="input"
                value={newLead.first_name}
                onChange={handleInputChange}
                required
                disabled={submitting}
              />
            </div>

            <div>
              <label className="label">Last Name *</label>
              <input
                type="text"
                name="last_name"
                className="input"
                value={newLead.last_name}
                onChange={handleInputChange}
                required
                disabled={submitting}
              />
            </div>

            <div>
              <label className="label">Email *</label>
              <input
                type="email"
                name="email"
                className="input"
                value={newLead.email}
                onChange={handleInputChange}
                required
                disabled={submitting}
              />
            </div>

            <div>
              <label className="label">Phone</label>
              <input
                type="tel"
                name="phone"
                className="input"
                value={newLead.phone}
                onChange={handleInputChange}
                disabled={submitting}
              />
            </div>

            {/* Company Information */}
            <div>
              <label className="label">Company</label>
              <input
                type="text"
                name="company"
                className="input"
                value={newLead.company}
                onChange={handleInputChange}
                disabled={submitting}
              />
            </div>

            <div>
              <label className="label">Job Title</label>
              <input
                type="text"
                name="title"
                className="input"
                value={newLead.title}
                onChange={handleInputChange}
                disabled={submitting}
              />
            </div>

            <div>
              <label className="label">Industry</label>
              <select
                name="industry"
                className="input"
                value={newLead.industry}
                onChange={handleInputChange}
                disabled={submitting}>
                <option value="">Select Industry</option>
                <option value="Technology">Technology</option>
                <option value="Healthcare">Healthcare</option>
                <option value="Finance">Finance</option>
                <option value="Education">Education</option>
                <option value="Manufacturing">Manufacturing</option>
                <option value="Retail">Retail</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="label">Company Size</label>
              <select
                name="company_size"
                className="input"
                value={newLead.company_size}
                onChange={handleInputChange}
                disabled={submitting}>
                <option value="">Select Size</option>
                <option value="1-10">1-10 employees</option>
                <option value="11-50">11-50 employees</option>
                <option value="51-200">51-200 employees</option>
                <option value="201-1000">201-1000 employees</option>
                <option value="1000+">1000+ employees</option>
              </select>
            </div>

            <div>
              <label className="label">Budget Range</label>
              <select
                name="budget_range"
                className="input"
                value={newLead.budget_range}
                onChange={handleInputChange}
                disabled={submitting}>
                <option value="">Select Budget Range</option>
                <option value="Under $10K">Under $10K</option>
                <option value="$10K - $50K">$10K - $50K</option>
                <option value="$50K - $100K">$50K - $100K</option>
                <option value="$100K - $500K">$100K - $500K</option>
                <option value="$500K+">$500K+</option>
              </select>
            </div>

            <div>
              <label className="label">Lead Source</label>
              <select
                name="lead_source"
                className="input"
                value={newLead.lead_source}
                onChange={handleInputChange}
                disabled={submitting}>
                <option value="">Select Source</option>
                <option value="Website">Website</option>
                <option value="LinkedIn">LinkedIn</option>
                <option value="Email Campaign">Email Campaign</option>
                <option value="Cold Outreach">Cold Outreach</option>
                <option value="Referral">Referral</option>
                <option value="Event">Event</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* URLs */}
            <div>
              <label className="label">LinkedIn URL</label>
              <input
                type="url"
                name="linkedin_url"
                className="input"
                value={newLead.linkedin_url}
                onChange={handleInputChange}
                placeholder="https://linkedin.com/in/..."
                disabled={submitting}
              />
            </div>

            <div>
              <label className="label">Company Website</label>
              <input
                type="url"
                name="website"
                className="input"
                value={newLead.website}
                onChange={handleInputChange}
                placeholder="https://..."
                disabled={submitting}
              />
            </div>
          </div>

          {/* Notes - Full width */}
          <div className="mt-4">
            <label className="label">Notes</label>
            <textarea
              name="notes"
              className="input"
              rows={3}
              value={newLead.notes}
              onChange={handleInputChange}
              placeholder="Additional notes about this lead..."
              disabled={submitting}
            />
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              className="btn-outline"
              onClick={handleClose}
              disabled={submitting}>
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary"
              disabled={submitting}>
              {submitting ? "Creating..." : "Create Lead"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddLeadModal;
