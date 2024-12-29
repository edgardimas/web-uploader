const express = require("express");
const orderRoutes = require("./src/orders/routes");
const resultRoutes = require("./src/results/routes");
const viewRoutes = require("./src/view/routes");
const checkForR01Files = require("./src/checker/fileChecker");
const app = express();
const port = 3000;
app.set("view engine", "ejs");
app.set("views", "./src/view"); // Set the views directory to ./src/view
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use("/orders", orderRoutes);
app.use("/results", resultRoutes);
app.use("/view", viewRoutes);

setInterval(checkForR01Files, 1000);

app.listen(port, () => console.log(`app listening on port ${port}`));
