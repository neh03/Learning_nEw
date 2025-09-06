import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [addingToCart, setAddingToCart] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);

  const { isAuthenticated, user } = useAuth();
  const { addToCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/products/${id}`);
      setProduct(response.data);
    } catch (error) {
      setError('Product not found');
      console.error('Failed to fetch product:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    setAddingToCart(true);
    const result = await addToCart(product._id, 1);
    
    if (result.success) {
      // Show success message (you could add a toast notification here)
      alert('Product added to cart!');
    } else {
      alert(result.message);
    }
    
    setAddingToCart(false);
  };

  const handleContactSeller = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    // In a real app, you might open a chat or email interface
    alert(`Contact seller: ${product.seller.email}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="loading"></div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h2>
          <p className="text-gray-600 mb-4">The product you're looking for doesn't exist.</p>
          <Link to="/products" className="btn btn-primary">
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  const isOwnProduct = isAuthenticated && user && product.seller._id === user.id;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="mb-6">
          <Link to="/products" className="text-green-600 hover:text-green-700">
            ← Back to Products
          </Link>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-w-16 aspect-h-12">
              <img
                src={product.images[selectedImage]}
                alt={product.title}
                className="w-full h-96 object-cover rounded-lg"
              />
            </div>
            
            {product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`aspect-w-16 aspect-h-12 rounded-lg overflow-hidden border-2 ${
                      selectedImage === index ? 'border-green-500' : 'border-gray-200'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${product.title} ${index + 1}`}
                      className="w-full h-20 object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.title}</h1>
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full">
                  {product.category}
                </span>
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                  {product.condition}
                </span>
                <span>{product.views} views</span>
              </div>
            </div>

            <div>
              <span className="text-4xl font-bold text-green-600">${product.price}</span>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Description</h3>
              <p className="text-gray-700 leading-relaxed">{product.description}</p>
            </div>

            {product.tags && product.tags.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-2">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {product.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Seller Info */}
            <div className="bg-white p-4 rounded-lg border">
              <h3 className="text-lg font-semibold mb-2">Seller Information</h3>
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                  <span className="text-gray-600 font-semibold">
                    {product.seller.username?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <p className="font-medium">{product.seller.username}</p>
                  <p className="text-sm text-gray-600">
                    {product.seller.firstName} {product.seller.lastName}
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-4">
              {!isOwnProduct ? (
                <>
                  <button
                    onClick={handleAddToCart}
                    disabled={addingToCart || !product.isAvailable || product.isSold}
                    className="w-full btn btn-primary btn-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {addingToCart ? (
                      <div className="loading"></div>
                    ) : product.isSold ? (
                      'Sold Out'
                    ) : (
                      'Add to Cart'
                    )}
                  </button>
                  
                  <button
                    onClick={handleContactSeller}
                    className="w-full btn btn-outline btn-lg"
                  >
                    Contact Seller
                  </button>
                </>
              ) : (
                <div className="space-y-2">
                  <Link
                    to={`/products/${product._id}/edit`}
                    className="w-full btn btn-outline btn-lg"
                  >
                    Edit Product
                  </Link>
                  <p className="text-sm text-gray-600 text-center">
                    This is your own product
                  </p>
                </div>
              )}
            </div>

            {/* Product Status */}
            {product.isSold && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
                <p className="font-medium">This product has been sold</p>
                <p className="text-sm">Sold on {new Date(product.soldAt).toLocaleDateString()}</p>
              </div>
            )}
          </div>
        </div>

        {/* Related Products Section */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-6">More from this seller</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* You could fetch and display related products here */}
            <div className="text-center py-8 text-gray-500">
              <p>Related products would be displayed here</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;