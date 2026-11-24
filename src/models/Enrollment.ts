import { model, models, Schema } from "mongoose";

/** Issued certificate. `code` is a random unique id (also used in the certificate number). */
export interface ICertificate {
  code: string;
  no: string;          // printed number, e.g. TCTC-2026-7K3QX9
  name: string;        // name as printed on the certificate
  course: string;      // course as printed on the certificate
  line?: string;       // optional custom description line
  issuedAt: Date;
}

export interface IEnrollment {
  name: string;
  phone: string;
  email?: string;
  course: string;
  age?: string;
  gender?: string;
  message?: string;
  status: "pending" | "confirmed" | "cancelled";
  adminNote?: string;
  trainingStart?: Date | null;
  trainingEnd?: Date | null;
  certificate?: ICertificate | null;
  source?: string;
  ip?: string;
  userAgent?: string;
  createdAt: Date;
  updatedAt: Date;
}

const CertificateSchema = new Schema<ICertificate>(
  {
    code:     { type: String, required: true },
    no:       { type: String, required: true },
    name:     { type: String, required: true, trim: true },
    course:   { type: String, required: true, trim: true },
    line:     { type: String, trim: true, default: "" },
    issuedAt: { type: Date, required: true },
  },
  { _id: false }
);

const EnrollmentSchema = new Schema<IEnrollment>(
  {
    name:        { type: String, required: true, trim: true },
    phone:       { type: String, required: true, trim: true },
    email:       { type: String, trim: true, default: "" },
    course:      { type: String, required: true },
    age:         { type: String, default: "" },
    gender:      { type: String, default: "" },
    message:     { type: String, default: "" },
    status:      { type: String, enum: ["pending", "confirmed", "cancelled"], default: "pending" },
    adminNote:   { type: String, default: "" },
    trainingStart: { type: Date, default: null },
    trainingEnd:   { type: Date, default: null },
    certificate: { type: CertificateSchema, default: null },
    source:      { type: String, default: "web" }, // "web" | "admin"
    ip:          { type: String, default: "" },
    userAgent:   { type: String, default: "" },
  },
  { timestamps: true }
);

// Cursor pagination sorts on _id (default index). This one serves the status tab filter.
EnrollmentSchema.index({ status: 1, _id: -1 });
// Public verify page looks certificates up by code.
EnrollmentSchema.index({ "certificate.code": 1 }, { unique: true, partialFilterExpression: { "certificate.code": { $type: "string" } } });

export const Enrollment = models.Enrollment ?? model<IEnrollment>("Enrollment", EnrollmentSchema);
