const Varietal = require("../models/Varietal");

// Get all varietals
const getVarietals = async () => {
  const results = [];

  try {
    const dbResults = await Varietal.findAll();

    if (dbResults) {
      dbResults.forEach((r) => {
        results.push({
          id: r.id,
          name: r.name,
          description: r.description,
        });
      });
    }

    return results;
  } catch (error) {
    throw new Error("Error trying to get all varietals from DB!");
  }
};

// Get varietal by its ID
const getVarietalById = async (id) => {
  const result = [];

  try {
    const dbResult = await Varietal.findByPk(id);

    if (dbResult) {
      result.push({
        id: dbResult.id,
        name: dbResult.name,
        description: dbResult.description,
      });
    }

    return result;
  } catch (error) {
    throw new Error("Error trying to get a varietal by its ID");
  }
};

module.exports = {
  getVarietals,
  getVarietalById,
};
