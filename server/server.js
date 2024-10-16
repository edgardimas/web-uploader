const express = require("express");
const orderRoutes = require("./src/orders/routes");
const resultRoutes = require("./src/results/routes");
const checkForR01Files = require("./fileChecker");
const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use("/orders", orderRoutes);
app.use("/results", resultRoutes);

setInterval(checkForR01Files, 1000);

app.listen(port, () => console.log(`app listening on port ${port}`));
