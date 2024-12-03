import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Order } from '../types';
import Layout from './Layout';
import '../styles/orders.css';
import { fetchOrders } from '../services/api';

const Orders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({
    status: '',
    area: '',
    date: '',
  });

  useEffect(() => {
    const fetchOrde = async () => {
      try {
        setLoading(true);
        const response = await fetchOrders();
        setOrders(response);
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrde();
  }, []);

  const handleStatusUpdate = async (id: string, newStatus: string) => {
    try {
      const response = await axios.put(`/api/orders/${id}/status`, { status: newStatus });
      setOrders(orders.map((order) => (order._id === id ? response.data.order : order)));
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  const applyFilters = () => {
    if (!Array.isArray(orders)) {
      console.error('Orders data is not an array:', orders);
      return [];
    }
    
    return orders.filter((order) => {
        const formattedOrderDate = new Date(order.createdAt).toISOString().split('T')[0];
        console.log(formattedOrderDate)
        console.log(filter.date)
        return (
          (!filter.status || order.status === filter.status) &&
          (!filter.area || order.area.includes(filter.area)) &&
          (!filter.date || formattedOrderDate === filter.date) // Compare in 'yyyy-mm-dd' format
        );
    });
  };

  if (loading) {
    return (
      <Layout>
        <div className="loading">Loading...</div>
      </Layout>
    );
  }

  const filteredOrders = applyFilters();

  return (
    <Layout>
      <div className="orders-container">
        <h1 className="orders-title">Orders Management</h1>

        {/* Filters */}
        <div className="filters">
          <h2>Filters</h2>
          <select
            value={filter.status}
            onChange={(e) => setFilter({ ...filter, status: e.target.value })}
          >
            <option value="">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="assigned">Assigned</option>
            <option value="picked">Picked</option>
            <option value="delivered">Delivered</option>
          </select>
          <input
            type="text"
            placeholder="Filter by Area"
            value={filter.area}
            onChange={(e) => setFilter({ ...filter, area: e.target.value })}
          />
          <input
            type="date"
            value={filter.date}
            onChange={(e) => setFilter({ ...filter, date: e.target.value })}
          />
        </div>

        {/* Orders Table */}
        <table className="orders-table">
          <thead>
            <tr>
              <th>Order Number</th>
              <th>Customer</th>
              <th>Status</th>
              <th>Area</th>
              <th>Total Amount</th>
              <th>Assigned Partner</th>
              <th>Created At</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map((order) => (
              <tr key={order._id}>
                <td>{order.orderNumber}</td>
                <td>
                  {order.customer.name} <br />
                  {order.customer.phone} <br />
                  {order.customer.address}
                </td>
                <td>{order.status}</td>
                <td>{order.area}</td>
                <td>${order.totalAmount}</td>
                <td>{order.assignedTo ? order.assignedTo.name : 'Not Assigned'}</td>
                {/* <td>{new Date(order.createdAt).toLocaleDateString()}</td> */}
                <td>{new Date(order.createdAt).toLocaleDateString('en-GB')}</td>
                <td>
                  {order.status !== 'delivered' && (
                    <select
                      value={order.status}
                      onChange={(e) => handleStatusUpdate(order._id, e.target.value)}
                    >
                      <option value="pending">Pending</option>
                      <option value="assigned">Assigned</option>
                      <option value="picked">Picked</option>
                      <option value="delivered">Delivered</option>
                    </select>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Layout>
  );
};

export default Orders;
