const express = require("express");
const orderHeaderRoutes = require("./src/order-headers/routes");
const app = express();
const port = 3000;

app.use(express.json());

app.use(express.urlencoded({ extended: false }));

app.get("/", (req, res) => {
  res.send("Hello World!!");
});

app.use("/order-headers", orderHeaderRoutes);

app.listen(port, () => console.log(`app listening on port ${port}`));
