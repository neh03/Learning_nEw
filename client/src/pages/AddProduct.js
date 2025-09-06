import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AddProduct = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    price: '',
    condition: '',
    images: ['https://via.placeholder.com/300x300?text=Product+Image'],
    location: {
      city: '',
      state: '',
      country: ''
    },
    tags: []
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [tagInput, setTagInput] = useState('');

  const navigate = useNavigate();

  const categories = [
    'Electronics',
    'Clothing & Accessories',
    'Home & Garden',
    'Books & Media',
    'Sports & Recreation',
    'Toys & Games',
    'Automotive',
    'Health & Beauty',
    'Furniture',
    'Other'
  ];

  const conditions = ['New', 'Like New', 'Good', 'Fair', 'Poor'];

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('location.')) {
      const locationField = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        location: {
          ...prev.location,
          [locationField]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }));
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post('/api/products', formData);
      navigate(`/products/${response.data._id}`);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to create product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Add New Product</h1>
            <p className="text-gray-600">List your item for sale on EcoFinds</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
                {error}
              </div>
            )}

            <div className="card">
              <div className="card-body">
                <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="form-label">Product Title *</label>
                    <input
                      type="text"
                      name="title"
                      required
                      className="form-input"
                      placeholder="Enter a descriptive title"
                      value={formData.title}
                      onChange={handleChange}
                    />
                  </div>

                  <div>
                    <label className="form-label">Category *</label>
                    <select
                      name="category"
                      required
                      className="form-select"
                      value={formData.category}
                      onChange={handleChange}
                    >
                      <option value="">Select a category</option>
                      {categories.map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="form-label">Condition *</label>
                    <select
                      name="condition"
                      required
                      className="form-select"
                      value={formData.condition}
                      onChange={handleChange}
                    >
                      <option value="">Select condition</option>
                      {conditions.map(condition => (
                        <option key={condition} value={condition}>{condition}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="form-label">Price ($) *</label>
                    <input
                      type="number"
                      name="price"
                      required
                      min="0"
                      step="0.01"
                      className="form-input"
                      placeholder="0.00"
                      value={formData.price}
                      onChange={handleChange}
                    />
                  </div>

                  <div>
                    <label className="form-label">Description *</label>
                    <textarea
                      name="description"
                      required
                      rows="4"
                      className="form-input form-textarea"
                      placeholder="Describe your product in detail..."
                      value={formData.description}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="card-body">
                <h2 className="text-xl font-semibold mb-4">Location</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="form-label">City</label>
                    <input
                      type="text"
                      name="location.city"
                      className="form-input"
                      placeholder="City"
                      value={formData.location.city}
                      onChange={handleChange}
                    />
                  </div>
                  <div>
                    <label className="form-label">State</label>
                    <input
                      type="text"
                      name="location.state"
                      className="form-input"
                      placeholder="State"
                      value={formData.location.state}
                      onChange={handleChange}
                    />
                  </div>
                  <div>
                    <label className="form-label">Country</label>
                    <input
                      type="text"
                      name="location.country"
                      className="form-input"
                      placeholder="Country"
                      value={formData.location.country}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="card-body">
                <h2 className="text-xl font-semibold mb-4">Tags</h2>
                
                <div className="space-y-4">
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      className="form-input flex-1"
                      placeholder="Add a tag"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                    />
                    <button
                      type="button"
                      onClick={handleAddTag}
                      className="btn btn-outline"
                    >
                      Add Tag
                    </button>
                  </div>
                  
                  {formData.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {formData.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm flex items-center gap-2"
                        >
                          #{tag}
                          <button
                            type="button"
                            onClick={() => handleRemoveTag(tag)}
                            className="text-green-600 hover:text-green-800"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="card">
              <div className="card-body">
                <h2 className="text-xl font-semibold mb-4">Images</h2>
                <p className="text-gray-600 mb-4">
                  For now, we'll use placeholder images. In a full implementation, you would upload real images here.
                </p>
                <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
                  <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p className="text-gray-500">Image upload feature coming soon</p>
                </div>
              </div>
            </div>

            <div className="flex space-x-4">
              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary btn-lg flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="loading"></div>
                ) : (
                  'Create Listing'
                )}
              </button>
              <button
                type="button"
                onClick={() => navigate('/my-listings')}
                className="btn btn-secondary btn-lg"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddProduct;