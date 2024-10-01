const express = require("express");
const orderRoutes = require("./src/orders/routes");
const app = express();
const port = 3000;

app.use(express.json());

app.use(express.urlencoded({ extended: false }));

app.get("/", (req, res) => {
  res.send("Hello World!!");
});

app.use("/orders", orderRoutes);

app.listen(port, () => console.log(`app listening on port ${port}`));
