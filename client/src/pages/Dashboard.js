import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';

const Dashboard = () => {
  const { user, updateProfile } = useAuth();
  const [stats, setStats] = useState({
    totalListings: 0,
    totalSales: 0,
    totalPurchases: 0,
    totalEarnings: 0
  });
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    phone: user?.phone || '',
    bio: user?.bio || '',
    address: {
      street: user?.address?.street || '',
      city: user?.address?.city || '',
      state: user?.address?.state || '',
      zipCode: user?.address?.zipCode || '',
      country: user?.address?.country || ''
    }
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [listingsRes, salesRes, purchasesRes] = await Promise.all([
        axios.get('/api/products/user/my-listings'),
        axios.get('/api/purchases/sales'),
        axios.get('/api/purchases/history')
      ]);

      const totalEarnings = salesRes.data.reduce((sum, sale) => sum + sale.totalPrice, 0);

      setStats({
        totalListings: listingsRes.data.length,
        totalSales: salesRes.data.length,
        totalPurchases: purchasesRes.data.length,
        totalEarnings
      });
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('address.')) {
      const addressField = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        address: {
          ...prev.address,
          [addressField]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await updateProfile(formData);
    if (result.success) {
      setEditing(false);
    } else {
      alert(result.message);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="loading"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
          <p className="text-gray-600">Welcome back, {user?.username}!</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="card">
            <div className="card-body text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900">{stats.totalListings}</h3>
              <p className="text-gray-600">Active Listings</p>
            </div>
          </div>

          <div className="card">
            <div className="card-body text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900">${stats.totalEarnings}</h3>
              <p className="text-gray-600">Total Earnings</p>
            </div>
          </div>

          <div className="card">
            <div className="card-body text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900">{stats.totalSales}</h3>
              <p className="text-gray-600">Items Sold</p>
            </div>
          </div>

          <div className="card">
            <div className="card-body text-center">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900">{stats.totalPurchases}</h3>
              <p className="text-gray-600">Items Purchased</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Profile Section */}
          <div className="card">
            <div className="card-header flex justify-between items-center">
              <h2 className="text-xl font-semibold">Profile Information</h2>
              <button
                onClick={() => setEditing(!editing)}
                className="btn btn-outline btn-sm"
              >
                {editing ? 'Cancel' : 'Edit'}
              </button>
            </div>
            <div className="card-body">
              {editing ? (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="form-label">First Name</label>
                      <input
                        type="text"
                        name="firstName"
                        className="form-input"
                        value={formData.firstName}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div>
                      <label className="form-label">Last Name</label>
                      <input
                        type="text"
                        name="lastName"
                        className="form-input"
                        value={formData.lastName}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="form-label">Phone</label>
                    <input
                      type="tel"
                      name="phone"
                      className="form-input"
                      value={formData.phone}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div>
                    <label className="form-label">Bio</label>
                    <textarea
                      name="bio"
                      className="form-input form-textarea"
                      value={formData.bio}
                      onChange={handleInputChange}
                      placeholder="Tell us about yourself..."
                    />
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-semibold">Address</h3>
                    <div>
                      <label className="form-label">Street</label>
                      <input
                        type="text"
                        name="address.street"
                        className="form-input"
                        value={formData.address.street}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="form-label">City</label>
                        <input
                          type="text"
                          name="address.city"
                          className="form-input"
                          value={formData.address.city}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div>
                        <label className="form-label">State</label>
                        <input
                          type="text"
                          name="address.state"
                          className="form-input"
                          value={formData.address.state}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="form-label">ZIP Code</label>
                        <input
                          type="text"
                          name="address.zipCode"
                          className="form-input"
                          value={formData.address.zipCode}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div>
                        <label className="form-label">Country</label>
                        <input
                          type="text"
                          name="address.country"
                          className="form-input"
                          value={formData.address.country}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex space-x-4">
                    <button type="submit" className="btn btn-primary">
                      Save Changes
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditing(false)}
                      className="btn btn-secondary"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="font-medium text-gray-700">Username</label>
                    <p className="text-gray-900">{user?.username}</p>
                  </div>
                  <div>
                    <label className="font-medium text-gray-700">Email</label>
                    <p className="text-gray-900">{user?.email}</p>
                  </div>
                  <div>
                    <label className="font-medium text-gray-700">Name</label>
                    <p className="text-gray-900">{user?.firstName} {user?.lastName}</p>
                  </div>
                  {user?.phone && (
                    <div>
                      <label className="font-medium text-gray-700">Phone</label>
                      <p className="text-gray-900">{user.phone}</p>
                    </div>
                  )}
                  {user?.bio && (
                    <div>
                      <label className="font-medium text-gray-700">Bio</label>
                      <p className="text-gray-900">{user.bio}</p>
                    </div>
                  )}
                  {user?.address && (
                    <div>
                      <label className="font-medium text-gray-700">Address</label>
                      <p className="text-gray-900">
                        {user.address.street && `${user.address.street}, `}
                        {user.address.city && `${user.address.city}, `}
                        {user.address.state && `${user.address.state} `}
                        {user.address.zipCode && `${user.address.zipCode}`}
                        {user.address.country && `, ${user.address.country}`}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="card">
            <div className="card-header">
              <h2 className="text-xl font-semibold">Quick Actions</h2>
            </div>
            <div className="card-body">
              <div className="space-y-4">
                <Link to="/add-product" className="btn btn-primary w-full">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Add New Product
                </Link>
                
                <Link to="/my-listings" className="btn btn-outline w-full">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                  Manage Listings
                </Link>
                
                <Link to="/cart" className="btn btn-outline w-full">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
                  </svg>
                  View Cart
                </Link>
                
                <Link to="/purchase-history" className="btn btn-outline w-full">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  Purchase History
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;