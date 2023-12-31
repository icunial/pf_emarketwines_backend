const { Op } = require("sequelize");
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

// Update varietal
const updateVarietal = async (id, name, description) => {
  try {
    const varietalFound = await getVarietalById(id);

    if (!varietalFound.length) {
      return [];
    }

    let updatedVarietal;

    if (name && description) {
      updatedVarietal = await Varietal.update(
        {
          name,
          description,
        },
        {
          where: {
            id,
          },
        }
      );
    } else if (name) {
      updatedVarietal = await Varietal.update(
        {
          name,
        },
        {
          where: {
            id,
          },
        }
      );
    } else if (description) {
      updatedVarietal = await Varietal.update(
        {
          description,
        },
        {
          where: {
            id,
          },
        }
      );
    }

    if (updatedVarietal[0] === 1) {
      const varietalFound = await getVarietalById(id);

      return varietalFound;
    }
  } catch (error) {
    throw new Error("Error trying to update the varietal!");
  }
};

const deleteVarietal = async (id) => {
  try {
    const varietalFound = await getVarietalById(id);

    if (!varietalFound.length) {
      return [];
    }

    const deletedVarietal = await Varietal.destroy({
      where: {
        id,
      },
    });
    if (deletedVarietal === 1) {
      return varietalFound;
    }
  } catch (error) {
    throw new Error("Error trying to delete a varietal");
  }
};

const getVarietalsByName = async (name) => {
  const results = [];

  try {
    const dbResults = await Varietal.findAll({
      where: {
        name: {
          [Op.iLike]: `%${name}%`,
        },
      },
    });

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
    throw new Error("Error trying to get all varietals by name from DB!");
  }
};

module.exports = {
  getVarietals,
  getVarietalById,
  updateVarietal,
  deleteVarietal,
  getVarietalsByName,
};
