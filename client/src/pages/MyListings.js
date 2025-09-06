import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const MyListings = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchMyListings();
  }, []);

  const fetchMyListings = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/products/user/my-listings');
      setProducts(response.data);
    } catch (error) {
      setError('Failed to fetch your listings');
      console.error('Failed to fetch listings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product?')) {
      return;
    }

    try {
      await axios.delete(`/api/products/${productId}`);
      setProducts(products.filter(product => product._id !== productId));
    } catch (error) {
      alert('Failed to delete product');
      console.error('Failed to delete product:', error);
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
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">My Listings</h1>
              <p className="text-gray-600">Manage your product listings</p>
            </div>
            <Link to="/add-product" className="btn btn-primary">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Add New Product
            </Link>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md mb-6">
            {error}
          </div>
        )}

        {products.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No listings yet</h3>
            <p className="text-gray-600 mb-6">Start selling by adding your first product</p>
            <Link to="/add-product" className="btn btn-primary">
              Add Your First Product
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <div key={product._id} className="card hover:shadow-lg transition-shadow">
                <div className="aspect-w-16 aspect-h-12">
                  <img
                    src={product.images[0]}
                    alt={product.title}
                    className="w-full h-48 object-cover"
                  />
                </div>
                <div className="card-body">
                  <h3 className="font-semibold text-lg mb-2 line-clamp-2">{product.title}</h3>
                  <p className="text-gray-600 text-sm mb-2">{product.category}</p>
                  <p className="text-green-600 font-bold text-xl mb-4">${product.price}</p>
                  
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                      {product.condition}
                    </span>
                    <span>{product.views} views</span>
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <span className={`px-2 py-1 rounded-full text-sm ${
                      product.isSold 
                        ? 'bg-red-100 text-red-800' 
                        : product.isAvailable 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                    }`}>
                      {product.isSold ? 'Sold' : product.isAvailable ? 'Available' : 'Unavailable'}
                    </span>
                    <span className="text-sm text-gray-500">
                      {new Date(product.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="flex space-x-2">
                    <Link
                      to={`/products/${product._id}`}
                      className="btn btn-outline btn-sm flex-1"
                    >
                      View
                    </Link>
                    <Link
                      to={`/products/${product._id}/edit`}
                      className="btn btn-outline btn-sm flex-1"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(product._id)}
                      className="btn btn-danger btn-sm"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Stats Summary */}
        {products.length > 0 && (
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="card">
              <div className="card-body text-center">
                <h3 className="text-2xl font-bold text-gray-900">{products.length}</h3>
                <p className="text-gray-600">Total Listings</p>
              </div>
            </div>
            <div className="card">
              <div className="card-body text-center">
                <h3 className="text-2xl font-bold text-gray-900">
                  {products.filter(p => p.isAvailable && !p.isSold).length}
                </h3>
                <p className="text-gray-600">Available</p>
              </div>
            </div>
            <div className="card">
              <div className="card-body text-center">
                <h3 className="text-2xl font-bold text-gray-900">
                  {products.filter(p => p.isSold).length}
                </h3>
                <p className="text-gray-600">Sold</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyListings;