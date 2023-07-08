import express from "express";
import cors from "cors";
import routes from "./routes";
import swaggerUI from "swagger-ui-express";
import swaggerSpec from "../swagger.json";

const app = express();
// app.use(cors());

app.get("/swagger.json", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.send(swaggerSpec);
});

app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerSpec));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api", routes);

const PORT = 8294;
app.listen(PORT, () => {
  console.log(`Server is running at localhost:${PORT}`);
});
