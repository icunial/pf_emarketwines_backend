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

// Get product by its ID
const getProductbyId = async (id) => {
  const result = [];

  try {
    const dbResult = await Product.findByPk(id);

    if (dbResult) {
      result.push({
        id: dbResult.id,
        name: dbResult.name,
        type: dbResult.type,
        varietal: dbResult.varietal,
        origin: dbResult.origin,
        cellar: dbResult.cellar,
        image: dbResult.image,
      });
    }

    return result;
  } catch (error) {
    throw new Error("Error trying to get a product by its ID");
  }
};

module.exports = {
  getProducts,
  getProductbyId,
};
