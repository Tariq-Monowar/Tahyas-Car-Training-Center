import mongoose from "mongoose";

const URI = process.env.MONGODB_URI!;

if (!URI) throw new Error("MONGODB_URI is not set in environment variables");

/* Reuse connection across hot-reloads in dev and across requests in prod */
declare global {
  // eslint-disable-next-line no-var
  var _mongoConn: Promise<typeof mongoose> | undefined;
}

export function connectDB(): Promise<typeof mongoose> {
  if (!global._mongoConn) {
    global._mongoConn = mongoose.connect(URI, { dbName: "tahyas" });
  }
  return global._mongoConn;
}
