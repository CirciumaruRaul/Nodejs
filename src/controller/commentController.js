const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

module.exports.getAllComments = async (req, res) => {
  try {
    const comments = await prisma.comment.findMany();
    if (comments) {
      res.status(200).json(comments);
    } else {
      res.status(400).send("Nothing to display");
    }
  } catch (err) {
    res.status(500).json({ err: "InternalServerError" });
  }
};

module.exports.getOne = async (req, res) => {
  const idUser = req.params.idUser;
  try {
    const comments = await prisma.comment.findMany({
      where: {
        idUser: idUser,
      },
    });
    res.status(200).json(comments);
  } catch (err) {
    res.status(500).json({ err: "InternalServerError" });
  }
};

module.exports.create = async (req, res) => {
  const data = req.body;
  let id;
  const token = req.cookies.jwt;
  jwt.verify(token, "secret", (err, decoded) => {
    id = decoded.id;
  });
  try {
    const user = await prisma.userInfo.findFirst({
      where: {
        id: id,
      },
    });
    const commentToAdd = {
      idUser: user.id,
      userRole: user.role,
    };
    if (!data) {
      res
        .status(404)
        .json({ err: "No data to add, please provide a message or an image!" });
    }
    if (data.message && data.imageData) {
      commentToAdd.message = data.message;
      commentToAdd.imageData = data.imageData;
    } else if (data.message) {
      commentToAdd.message = data.message;
    } else {
      commentToAdd.imageData = data.imageData;
    }

    const commentAdded = await prisma.comment.create({
      data: commentToAdd,
    });
    if (commentAdded) {
      res.status(200).json(commentAdded);
    }
  } catch (err) {
    res.status(500).json({ err: "InternalServerError" });
  }
};

module.exports.update = async (req, res) => {
  let idUpdate;
  let role;
  const token = req.cookies.jwt;
  jwt.verify(token, "secret", (err, decoded) => {
    idUpdate = decoded.id;
    role = decoded.role;
  });
  const data = req.body;
  if (!data) {
    res.status(400).send("No data to modify provided");
    return;
  }
  let updateComment;
  if (data.message && data.imageData) {
    updateComment = {
      message: data.message,
      imageData: data.imageData,
      idUser: idUpdate,
      userRole: role,
    };
  } else if (data.message) {
    updateComment = {
      message: data.message,
      idUser: idUpdate,
      userRole: role,
    };
  } else {
    updateComment = {
      imageData: data.imageData,
      idUser: idUpdate,
      userRole: role,
    };
  }

  try {
    const modifyComment = await prisma.comment.update({
      where: {
        id: data.id,
        idUser: idUpdate,
      },
      data: updateComment,
    });
    if (modifyComment) {
      res.status(200).json(modifyComment);
    } else {
      res.status(301).send("????");
    }
  } catch (err) {
    res
      .status(500)
      .json({ err: "Error, maybe you dont modify your own comment!" });
  }
};

module.exports.delete = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    res.status(400).send("No valid id provided");
    return;
  }
  try {
    const deleted = await prisma.comment.delete({
      where: {
        id: id,
      },
    });
    res.json(deleted);
  } catch (err) {
    res.status(500).json({ err: "InternalServerError" });
  }
};
