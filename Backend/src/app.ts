import express from "express";
import cors from "cors";
import organizationRoutes from "./routes/organization.routes";


const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send({
    message: "Incident management application is working",
  });
});

app.use("/organizations", organizationRoutes);


export default app;
