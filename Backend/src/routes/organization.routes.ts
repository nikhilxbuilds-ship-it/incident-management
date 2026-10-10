import { Router } from "express";
import Organization from "../models/organization";

const router = Router();

router.post("/", async (req, res) => {
  try {
    const { name, slug } = req.body;
    if (
      typeof name !== "string" ||
      typeof slug !== "string" ||
      !name.trim() ||
      !slug.trim()
    ) {
      res.status(400).send({
        message: "Name and Slug are required!",
      });
      return;
    }

    const normalizedSlug = slug.trim().toLowerCase();

    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(normalizedSlug)) {
      res.status(400).json({
        message:
          "Slug can contain only lowercase letters, numbers, and single hyphens between words",
      });
      return;
    }

    const organization = await Organization.create({
      name: name.trim(),
      slug: normalizedSlug,
    });

    res.status(201).json(organization);
  } catch (error: any) {
    if (error.code === 11000) {
      res.status(409).json({
        message: "An organization with the same slug already exists",
      });
      return;
    }

    res.status(500).json({
      message: "Failed to create organization!",
    });
  }
});

export default router;
