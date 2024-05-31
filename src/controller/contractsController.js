const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const uuid = require("uuid");

module.exports.getAllContracts = async (req, res) => {
  try {
    const contracts = await prisma.contract.findMany();
    if (contracts) {
      res.status(200).json(contracts);
    } else {
      res.status(400).send("Nothing to display");
    }
  } catch (err) {
    res.status(500).json({ err: "InternalServerError" });
  }
};

module.exports.getOneContract = async (req, res) => {
  const id = req.params.id;
  if (!uuid.validate(id)) {
    res.status(404).send("No id found to match the database!");
  }
  try {
    const contract = await prisma.contract.findFirst({
      where: {
        id: id,
      },
    });
    if (!contract) {
      res.status(400).send("Upps");
    }
    res.status(200).json(contract);
  } catch (err) {
    res.status(500).json({ err: "InternalServerError" });
  }
};

module.exports.createContract = async (req, res) => {
  const dateWanted = req.body.dateWanted;
  try {
    const addContract = await prisma.contract.create({
      data: {
        dateWanted: dateWanted,
      },
    });
    if (!addContract) {
      res.status(400).json("uups");
    }
    res.status(200).json(addContract);
  } catch (err) {
    res.status(500).json({ err: "InternalServerError" });
  }
};

module.exports.editContract = async (req, res) => {
  const id = req.params.id;
  const newDateWanted = req.body.dateWanted;
  if (!uuid.validate(id)) {
    res.status(404).send("No id provided");
    return;
  }
  try {
    const modifyContract = await prisma.contract.update({
      where: {
        id: id,
      },
      data: {
        dateWanted: newDateWanted,
      },
    });
    if (!modifyContract) {
      res.status(400).json("uups");
    }
    res.status(200).json(modifyContract);
  } catch (err) {
    res.status(500).json({ err: "InternalServerError" });
  }
};

module.exports.deleteContract = async (req, res) => {
  const { id } = req.params;
  if (!uuid.validate(id)) {
    res.status(404).send("No id provided");
    return;
  }
  try {
    const deleted = await prisma.contract.delete({
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
