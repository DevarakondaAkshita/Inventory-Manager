const express = require('express');
const router = express.Router();
// Double check the path: is it 'productControllers' (with an s) or 'productController'?
const { 
  createProduct, 
  getProducts, 
  updateProduct, 
  deleteProduct 
} = require('../controllers/productControllers'); 

const { protect } = require('../middleware/authMiddleware');

// Routes
router.get('/', protect, getProducts);
router.post('/', protect, createProduct);

router.route('/:id')
  .put(protect, updateProduct)
  .delete(protect, deleteProduct);

module.exports = router;