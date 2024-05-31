const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// create json web token
const maxAge = 3 * 24 * 60 * 60;
const createToken = (id, role) => {
  return jwt.sign({ id, role }, "secret", {
    expiresIn: maxAge,
  });
};

// controller actions
module.exports.signupGet = (req, res) => {
  res.status(200).send("signup"); // html page for signup
};

module.exports.loginGet = (req, res) => {
  res.tatus(200).send("login"); // html page for login
};

module.exports.signupPost = async (req, res) => {
  const { lastName, email, password, phone } = req.body;
  try {
    const user = await prisma.userInfo.create({
      data: {
        firstName: "placeholder",
        lastName,
        email,
        password,
        phone,
      },
    });
    if (user) {
      const token = createToken(user.id, user.role);
      res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });
      res.status(201).json({ token: token });
    }
  } catch (err) {
    res.status(400).json({ err: "InvalidCreds" });
  }
};

module.exports.loginPost = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await prisma.userInfo.findFirst({
      where: { email: email, password: password },
    });
    if (user) {
      const token = createToken(user.id, user.role);
      res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });
      res.status(200).json({ user: user.id, jwt: token, role: user.role });
    } else {
      res.status(404).json({ err: "NotFoundError" });
    }
  } catch (err) {
    res.status(400).json({ errors });
  }
};

// logout usually has a button to trigger this
module.exports.logoutGet = (req, res) => {
  res.clearCookie("jwt");
  res.send("cookie deleted");
};
