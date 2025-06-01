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

// exports.getImage = (req, res) => {
//   const filename = req.params.filename;
//   const imagePath = path.join(__dirname, "../data/static", filename);

//   console.log("Serving image from:", imagePath); // debug log

//   fs.access(imagePath, fs.constants.F_OK, (err) => {
//     if (err) {
//       return res.status(404).json({ error: "Image not found" });
//     }

//     res.sendFile(imagePath, (err) => {
//       if (err) {
//         console.error("Error sending image:", err);
//         res.status(500).json({ error: "Error sending image" });
//       }
//     });
//   });
// };
