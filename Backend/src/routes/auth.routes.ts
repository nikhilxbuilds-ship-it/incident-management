import { Router } from "express";
import mongoose from "mongoose";
import bcrypt from "bcrypt";

import Organization from "../models/organization";
import User from "../models/user";
const router = Router();

router.post("/register", async (req, res) => {
  try {
    const {
      organizationName,
      slug,
      ownerName,
      email,
      password,
    } = req.body;

    // 1. Validate required fields
    if (
      typeof organizationName !== "string" ||
      typeof slug !== "string" ||
      typeof ownerName !== "string" ||
      typeof email !== "string" ||
      typeof password !== "string" ||
      !organizationName.trim() ||
      !slug.trim() ||
      !ownerName.trim() ||
      !email.trim() ||
      !password
    ) {
      res.status(400).json({
        message: "All fields are required",
      });
      return;
    }

    // 2. Validate and normalize the slug
    const normalizedSlug = slug.trim().toLowerCase();

    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(normalizedSlug)) {
      res.status(400).json({
        message:
          "Slug can contain only lowercase letters, numbers, and single hyphens between words",
      });
      return;
    }

    // 3. Basic password validation
    if (password.length < 8) {
      res.status(400).json({
        message: "Password must be at least 8 characters long",
      });
      return;
    }

    // 4. Normalize email and hash password
    const normalizedEmail = email.trim().toLowerCase();
    const hashedPassword = await bcrypt.hash(password, 12);

    // 5. Start a MongoDB transaction
    const session = await mongoose.startSession();

    let organization: any;
    let owner: any;

    try {
      await session.withTransaction(async () => {
        // Create organization
        const organizations = await Organization.create(
          [
            {
              name: organizationName.trim(),
              slug: normalizedSlug,
            },
          ],
          { session }
        );

        organization = organizations[0];

        // Create owner linked to the organization
        const users = await User.create(
          [
            {
              name: ownerName.trim(),
              email: normalizedEmail,
              password: hashedPassword,
              organizationId: organization._id,
              role: "owner",
            },
          ],
          { session }
        );

        owner = users[0];
      });
    } finally {
      await session.endSession();
    }

    // 6. Return safe data (never return the password hash)
    res.status(201).json({
      message: "Organization registered successfully",
      organization: {
        id: organization._id,
        name: organization.name,
        slug: organization.slug,
      },
      owner: {
        id: owner._id,
        name: owner.name,
        email: owner.email,
        role: owner.role,
        organizationId: owner.organizationId,
      },
    });
  } catch (error: any) {
    if (error.code === 11000) {
      res.status(409).json({
        message:
          "An organization with this slug already exists",
      });
      return;
    }

    console.error(error);

    res.status(500).json({
      message: "Failed to register organization",
    });
  }
});

export default router;
