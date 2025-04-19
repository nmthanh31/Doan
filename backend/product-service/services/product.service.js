const path = require("path");
const { readCSV, writeCSV } = require("../utils/csv");
const filePath = path.join(__dirname, "../data/products.csv");

exports.getProducts = () => {
    const products = readCSV(filePath);
    return products.map((product) => {
        return {
            ...product,
            price: parseFloat(product.price),
            quantity: parseInt(product.quantity),
        };
    });
}


exports.getProductsById = (id) =>{
    const products = readCSV(filePath);
    return products.find((p) => p.id === id);
}
