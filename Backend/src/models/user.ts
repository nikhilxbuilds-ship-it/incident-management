import mongoose, { Schema, Document } from "mongoose";

interface IUser extends Document {
  employeeId: String;
  name: String;
  email: String;
  passwordHash: string;
  organizationId: mongoose.Types.ObjectId;
  role: "OWNER" | "ADMIN" | "EMPLOYEE";
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>({
  employeeId: {
    type: String,
    required: true,
    trim: true,
  },

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

  passwordHash: {
    type: String,
    required: true,
  },

  organizationId: {
      type: Schema.Types.ObjectId,
      ref: "Organization",
      required: true,
    },

    role: {
      type: String,
      enum: ["OWNER", "ADMIN", "EMPLOYEE"],
      required: true,
    },
});
