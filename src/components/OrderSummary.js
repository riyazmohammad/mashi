import React from 'react';

const OrderSummary = ({ details, isEditing, onChange }) => {
  const formatCurrency = (value) => {
    const num = parseFloat(value);
    return isNaN(num) ? 'N/A' : `QAR ${num.toFixed(2)}`;
  };

  if (isEditing) {
    return (
      <div className="mb-6">
        <h4 className="text-lg font-semibold mb-2">Order Summary</h4>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Order ID</label>
            <input
              type="text"
              name="order_id"
              value={details.order_id || ''}
              onChange={onChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Order Date</label>
            <input
              type="text"
              name="order_date"
              value={details.order_date || ''}
              onChange={onChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Delivery Fees (QAR)</label>
            <input
              type="number"
              name="delivery_fees"
              value={details.delivery_fees || 0}
              onChange={onChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Discount (QAR)</label>
            <input
              type="number"
              name="discount"
              value={details.discount || 0}
              onChange={onChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            />
          </div>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Subtotal Amount (QAR)</label>
          <input
            type="number"
            name="subtotal_amount"
            value={details.subtotal_amount || 0}
            readOnly
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 bg-gray-100"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Total (QAR)</label>
          <input
            type="number"
            name="total"
            value={details.total || 0}
            readOnly
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 bg-gray-100 text-lg font-bold"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="mb-6">
      <h4 className="text-lg font-semibold mb-2">Order Summary</h4>
      <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
        <div className="sm:col-span-1">
          <dt className="text-sm font-medium text-gray-500">Order ID</dt>
          <dd className="mt-1 text-sm text-gray-900">{details.order_id || 'N/A'}</dd>
        </div>
        <div className="sm:col-span-1">
          <dt className="text-sm font-medium text-gray-500">Order Date</dt>
          <dd className="mt-1 text-sm text-gray-900">{details.order_date || 'N/A'}</dd>
        </div>
        <div className="sm:col-span-1">
          <dt className="text-sm font-medium text-gray-500">Delivery Fees</dt>
          <dd className="mt-1 text-sm text-gray-900">{formatCurrency(details.delivery_fees)}</dd>
        </div>
        <div className="sm:col-span-1">
          <dt className="text-sm font-medium text-gray-500">Discount</dt>
          <dd className="mt-1 text-sm text-gray-900">{formatCurrency(details.discount)}</dd>
        </div>
        <div className="sm:col-span-1">
          <dt className="text-sm font-medium text-gray-500">Subtotal Amount</dt>
          <dd className="mt-1 text-sm text-gray-900">{formatCurrency(details.subtotal_amount)}</dd>
        </div>
        <div className="sm:col-span-2">
          <dt className="text-base font-medium text-gray-900">Total</dt>
          <dd className="mt-1 text-2xl font-semibold text-gray-900">{formatCurrency(details.total)}</dd>
        </div>
      </dl>
    </div>
  );
};

export default OrderSummary;