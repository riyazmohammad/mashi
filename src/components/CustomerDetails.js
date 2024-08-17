import React from 'react';

const CustomerDetails = ({ details, isEditing, onChange }) => {
  if (isEditing) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Customer Name</label>
          <input
            type="text"
            name="customer_name"
            value={details.customer_name || ''}
            onChange={onChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Phone Number</label>
          <input
            type="text"
            name="customer_phone_number"
            value={details.customer_phone_number || ''}
            onChange={onChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="mb-6">
      <h4 className="text-lg font-semibold mb-2">Customer Details</h4>
      <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
        <div className="sm:col-span-1">
          <dt className="text-sm font-medium text-gray-500">Customer Name</dt>
          <dd className="mt-1 text-sm text-gray-900">{details.customer_name || 'N/A'}</dd>
        </div>
        <div className="sm:col-span-1">
          <dt className="text-sm font-medium text-gray-500">Phone Number</dt>
          <dd className="mt-1 text-sm text-gray-900">{details.customer_phone_number || 'N/A'}</dd>
        </div>
      </dl>
    </div>
  );
};

export default CustomerDetails;