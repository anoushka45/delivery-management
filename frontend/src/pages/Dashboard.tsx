import React, { useEffect, useState } from 'react';
import { Bar, Pie, Line } from 'react-chartjs-2';
import { Metrics } from '../types';
import { fetchOrders, fetchPartners } from '../services/api';
import Layout from './Layout';
import '../styles/dashboard.css';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, ArcElement, Title, Tooltip, Legend);

const Dashboard: React.FC = () => {
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const ordersResponse = await fetchOrders();
        const partnersResponse = await fetchPartners();

        const totalOrders = ordersResponse.length;
        const pendingOrders = ordersResponse.filter((order: any) => order.status === 'pending').length;
        const assignedOrders = ordersResponse.filter((order: any) => order.status === 'assigned').length;
        const deliveredOrders = ordersResponse.filter((order: any) => order.status === 'delivered').length;

        const activePartners = partnersResponse.filter((partner: any) => partner.status === 'active').length;
        const availablePartners = partnersResponse.filter((partner: any) => partner.currentLoad < 3).length;
        const busyPartners = partnersResponse.filter((partner: any) => partner.currentLoad === 3).length;

        setMetrics({
          totalOrders,
          pendingOrders,
          assignedOrders,
          deliveredOrders,
          activePartners,
          availablePartners,
          busyPartners,
        });
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <Layout>
        <div className="loading">Loading...</div>
      </Layout>
    );
  }

  // Data for the Bar Chart
  const barChartData = {
    labels: ['Pending Orders', 'Assigned Orders', 'Delivered Orders'],
    datasets: [
      {
        label: 'Orders',
        data: metrics ? [metrics.pendingOrders, metrics.assignedOrders, metrics.deliveredOrders] : [],
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
      },
    ],
  };

  // Data for the Pie Chart
  const pieChartData = {
    labels: ['Active Partners', 'Available Partners', 'Busy Partners'],
    datasets: [
      {
        label: 'Partners',
        data: metrics ? [metrics.activePartners, metrics.availablePartners, metrics.busyPartners] : [],
        backgroundColor: ['#4BC0C0', '#9966FF', '#FF9F40'],
      },
    ],
  };

  // Data for the Line Chart
  const lineChartData = {
    labels: ['Total Orders', 'Pending Orders', 'Assigned Orders', 'Delivered Orders'],
    datasets: [
      {
        label: 'Order Trends',
        data: metrics
          ? [
              metrics.totalOrders,
              metrics.pendingOrders,
              metrics.assignedOrders,
              metrics.deliveredOrders,
            ]
          : [],
        fill: false,
        borderColor: '#36A2EB',
        tension: 0.1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Metrics Overview - Graphical Analysis',
      },
    },
  };

  return (
    <Layout>
      <div className="dashboard-container">
        {/* Dashboard Heading */}
        <header className="dashboard-header">
          
          <div className="dashboard-banner">
          <h1>Delivery Dashboard</h1>
            <p className='intro'>Welcome to the Dashboard. Here you can get an overview of the key metrics and analyze graphical data trends.</p>
          </div>
        </header>

        {/* Key Metrics Section */}
        <section className="key-metrics">
          <div className="metric">
            <h3>All Total Orders</h3>
            <p>{metrics?.totalOrders}</p>
          </div>
          <div className="metric">
            <h3>Pending Orders</h3>
            <p>{metrics?.pendingOrders}</p>
          </div>
          <div className="metric">
            <h3>Assigned Orders</h3>
            <p>{metrics?.assignedOrders}</p>
          </div>
          <div className="metric">
            <h3>Delivered Orders</h3>
            <p>{metrics?.deliveredOrders}</p>
          </div>
        </section>

        {/* Graphical Analysis Section */}
        <div className="graph-section">
          <div className="chart-container">
            {/* Bar Chart */}
            <div className="chart">
              <Bar data={barChartData} options={chartOptions} />
            </div>

            {/* Pie Chart */}
            <div className="chart">
              <Pie data={pieChartData} options={chartOptions} />
            </div>

            {/* Line Chart */}
            <div className="chart">
              <Line data={lineChartData} options={chartOptions} />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
