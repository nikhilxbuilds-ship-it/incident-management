import express from "express";
import cors from "cors";
import organizationRoutes from "./routes/organization.routes";
import organizationRegistrationRoutes from "./routes/organization-registration.routes";
import authRoutes from "./routes/auth.routes";


const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send({
    message: "Incident management application is working",
  });
});

app.use("/organizations", organizationRoutes);

app.use("/auth", authRoutes);


export default app;
