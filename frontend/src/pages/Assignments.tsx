import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Assignment2, Metrics2, PartnerOverview } from '../types/index';
import Layout from './Layout';
import '../styles/assignments.css';
import { fetchAssignments, fetchAssignmentsMetrics } from '../services/api';

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
        <div className="loading">Loading...</div>
      </Layout>
    );
  }

  return (
    <Layout>
     <div className="assignments-container">
  <h1 className="assignments-title">Assignments</h1>

  <div className="metrics-container">
    {/* Metrics */}
    {metrics && (
      <div className="metrics">
        <h2>Metrics</h2>
        <p>Total Assignments: {metrics.totalAssigned}</p>
        <p>Success Rate: {metrics.successRate.toFixed(2)}%</p>
        <p>
          Average Assignment Time:{' '}
          {new Date(metrics.averageTime).toISOString().substr(11, 8)} (HH:mm:ss)
        </p>
        <h3>Failure Reasons:</h3>
        <ul>
          {metrics.failureReasons.map((reason, idx) => (
            <li key={idx}>
              {reason.reason}: {reason.count}
            </li>
          ))}
        </ul>
      </div>
    )}

    {/* Partner Overview */}
    {partnerOverview && (
      <div className="partner-overview">
        <h2>Partner Overview</h2>
        <p>Available: {partnerOverview.available}</p>
        <p>Busy: {partnerOverview.busy}</p>
        <p>Offline: {partnerOverview.offline}</p>
      </div>
    )}
  </div>

  {/* Active Assignments */}
  <div className="active-assignments">
    <h2>Active Assignments</h2>
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

    </Layout>
  );
};

export default Assignments;
