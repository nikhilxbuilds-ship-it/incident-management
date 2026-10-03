import express from "express";
import cors from "cors";
import Organization from "./models/organization";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req,res) => {
    res.send({
        message : "Incident management application is working"
    });
});

app.post("/test-organization", async (req, res) => {
  try {
    const organization = await Organization.create({
      name: "Acme Technologies",
      slug: "acme-technologies",
    });

    res.status(201).json(organization);
  } catch (error) {
    res.status(500).json({
      message: "Failed to create organization",
      error,
    });
  }
});


export default app;