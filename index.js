require("dotenv").config();
const express = require("express");
const app = express();
const router = require("./routes");
app.use(express.json());
app.use("/api", router.router);
//const port=process.env.PORT || "3000"

const PORT = process.env.PORT || 5000;

app.listen(PORT, process.env.BASE_URL, () => {
  console.log(`server running at http://${process.env.BASE_URL}:${PORT}`);
});
