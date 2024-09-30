const express = require("express");
const ordersRoutes = require("./src/orders/routes");
const app = express();
const port = 3000;

app.use(express.json());

app.use(express.urlencoded({ extended: false }));

app.get("/", (req, res) => {
  res.send("Hello World!!");
});

app.use("/orders", ordersRoutes);

app.listen(port, () => console.log(`app listening on port ${port}`));
