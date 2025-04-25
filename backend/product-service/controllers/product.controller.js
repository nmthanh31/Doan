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

exports.getImage = (req, res) => {
  const imageName = req.params.imageName;
  const imagePath = path.join(__dirname, "../data/static/", imageName);

  fs.access(imagePath, fs.constants.F_OK, (err) => {
    if (err) {
      return res.status(404).send("Image not found");
    }

    res.sendFile(imagePath);
  });
};
