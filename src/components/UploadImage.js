import React, { useState, useRef, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import ReceiptDetails from './ReceiptDetails';

const UploadImage = () => {
  const { partner } = useParams();
  const [receiptDetails, setReceiptDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef(null);

  const normalizeData = (data) => {
    const getValueByKeys = (obj, keys) => {
      for (let key of keys) {
        if (obj.hasOwnProperty(key)) {
          return obj[key];
        }
      }
      return undefined;
    };

    const normalizeOrderItems = (items) => {
      return items.map(item => ({
        item_name: getValueByKeys(item, ['item_name', 'itemName']),
        quantity: item.quantity,
        price: item.price
      }));
    };

    return {
      order_id: getValueByKeys(data, ['order_ID', 'orderID', 'order_id']),
      order_date: getValueByKeys(data, ['order_date', 'orderDate']),
      customer_name: getValueByKeys(data, ['customer_name', 'customerName']),
      customer_phone_number: getValueByKeys(data, ['customer_phone_number', 'customerPhoneNumber']),
      order_items: normalizeOrderItems(getValueByKeys(data, ['order_item_list','orderItemList', 'orderItems', 'order_items']) || []),
      subtotal_amount: getValueByKeys(data, ['subtotal_amount', 'subtotalAmount']),
      delivery_fees: getValueByKeys(data, ['delivery_fees', 'deliveryFees']),
      discount: data.discount,
      total: getValueByKeys(data, ['total', 'totalAmount'])
    };
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      await handleUploadAndProcess(file);
    }
  };

  const handleUploadAndProcess = async (file) => {
    setIsLoading(true);
    const formData = new FormData();
    formData.append('image', file);

    try {
      const uploadResponse = await axios.post('https://process.aijazai.online/upload_image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const imageUrl = uploadResponse.data.file_path;

      const processResponse = await axios.post('https://process.aijazai.online/process_image', {
        image_url: imageUrl,
      });

      const data = processResponse.data;
      console.log("Raw API response:", data);

      if (!data || typeof data !== 'object') {
        throw new Error('Invalid data received from the API');
      }

      const normalizedData = normalizeData(data);
      console.log("Normalized data:", normalizedData);

      setReceiptDetails(normalizedData);
    } catch (error) {
      console.error('Error uploading or processing image:', error);
      if (error.response) {
        console.error('Error response:', error.response.data);
        console.error('Error status:', error.response.status);
      } else if (error.request) {
        console.error('No response received:', error.request);
      } else {
        console.error('Error message:', error.message);
      }
      alert('Error processing image. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleApprove = useCallback(async (orderData) => {
    try {
      const response = await axios.post('https://api.aijazai.online/orders/approve_order', {
        ...orderData,
        delivery_partner: partner,
      });
      
      if (response.status === 201) {
        alert('Order approved and saved successfully!');
        setReceiptDetails(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      }
    } catch (error) {
      console.error('Error approving order:', error);
      alert(`Error approving order: ${error.message}`);
    }
  }, [partner]);

  const handleEdit = useCallback((editedDetails) => {
    setReceiptDetails(editedDetails);
  }, []);

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Upload {partner} Receipt Image</h2>
      <div className="mb-4">
        <input 
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          capture="environment"
          className="hidden"
        />
        <button 
          onClick={triggerFileInput}
          className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
        >
          Choose Image or Take Photo
        </button>
      </div>
      {isLoading && <p>Processing image...</p>}
      {receiptDetails && (
        <ReceiptDetails
          details={receiptDetails}
          partner={partner}
          onApprove={handleApprove}
          onEdit={handleEdit}
        />
      )}
    </div>
  );
};

export default UploadImage;