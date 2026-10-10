
import mongoose, { Schema, Document } from "mongoose";

export type UserRole = "owner" | "admin" | "employee";

interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  organizationId: mongoose.Types.ObjectId;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
      select: false,
    },

    organizationId: {
      type: Schema.Types.ObjectId,
      ref: "Organization",
      required: true,
    },

    role: {
      type: String,
      enum: ["owner", "admin", "employee"],
      default: "employee",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// An email must be unique within its organization.
userSchema.index(
  { organizationId: 1, email: 1 },
  { unique: true }
);

const User = mongoose.model<IUser>("User", userSchema);

export default User;
