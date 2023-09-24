const Product = require("../models/Product");

// Get all products
const getProducts = async () => {
  const results = [];

  try {
    const dbResults = await Product.findAll();

    if (dbResults) {
      dbResults.forEach((r) => {
        results.push({
          id: r.id,
          name: r.name,
          type: r.type,
          varietal: r.varietal,
          origin: r.origin,
          cellar: r.cellar,
          image: r.image,
        });
      });
    }

    return results;
  } catch (error) {
    throw new Error("Error trying to get all products from DB!");
  }
};

module.exports = {
  getProducts,
};
