import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Assignment2, Metrics2, PartnerOverview } from '../types/index';
import Layout from './Layout';
import '../styles/assignments.css';
import { Bar, Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { fetchAssignments, fetchAssignmentsMetrics } from '../services/api';
import Footer from './Footer';
// Register chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Assignments: React.FC = () => {
  const [assignments, setAssignments] = useState<Assignment2[]>([]);
  const [metrics, setMetrics] = useState<Metrics2 | null>(null);
  const [partnerOverview, setPartnerOverview] = useState<PartnerOverview | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAssign = async () => {
      try {
        setLoading(true);

        // Fetch assignments
        const assignmentsResponse = await fetchAssignments();
        setAssignments(assignmentsResponse);

        // Fetch metrics
        const metricsResponse = await fetchAssignmentsMetrics();
        setMetrics(metricsResponse);

        // Fetch partner overview
        const partnersResponse = await axios.get('/api/assignments/partners/overview');
        setPartnerOverview(partnersResponse.data);
      } catch (error) {
        console.error('Error fetching assignments data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAssign();
  }, []);

  if (loading) {
    return (
      <Layout>
        <div className="loading">
          <div className="spinner"></div>
          Loading...
        </div>
      </Layout>
    );
  }

  // Prepare the chart data
  const barChartData = {
    labels: ['Total Assignments', 'Success Rate', 'Failure Reasons'],
    datasets: [
      {
        label: 'Metrics',
        data: [
          metrics?.totalAssigned || 0,
          metrics?.successRate || 0,
          metrics?.failureReasons.length || 0,
        ],
        backgroundColor: ['rgba(75, 192, 192, 0.6)', 'rgba(255, 159, 64, 0.6)', 'rgba(153, 102, 255, 0.6)'],
        borderColor: ['rgba(75, 192, 192, 1)', 'rgba(255, 159, 64, 1)', 'rgba(153, 102, 255, 1)'],
        borderWidth: 1,
      },
    ],
  };

  const doughnutData = {
    labels: ['Available', 'Busy', 'Offline'],
    datasets: [
      {
        data: [
          partnerOverview?.available || 0,
          partnerOverview?.busy || 0,
          partnerOverview?.offline || 0,
        ],
        backgroundColor: ['#36A2EB', '#FF6384', '#FFCE56'],
        hoverOffset: 4,
      },
    ],
  };

  return (
    <Layout>
      <div className="assignments-container">
        <h1 className="assignments-title">Assignments</h1>

        <div className="metrics">
          {metrics && (
            <div className="metrics-item ">
              <h2>Metrics</h2>
              <div className="bar-chart-container bar-chart">
                <Bar data={barChartData} options={{
                  responsive: true,
                  maintainAspectRatio: false, // Allow the chart to resize freely

                  plugins: { title: { display: true, text: 'Metrics Overview' } }
                }} />
              </div>

            </div>



          )}


          {/* Partner Overview - Doughnut Chart */}
          {partnerOverview && (
            <div className="metrics-item">
              <h2>Partner Overview</h2>
              <Doughnut data={doughnutData} options={{ responsive: true, plugins: { title: { display: true, text: 'Partner Overview' } } }} />
            </div>
          )}



          {metrics && (
            <div className="metrics-item">

              <h3 className="failure-reasons-title">Failure Reasons:</h3>
              <ul className="failure-reasons-list">
                {metrics.failureReasons.map((reason, idx) => (
                  <li key={idx} className="failure-reason-item">
                    <span className="reason-text">{reason.reason}</span>:
                    <span className="reason-count">{reason.count}</span>
                  </li>
                ))}
              </ul>

            </div>
          )}
        </div>




        {/* Active Assignments */}
        <div className="active-assignments">
          <h2>Active Assignments</h2>
          <div className='table-container'>
            <table className="assignments-table">
              <thead>
                <tr>
                  <th>Order Number</th>
                  <th>Partner</th>
                  <th>Status</th>
                  <th>Reason</th>
                  <th>Timestamp</th>
                </tr>
              </thead>
              <tbody>
                {assignments.map((assignment) => (
                  <tr key={assignment._id}>
                    <td>{assignment.orderId.orderNumber}</td>
                    <td>
                      {assignment.partnerId ? (
                        <>
                          {assignment.partnerId.name} <br />
                          {assignment.partnerId.email} <br />
                          {assignment.partnerId.phone}
                        </>
                      ) : (
                        'Not Assigned'
                      )}
                    </td>
                    <td>{assignment.status}</td>
                    <td>{assignment.reason || 'N/A'}</td>
                    <td>{new Date(assignment.timestamp).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <Footer />
    </Layout>
  );
};

export default Assignments;
