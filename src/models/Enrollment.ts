import mongoose, { Schema, model, models } from "mongoose";

export interface IEnrollment {
  name: string;
  phone: string;
  course: string;
  message?: string;
  createdAt: Date;
}

const EnrollmentSchema = new Schema<IEnrollment>(
  {
    name:    { type: String, required: true, trim: true },
    phone:   { type: String, required: true, trim: true },
    course:  { type: String, required: true },
    message: { type: String, default: "" },
  },
  { timestamps: true }
);

export const Enrollment =
  models.Enrollment ?? model<IEnrollment>("Enrollment", EnrollmentSchema);
