import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaChevronDown, FaChevronUp, FaTrash, FaDownload } from 'react-icons/fa';

const API_BASE_URL = 'https://api.aijazai.online';

const CustomerList = () => {
  const [customers, setCustomers] = useState([]);
  const [expandedCustomerId, setExpandedCustomerId] = useState(null);
  const [filters, setFilters] = useState({
    days: '',
    minOrders: '',
    deliveryPartner: '',
    minItemsInOrder: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_BASE_URL}/customers`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCustomers(response.data.customers);
    } catch (error) {
      console.error('Error fetching customers:', error);
      setError('Failed to fetch customers. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCustomerClick = async (customerId) => {
    if (expandedCustomerId === customerId) {
      setExpandedCustomerId(null);
    } else {
      setIsLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${API_BASE_URL}/customers/${customerId}/orders`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setCustomers(customers.map(customer => 
          customer.id === customerId ? { ...customer, orders: response.data } : customer
        ));
        setExpandedCustomerId(customerId);
      } catch (error) {
        console.error('Error fetching customer orders:', error);
        setError('Failed to fetch customer orders. Please try again.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const applyFilters = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_BASE_URL}/customers/search`, {
        params: filters,
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('Filter response:', response.data);
      setCustomers(response.data);
    } catch (error) {
      console.error('Error applying filters:', error);
      setError('Failed to apply filters. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteCustomer = async (customerId) => {
    if (window.confirm('Are you sure you want to delete this customer?')) {
      setIsLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`${API_BASE_URL}/customers/${customerId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setCustomers(customers.filter(customer => customer.id !== customerId));
      } catch (error) {
        console.error('Error deleting customer:', error);
        setError('Failed to delete customer. Please try again.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const formatCurrency = (value) => {
    if (typeof value === 'number') {
      return value.toFixed(2);
    }
    return value;
  };

  const handleDownloadCSV = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_BASE_URL}/customers/download-csv`, {
        params: filters,
        responseType: 'blob',
        headers: { Authorization: `Bearer ${token}` }
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'customers.csv');
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Error downloading CSV:', error);
      setError('Failed to download CSV. Please try again.');
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Customer List</h1>
      
      {/* Filter Form */}
      <div className="mb-4 p-4 bg-gray-100 rounded">
        <h2 className="text-lg font-semibold mb-2">Filter Customers</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <input
            type="number"
            name="days"
            placeholder="Days since last order"
            value={filters.days}
            onChange={handleFilterChange}
            className="p-2 border rounded"
          />
          <input
            type="number"
            name="minOrders"
            placeholder="Minimum number of orders"
            value={filters.minOrders}
            onChange={handleFilterChange}
            className="p-2 border rounded"
          />
          <input
            type="number"
            name="minItemsInOrder"
            placeholder="Min unique items in an order"
            value={filters.minItemsInOrder}
            onChange={handleFilterChange}
            className="p-2 border rounded"
          />
          <select
            name="deliveryPartner"
            value={filters.deliveryPartner}
            onChange={handleFilterChange}
            className="p-2 border rounded"
          >
            <option value="">All Delivery Partners</option>
            <option value="Talabat">Talabat</option>
            <option value="Snoonu">Snoonu</option>
            <option value="Rafeeq">Rafeeq</option>
          </select>
        </div>
        <div className="flex justify-between w-full mt-4">
          <button 
            onClick={applyFilters}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            disabled={isLoading}
          >
            {isLoading ? 'Applying...' : 'Apply Filters'}
          </button>
          <button 
            onClick={handleDownloadCSV}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 flex items-center"
          >
            <FaDownload className="mr-2" /> Download CSV
          </button>
        </div>
      </div>

      {error && <div className="text-red-500 mb-4">{error}</div>}

      {/* Customer Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-2 px-4 border-b">Customer Name</th>
              <th className="py-2 px-4 border-b">Phone Number</th>
              <th className="py-2 px-4 border-b">Number of Orders</th>
              <th className="py-2 px-4 border-b">Last Order Date</th>
              <th className="py-2 px-4 border-b">Last Delivery Partner</th>
              <th className="py-2 px-4 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((customer) => (
              <React.Fragment key={customer.id}>
                <tr className="hover:bg-gray-50">
                  <td className="py-2 px-4 border-b">{customer.name}</td>
                  <td className="py-2 px-4 border-b">{customer.phone_number}</td>
                  <td className="py-2 px-4 border-b">
                    {customer.order_count !== undefined ? customer.order_count : (customer.orders ? customer.orders.length : 'N/A')}
                  </td>
                  <td className="py-2 px-4 border-b">{customer.last_order_date ? new Date(customer.last_order_date).toLocaleDateString() : 'N/A'}</td>
                  <td className="py-2 px-4 border-b">{customer.last_delivery_partner || 'N/A'}</td>
                  <td className="py-2 px-4 border-b">
                    <button
                      onClick={() => handleCustomerClick(customer.id)}
                      className="mr-2 text-blue-500 hover:text-blue-700"
                      disabled={isLoading}
                    >
                      {expandedCustomerId === customer.id ? <FaChevronUp /> : <FaChevronDown />}
                    </button>
                    <button
                      onClick={() => handleDeleteCustomer(customer.id)}
                      className="text-red-500 hover:text-red-700"
                      disabled={isLoading}
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
                {expandedCustomerId === customer.id && customer.orders && (
                  <tr>
                    <td colSpan="6" className="bg-gray-50 p-4">
                      <h3 className="font-semibold mb-2">Order History</h3>
                      {customer.orders.map((order) => (
                        <div key={order.id} className="mb-4 border-b pb-2">
                          <p><strong>Order ID:</strong> {order.order_id}</p>
                          <p><strong>Date:</strong> {new Date(order.order_date).toLocaleDateString()}</p>
                          <p><strong>Total:</strong> QAR {formatCurrency(order.total)}</p>
                          <p><strong>Delivery Partner:</strong> {order.delivery_partner || 'N/A'}</p>
                          <h4 className="font-semibold mt-2">Items:</h4>
                          <ul className="list-disc pl-5">
                            {order.OrderItems.map((item) => (
                              <li key={item.id}>
                                {item.item_name} - Quantity: {item.quantity}, Price: QAR {formatCurrency(item.price)}
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
      
      {isLoading && <div className="text-center mt-4">Loading...</div>}
    </div>
  );
};

export default CustomerList;