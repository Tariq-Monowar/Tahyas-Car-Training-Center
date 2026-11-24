import { model, models, Schema } from "mongoose";

export interface IEnrollment {
  name: string;
  phone: string;
  email?: string;
  course: string;
  age?: string;
  message?: string;
  status: "pending" | "confirmed" | "cancelled";
  createdAt: Date;
  updatedAt: Date;
}

const EnrollmentSchema = new Schema<IEnrollment>(
  {
    name:    { type: String, required: true, trim: true },
    phone:   { type: String, required: true, trim: true },
    email:   { type: String, trim: true, default: "" },
    course:  { type: String, required: true },
    age:     { type: String, default: "" },
    message: { type: String, default: "" },
    status:  { type: String, enum: ["pending", "confirmed", "cancelled"], default: "pending" },
  },
  { timestamps: true }
);

export const Enrollment = models.Enrollment ?? model<IEnrollment>("Enrollment", EnrollmentSchema);
