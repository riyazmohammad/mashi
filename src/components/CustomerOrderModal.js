import React, { useState } from 'react';

const CustomerOrderModal = ({ customer, onClose }) => {
  const [expandedOrderId, setExpandedOrderId] = useState(null);

  const toggleAccordion = (orderId) => {
    setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full" id="my-modal">
      <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
        <div className="mt-3">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Orders for {customer.name}</h3>
          <div className="mt-2 px-7 py-3">
            {customer.orders.map((order) => (
              <div key={order.id} className="mb-4 border rounded">
                <div
                  className="flex justify-between items-center p-4 cursor-pointer bg-gray-100"
                  onClick={() => toggleAccordion(order.id)}
                >
                  <h4 className="text-lg font-semibold">Order #{order.order_id}</h4>
                  <span>{expandedOrderId === order.id ? '▲' : '▼'}</span>
                </div>
                {expandedOrderId === order.id && (
                  <div className="p-4">
                    <p>Date: {new Date(order.order_date).toLocaleDateString()}</p>
                    <p>Total: ${order.total}</p>
                    <h5 className="font-semibold mt-2">Items:</h5>
                    <ul>
                      {order.OrderItems.map((item) => (
                        <li key={item.id}>
                          {item.item_name} - Quantity: {item.quantity}, Price: ${item.price}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="items-center px-4 py-3">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-500 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-300"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerOrderModal;