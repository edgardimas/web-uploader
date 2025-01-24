const express = require("express");
const orderRoutes = require("./src/orders/routes");
const resultRoutes = require("./src/results/routes");
const viewRoutes = require("./src/view/routes");
const checkForR01Files = require("./src/checker/fileChecker");
const errorHandler = require("./src/middleware/errorHandler");
const app = express();
const port = 3000;

app.set("view engine", "ejs");
app.set("views", "./src/view");
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use("/orders", orderRoutes);
app.use("/results", resultRoutes);
app.use("/view", viewRoutes);
app.use(errorHandler);

app.get("/view/:type", (req, res) => {
  const logType = req.params.type;

  if (!["orders", "results"].includes(logType)) {
    return res.status(400).send("Invalid log type.");
  }

  res.render("realtime", { logType });
});

setInterval(checkForR01Files, 2000);

app.listen(port, () => console.log(`app listening on port ${port}`));
