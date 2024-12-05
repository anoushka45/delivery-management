import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Partner } from '../types';
import { fetchPartners } from '../services/api';
import Layout from './Layout';
import '../styles/partners.css';

const Partners: React.FC = () => {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [newPartner, setNewPartner] = useState({
    name: '',
    email: '',
    areas: [] as string[],
    phone: '',
    shift: { start: '', end: '' },
  });
  const [loading, setLoading] = useState(true);
  const [editingPartner, setEditingPartner] = useState<Partner | null>(null);

  useEffect(() => {
    const fetchP = async () => {
      try {
        setLoading(true);
        const response = await fetchPartners();
        setPartners(response);
      } catch (error) {
        console.error('Error fetching partners:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchP();
  }, []);

  const handleAddPartner = async () => {
    try {
      const response = await axios.post('/api/partners', newPartner);
      setPartners([...partners, response.data]);
      setNewPartner({ name: '', email: '', areas: [], phone: '', shift: { start: '', end: '' } });
    } catch (error) {
      console.error('Error adding partner:', error);
    }
  };

  const handleEditPartner = async () => {
    if (!editingPartner) return;

    try {
      const response = await axios.put(`/api/partners/${editingPartner._id}`, editingPartner);
      setPartners(
        partners.map((partner) =>
          partner._id === editingPartner._id ? response.data : partner
        )
      );
      setEditingPartner(null);
    } catch (error) {
      console.error('Error editing partner:', error);
    }
  };

  const handleDeletePartner = async (id: string) => {
    try {
      await axios.delete(`/api/partners/${id}`);
      setPartners(partners.filter((partner) => partner._id !== id));
    } catch (error) {
      console.error('Error deleting partner:', error);
    }
  };

  if (loading) return <Layout> <div className="loading">
    <div className="spinner"></div>
    Loading...
  </div></Layout>;

  return (
    <Layout>

      <div className="partners-container">
        <h1 className='partner-title'>Partners Management</h1>
        <br />

        {/* Add Partner Form */}
        <div className="form-container">
          <input
            type="text"
            placeholder="Name"
            value={newPartner.name}
            onChange={(e) => setNewPartner({ ...newPartner, name: e.target.value })}
          />
          <input
            type="email"
            placeholder="Email"
            value={newPartner.email}
            onChange={(e) => setNewPartner({ ...newPartner, email: e.target.value })}
          />
          <input
            type="text"
            placeholder="Phone"
            value={newPartner.phone}
            onChange={(e) => setNewPartner({ ...newPartner, phone: e.target.value })}
          />
          <input
            type="text"
            placeholder="Areas (comma-separated)"
            value={newPartner.areas.join(', ')}
            onChange={(e) => setNewPartner({ ...newPartner, areas: e.target.value.split(',') })}
          />
          <div className="shift-inputs">
            <input
              type="text"
              placeholder="Shift Start"
              value={newPartner.shift.start}
              onChange={(e) => setNewPartner({
                ...newPartner,
                shift: { ...newPartner.shift, start: e.target.value }
              })}
            />
            <input
              type="text"
              placeholder="Shift End"
              value={newPartner.shift.end}
              onChange={(e) => setNewPartner({
                ...newPartner,
                shift: { ...newPartner.shift, end: e.target.value }
              })}
            />
          </div>
          <button onClick={handleAddPartner}>Add Partner</button>
        </div>

        {/* Partners Table */}
        <h2>Partners List</h2>
        <div className="table-container">
          <table className="partners-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Status</th>
                <th>Areas</th>
                <th>Shift</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {partners.map((partner) => (
                <tr key={partner._id}>
                  <td>{partner.name}</td>
                  <td>{partner.email}</td>
                  <td>{partner.phone}</td>
                  <td>{partner.status}</td>
                  <td>{partner.areas.join(', ')}</td>
                  <td>{`${partner.shift.start} - ${partner.shift.end}`}</td>
                  <td>
                    <button onClick={() => handleDeletePartner(partner._id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
};

export default Partners;
