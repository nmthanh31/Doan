const request = require("supertest");
const express = require("express");

// Mock service
jest.mock("../services/product.service");
const productService = require("../services/product.service");
const productRoutes = require("../routes/product.routes");

const app = express();
app.use(express.json());
app.use("/api/products", productRoutes);

describe("Product Routes Integration Tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("GET /api/products", () => {
    it("should return a list of products", async () => {
      const mockProducts = [
        {
          id: "1",
          name: "Product 1",
          price: 100,
          quantity: 5,
        },
        {
          id: "2",
          name: "Product 2",
          price: 200,
          quantity: 10,
        },
      ];

      productService.getProducts.mockReturnValue(mockProducts);

      const res = await request(app).get("/api/products");

      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual(mockProducts);
      expect(productService.getProducts).toHaveBeenCalledTimes(1);
    });
  });

  describe("GET /api/products/:id", () => {
    it("should return a product by ID", async () => {
      const mockProduct = {
        id: "1",
        name: "Product 1",
        price: 100,
        quantity: 5,
      };

      productService.getProductsById.mockReturnValue(mockProduct);

      const res = await request(app).get("/api/products/1");

      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual(mockProduct);
      expect(productService.getProductsById).toHaveBeenCalledWith("1");
    });

    it("should return 404 if product not found", async () => {
      productService.getProductsById.mockReturnValue(undefined);

      const res = await request(app).get("/api/products/999");

      expect(res.statusCode).toBe(404);
      expect(res.body).toEqual({ message: "Product not found" });
    });
  });
});
