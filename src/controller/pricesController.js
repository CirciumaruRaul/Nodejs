const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

module.exports.getAllPrices = async (req, res) => {
  try {
    const { filter, page = 1, limit = 2 } = req.query;
    const queryp = req.query;
    const offset = (page - 1) * limit;
    const query = {
      skip: offset,
      take: limit,
    };
    if (queryp) {
      query.where = {
        name: {
          contains: queryp.name,
        },
      };
    }
    const prices = await prisma.price.findMany(query);
    const totalPrices = await prisma.price.count(
      filter ? { where: { name: { contains: filter } } } : {}
    );
    const totalPages = Math.ceil(totalPrices / limit);
    res.json({
      prices,
      pageInfo: {
        currentPage: page,
        totalPages,
        totalPrices,
      },
    });
  } catch (error) {
    console.error("Error retrieving prices:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports.getOne = async (req, res) => {
  const object = req.params.name;
  try {
    const { name, objPrice } = await prisma.price.findFirst({
      where: {
        name: object,
      },
    });
    res.status(200).json({ name: name, price: objPrice });
  } catch (err) {
    res.status(500).json({ err: "InternalServerError" });
  }
};

module.exports.create = async (req, res) => {
  const { name, objPrice } = req.body;
  let id;
  const token = req.cookies.jwt;
  jwt.verify(token, "secret", (err, decoded) => {
    id = decoded.id;
  });

  if (name === undefined) {
    res.status(400).send("No name provided");
    return;
  }
  if (objPrice === undefined) {
    res.status(400).send("No price provided");
    return;
  }
  try {
    const addPrice = await prisma.price.create({
      data: {
        name: name,
        objPrice: objPrice,
        idClient: id,
      },
    });
    if (addPrice) {
      res.status(200).json(addPrice);
    }
  } catch (err) {
    res.status(500).json({ err: "InternalServerError" });
  }
};

module.exports.update = async (req, res) => {
  let idUpdate;
  const token = req.cookies.jwt;
  jwt.verify(token, "secret", (err, decoded) => {
    idUpdate = decoded.id;
  });
  const { id, newObjPrice } = req.body;
  if (id === undefined) {
    res.status(400).send("No id provided");
    return;
  }
  if (newObjPrice === undefined) {
    res.status(400).send("No New price provided");
    return;
  }
  try {
    const modifyPrice = await prisma.price.update({
      where: {
        id: id,
      },
      data: {
        objPrice: newObjPrice,
        idClient: idUpdate,
      },
    });
    if (modifyPrice) {
      res.status(200).json(modifyPrice);
    }
  } catch (err) {
    res.status(500).json({ err: "InternalServerError" });
  }
};
module.exports.delete = async (req, res) => {
  const { id } = req.params;
  if (id === undefined) {
    res.status(400).send("No id provided");
    return;
  }
  try {
    const deleted = await prisma.price.delete({
      where: {
        id: id,
      },
    });
    if (!deleted) {
      res.status(400).send("uups");
    }
    res.status(200).json(deleted);
  } catch (err) {
    res.status(500).json({ err: "InternalServerError" });
  }
};
