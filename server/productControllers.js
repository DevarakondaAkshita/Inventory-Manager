const Product = require('../models/Product');

const createProduct = async (req, res) => {
  try {
    const { name, quantity, price, description, category } = req.body;
    const product = await Product.create({
      user: req.user.id,
      name,
      quantity,
      price,
      description,
      category
    });
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getProducts = async (req, res) => {
  try {
    const products = await Product.find({ user: req.user.id });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// --- ADD THESE TWO FUNCTIONS ---
const updateProduct = async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedProduct);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteProduct = async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: "Product deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { 
    createProduct, 
    getProducts, 
    updateProduct,
    deleteProduct,
};