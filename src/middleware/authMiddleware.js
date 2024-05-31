const jwt = require("jsonwebtoken");
const { PrismaClient, Roles } = require("@prisma/client");

const prisma = new PrismaClient();
const secret = process.env.SECRET_JWT;

const requireAuth = (req, res, next) => {
  const token = req.cookies.jwt;

  // check json web token exists and is verified
  if (token) {
    jwt.verify(token, secret, (err, decodedToken) => {
      if (err) {
        console.log(err.message);
        res.redirect("/login");
      } else {
        next();
      }
    });
  } else {
    res.redirect("/login");
  }
};

// check current user
const checkUser = (req, res, next) => {
  const token = req.cookies.jwt;
  if (token) {
    jwt.verify(token, secret, async (err, decodedToken) => {
      if (err) {
        res.locals.user = null;
        next();
      } else {
        let user = await prisma.userInfo.findFirst({
          where: {
            id: decodedToken.id,
          },
        });
        res.locals.user = user;
        next();
      }
    });
  } else {
    res.locals.user = null;
    next();
  }
};

// check current user
const requirePrivileges = async (req, res, next) => {
  const token = req.cookies.jwt;
  jwt.verify(token, secret, async (err, decodedToken) => {
    try {
      const user = await prisma.userInfo.findFirst({
        where: {
          id: decodedToken.id,
          role: {
            in: [Roles.OWNER, Roles.SUPERADMIN],
          },
        },
      });
      if (user) {
        res.locals.user = user;
        next();
      } else {
        res.status(403).send("You have no privileges to acces this!");
      }
    } catch (err) {
      res.redirect("/login");
    }
  });
};

const requireOwner = async (req, res, next) => {
  const token = req.cookies.jwt;
  jwt.verify(token, secret, async (err, decodedToken) => {
    try {
      const user = await prisma.userInfo.findFirst({
        where: {
          id: decodedToken.id,
          role: {
            in: [Roles.OWNER],
          },
        },
      });
      if (user) {
        res.locals.user = user;
        next();
      } else {
        res.status(403).send("You have no privileges to acces this!");
      }
    } catch (err) {
      res.redirect("/login");
    }
  });
};
module.exports = { requireAuth, checkUser, requirePrivileges, requireOwner };
