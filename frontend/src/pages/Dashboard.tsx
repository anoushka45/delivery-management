import React, { useEffect, useState } from 'react';
import { Metrics, Assignment } from '../types';
import { fetchOrders, fetchPartners, fetchAssignmentsMetrics } from '../services/api';
import Layout from './Layout';
import '../styles/dashboard.css';

const Dashboard: React.FC = () => {
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [recentAssignments, setRecentAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const ordersResponse = await fetchOrders();
        const partnersResponse = await fetchPartners();
        const assignmentsResponse = await fetchAssignmentsMetrics();

        const orders = ordersResponse;
        const partners = partnersResponse;

        const totalOrders = orders.length;
        const pendingOrders = orders.filter((order: any) => order.status === 'pending').length;
        const assignedOrders = orders.filter((order: any) => order.status === 'assigned').length;
        const deliveredOrders = orders.filter((order: any) => order.status === 'delivered').length;

        const activePartners = partners.filter((partner: any) => partner.status === 'active').length;
        const availablePartners = partners.filter((partner: any) => partner.currentLoad < 3).length;
        const busyPartners = partners.filter((partner: any) => partner.currentLoad === 3).length;

        setMetrics({
          totalOrders,
          pendingOrders,
          assignedOrders,
          deliveredOrders,
          activePartners,
          availablePartners,
          busyPartners,
        });

        setRecentAssignments(assignmentsResponse.recent || []);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <Layout><div className="loading">Loading...</div></Layout>;
  }

  return (
    <Layout>
      <div className="dashboard-container">
        <h1 className="dashboard-title">Dashboard</h1>
        <p className="dashboard-overview">
          The dashboard provides a centralized overview of critical metrics and recent activity, 
          including order statuses, partner availability, and assignments. It is designed to help 
          users monitor operations efficiently and make informed decisions.
        </p>

        {/* Metrics Section */}
        {metrics && (
            <div className="metrics-container">

            {Object.entries(metrics).map(([key, value]) => (
              <div className="metric-card" key={key}>
                <h3>{key.replace(/([A-Z])/g, ' $1')}</h3>
                <p>{value}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Dashboard;
