const express = require('express');
const Purchase = require('../models/Purchase');
const Product = require('../models/Product');
const Cart = require('../models/Cart');
const auth = require('../middleware/auth');

const router = express.Router();

// @route   POST /api/purchases/checkout
// @desc    Process checkout from cart
// @access  Private
router.post('/checkout', auth, async (req, res) => {
  try {
    const { paymentMethod, shippingAddress } = req.body;
    
    const cart = await Cart.findOne({ user: req.user.id }).populate('items.product');
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }
    
    const purchases = [];
    
    for (const item of cart.items) {
      const product = item.product;
      
      // Check if product is still available
      if (!product.isAvailable || product.isSold) {
        return res.status(400).json({ 
          message: `Product "${product.title}" is no longer available` 
        });
      }
      
      // Create purchase record
      const purchase = new Purchase({
        buyer: req.user.id,
        seller: product.seller,
        product: product._id,
        quantity: item.quantity,
        totalPrice: product.price * item.quantity,
        paymentMethod,
        shippingAddress
      });
      
      await purchase.save();
      purchases.push(purchase);
      
      // Mark product as sold
      product.isSold = true;
      product.soldTo = req.user.id;
      product.soldAt = new Date();
      await product.save();
    }
    
    // Clear cart
    cart.items = [];
    await cart.save();
    
    // Populate purchase details
    await Purchase.populate(purchases, [
      { path: 'buyer', select: 'username firstName lastName email' },
      { path: 'seller', select: 'username firstName lastName email' },
      { path: 'product', select: 'title price images' }
    ]);
    
    res.status(201).json(purchases);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/purchases/history
// @desc    Get user's purchase history
// @access  Private
router.get('/history', auth, async (req, res) => {
  try {
    const purchases = await Purchase.find({ buyer: req.user.id })
      .populate('seller', 'username firstName lastName')
      .populate('product', 'title price images category')
      .sort({ createdAt: -1 });
    
    res.json(purchases);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/purchases/sales
// @desc    Get user's sales history
// @access  Private
router.get('/sales', auth, async (req, res) => {
  try {
    const sales = await Purchase.find({ seller: req.user.id })
      .populate('buyer', 'username firstName lastName')
      .populate('product', 'title price images category')
      .sort({ createdAt: -1 });
    
    res.json(sales);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/purchases/:id/status
// @desc    Update purchase status (for sellers)
// @access  Private
router.put('/:id/status', auth, async (req, res) => {
  try {
    const { status, trackingNumber, notes } = req.body;
    
    const purchase = await Purchase.findById(req.params.id);
    if (!purchase) {
      return res.status(404).json({ message: 'Purchase not found' });
    }
    
    // Check if user is the seller
    if (purchase.seller.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    
    purchase.status = status;
    if (trackingNumber) purchase.trackingNumber = trackingNumber;
    if (notes) purchase.notes = notes;
    
    await purchase.save();
    await purchase.populate([
      { path: 'buyer', select: 'username firstName lastName email' },
      { path: 'seller', select: 'username firstName lastName email' },
      { path: 'product', select: 'title price images' }
    ]);
    
    res.json(purchase);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/purchases/:id/review
// @desc    Add review to purchase
// @access  Private
router.post('/:id/review', auth, async (req, res) => {
  try {
    const { rating, review } = req.body;
    
    if (rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5' });
    }
    
    const purchase = await Purchase.findById(req.params.id);
    if (!purchase) {
      return res.status(404).json({ message: 'Purchase not found' });
    }
    
    // Check if user is the buyer
    if (purchase.buyer.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    
    purchase.rating = rating;
    purchase.review = review;
    
    await purchase.save();
    await purchase.populate([
      { path: 'buyer', select: 'username firstName lastName' },
      { path: 'seller', select: 'username firstName lastName' },
      { path: 'product', select: 'title price images' }
    ]);
    
    res.json(purchase);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;