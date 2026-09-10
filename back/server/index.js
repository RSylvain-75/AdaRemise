import express from "express";
import cors from "cors";
import categoriesRouter from "./routes/categories.js";
import objetsRouter from "./routes/objets.js";
import depotsRouter from "./routes/depots.js";
import personnesRouter from "./routes/personnes.js";
import statsRouter from "./routes/stats.js";
import swaggerUi from "swagger-ui-express";
import swaggerDocument from "./swagger.json" with { type: "json"};


const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/categories", categoriesRouter);
app.use("/api/objets", objetsRouter);
app.use("/api/depots", depotsRouter);
app.use("/api/personnes", personnesRouter);
app.use("/api/stats", statsRouter);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));


app.listen(process.env.PORT || 3000, () => {
  console.log(`http://localhost:${process.env.PORT || 3000}`);
});