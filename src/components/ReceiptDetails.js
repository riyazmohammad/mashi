import React, { useState, useEffect } from 'react';
import OrderItemsTable from './OrderItemsTable';
import CustomerDetails from './CustomerDetails';
import OrderSummary from './OrderSummary';

const ReceiptDetails = ({ details = {}, partner, onApprove, onEdit }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isApproving, setIsApproving] = useState(false);
  const [editedDetails, setEditedDetails] = useState({
    order_id: '',
    order_date: '',
    customer_name: '',
    customer_phone_number: '',
    order_items: [],
    subtotal_amount: 0,
    delivery_fees: 0,
    discount: 0,
    total: 0,
  });

  useEffect(() => {
    setEditedDetails(details);
  }, [details]);

  const recalculateTotals = (items, delivery_fees, discount) => {
    const subtotal = items.reduce((sum, item) => sum + Number(item.price), 0);
    const total = subtotal + Number(delivery_fees) - Number(discount);
    return { subtotal, total };
  };

  const handleEditClick = () => setIsEditing(true);
  
  const handleSaveClick = () => {
    setIsEditing(false);
    onEdit(editedDetails);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedDetails(prev => {
      const updated = { ...prev, [name]: value };
      if (name === 'delivery_fees' || name === 'discount') {
        const { subtotal, total } = recalculateTotals(
          updated.order_items,
          name === 'delivery_fees' ? value : updated.delivery_fees,
          name === 'discount' ? value : updated.discount
        );
        updated.subtotal_amount = subtotal;
        updated.total = total;
      }
      return updated;
    });
  };

  const handleItemChange = (index, e) => {
    const { name, value } = e.target;
    setEditedDetails(prev => {
      const updatedItems = [...prev.order_items];
      updatedItems[index] = { ...updatedItems[index], [name]: value };
      const { subtotal, total } = recalculateTotals(updatedItems, prev.delivery_fees, prev.discount);
      return {
        ...prev,
        order_items: updatedItems,
        subtotal_amount: subtotal,
        total: total
      };
    });
  };

  const handleAddItem = () => {
    setEditedDetails(prev => {
      const updatedItems = [...prev.order_items, { item_name: '', quantity: 1, price: 0 }];
      const { subtotal, total } = recalculateTotals(updatedItems, prev.delivery_fees, prev.discount);
      return {
        ...prev,
        order_items: updatedItems,
        subtotal_amount: subtotal,
        total: total
      };
    });
  };

  const handleRemoveItem = (index) => {
    setEditedDetails(prev => {
      const updatedItems = prev.order_items.filter((_, i) => i !== index);
      const { subtotal, total } = recalculateTotals(updatedItems, prev.delivery_fees, prev.discount);
      return {
        ...prev,
        order_items: updatedItems,
        subtotal_amount: subtotal,
        total: total
      };
    });
  };

  const handleApprove = async () => {
    setIsApproving(true);
    try {
      const orderData = {
        customer_name: editedDetails.customer_name,
        customer_phone_number: editedDetails.customer_phone_number,
        order_id: editedDetails.order_id,
        order_date: editedDetails.order_date,
        subtotal_amount: editedDetails.subtotal_amount,
        delivery_fees: editedDetails.delivery_fees || 0,
        discount: editedDetails.discount || 0,
        total: editedDetails.total,
        order_item_list: (editedDetails.order_items || []).map(item => ({
          item_name: item.item_name,
          price: item.price,
          quantity: item.quantity
        }))
      };

      await onApprove(orderData);
    } catch (error) {
      console.error('Error approving order:', error);
      alert(`Error approving order: ${error.message}`);
    } finally {
      setIsApproving(false);
    }
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <h3 className="text-xl mb-4 font-semibold">Order Details</h3>
      
      <div className="mb-6">
        <h4 className="text-lg font-semibold mb-2">Order Items</h4>
        {editedDetails.order_items && editedDetails.order_items.length > 0 ? (
          <OrderItemsTable 
            items={editedDetails.order_items}
            isEditing={isEditing}
            onItemChange={handleItemChange}
            onRemoveItem={handleRemoveItem}
          />
        ) : (
          <p className="text-gray-500">No items in this order.</p>
        )}
        {isEditing && (
          <button
            onClick={handleAddItem}
            className="mt-2 bg-blue-500 text-white px-4 py-2 rounded"
          >
            Add Item
          </button>
        )}
      </div>
      
      <CustomerDetails 
        details={editedDetails}
        isEditing={isEditing}
        onChange={handleChange}
      />
      
      <OrderSummary 
        details={editedDetails}
        isEditing={isEditing}
        onChange={handleChange}
      />
      
      <div className="mb-4">
        <h4 className="text-lg font-semibold mb-2">Delivery Partner</h4>
        <p className="text-sm text-gray-900">{partner}</p>
      </div>
      
      <div className="mt-4">
        {isEditing ? (
          <button
            onClick={handleSaveClick}
            className="bg-green-500 text-white px-4 py-2 rounded mr-2"
          >
            Save Changes
          </button>
        ) : (
          <>
            <button 
              onClick={handleApprove} 
              className={`bg-green-500 text-white px-4 py-2 rounded mr-2 ${isApproving ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={isApproving}
            >
              {isApproving ? 'Approving...' : 'Approve'}
            </button>
            <button 
              onClick={handleEditClick} 
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Edit
            </button>
          </>
        )}
      </div>

      <div className="mt-4">
        <h4 className="text-lg font-semibold mb-2">Raw JSON Response:</h4>
        <pre className="bg-gray-100 p-4 rounded overflow-auto">
          {JSON.stringify(editedDetails, null, 2)}
        </pre>
      </div>
    </div>
  );
};

export default ReceiptDetails;