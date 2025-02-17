const express = require("express");
const orderRoutes = require("./src/orders/routes");
const resultRoutes = require("./src/results/routes");
const viewRoutes = require("./src/view/routes");
const testMappingRoutes = require("./src/testmappings/router");
const checkForR01Files = require("./src/checker/r01Checker");
const textChecker = require("./src/checker/textChecker");
const errChecker = require("./src/checker/errChecker");
const errorHandler = require("./src/middleware/errorHandler");
const app = express();
const port = 3000;
const cors = require("cors");

app.use(
  cors({
    origin: "*",
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.static("public"));
app.set("view engine", "ejs");
app.set("views", "./src/view");
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use("/orders", orderRoutes);
app.use("/results", resultRoutes);
app.use("/view", viewRoutes);
app.use("/testmappings", testMappingRoutes);
app.use(errorHandler);

setInterval(checkForR01Files, 3000);
setInterval(textChecker, 3000);
setInterval(errChecker, 3000);

app.listen(port, () => console.log(`app listening on port ${port}`));
