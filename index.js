const express = require("express");
const authRoutes = require("./src/routes/authRoute");
const pricesRoutes = require("./src/routes/pricesRoutes");
const commentRoutes = require("./src/routes/commentsRoute");
const contractsRoute = require("./src/routes/contractsRoute");
const cookieParser = require("cookie-parser");

const app = express();

// middleware defaults
app.use(express.json());
app.use(cookieParser());

app.use(authRoutes);
app.use(pricesRoutes);
app.use(commentRoutes);
app.use(contractsRoute);

// app.get("*", checkUser);
app.get("/", (req, res) => res.status(200).send("ceva pagina de web"));

// starting server
app.listen("3000", () =>
  console.log("Server started at: http://localhost:3000")
);

module.exports = app;
