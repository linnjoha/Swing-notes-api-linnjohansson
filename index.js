require("dotenv").config();
const express = require("express");
const app = express();
const router = require("./routes");
app.use(express.json());
app.use("/api", router.router);

const SwaggerUI = require("swagger-ui-express");
const apiDocs = require("./docs/docs.json");
app.use("/api/docs", SwaggerUI.serve);
app.get("/api/docs", SwaggerUI.setup(apiDocs));

const PORT = process.env.PORT || 5000;

app.listen(PORT, process.env.BASE_URL, () => {
  console.log(`server running at http://${process.env.BASE_URL}:${PORT}`);
});
