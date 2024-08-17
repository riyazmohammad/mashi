import React from 'react';

const OrderItemsTable = ({ items, isEditing, onItemChange, onRemoveItem }) => {
  if (isEditing) {
    return (
      <table className="min-w-full bg-white border border-gray-300 mb-4">
        <thead className="bg-gray-100">
          <tr>
            <th className="py-2 px-4 border-b">Item Name</th>
            <th className="py-2 px-4 border-b">Price (QAR)</th>
            <th className="py-2 px-4 border-b">Quantity</th>
            <th className="py-2 px-4 border-b">Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, index) => (
            <tr key={index}>
              <td className="border-b p-2">
                <input
                  type="text"
                  name="item_name"
                  value={item.item_name || ''}
                  onChange={(e) => onItemChange(index, e)}
                  className="w-full p-1 border rounded"
                />
              </td>
              <td className="border-b p-2">
                <input
                  type="number"
                  name="price"
                  value={item.price || 0}
                  onChange={(e) => onItemChange(index, e)}
                  className="w-full p-1 border rounded"
                />
              </td>
              <td className="border-b p-2">
                <input
                  type="number"
                  name="quantity"
                  value={item.quantity || 0}
                  onChange={(e) => onItemChange(index, e)}
                  className="w-full p-1 border rounded"
                />
              </td>
              <td className="border-b p-2">
                <button
                  onClick={() => onRemoveItem(index)}
                  className="bg-red-500 text-white px-2 py-1 rounded text-sm"
                >
                  Remove
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  }

  return (
    <table className="min-w-full bg-white border border-gray-300">
      <thead className="bg-gray-50">
        <tr>
          <th className="py-2 px-4 border-b">Item Name</th>
          <th className="py-2 px-4 border-b">Price</th>
          <th className="py-2 px-4 border-b">Quantity</th>
          <th className="py-2 px-4 border-b">Total</th>
        </tr>
      </thead>
      <tbody>
        {items.map((item, index) => (
          <tr key={index}>
            <td className="border-b px-4 py-2">{item.item_name}</td>
            <td className="border-b px-4 py-2">QAR {Number(item.price).toFixed(2)}</td>
            <td className="border-b px-4 py-2">{item.quantity}</td>
            <td className="border-b px-4 py-2">QAR {(Number(item.price) * Number(item.quantity)).toFixed(2)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default OrderItemsTable;