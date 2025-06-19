const productService = require("../services/product.service");

exports.getProducts = (req, res) => {
  const products = productService.getProducts();
  res.json(products);
};

exports.getProductById = (req, res) => {
  const id = req.params.id;
  const product = productService.getProductsById(id);
  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }
  res.json(product);
};

