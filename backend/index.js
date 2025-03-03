import express from "express";
import userRoutes from "./routes/user.routes.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import { config } from "dotenv";
import connectDB from "./config/db.js";
import errorHandler from "./utils/handleError.js";
import adminRoutes from "./routes/admin.routes.js";
import path from "path";

config();

const app = express();

const _dirname = path.resolve();

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json());

//routes
app.use("/api", userRoutes);
app.use("/api/admin", adminRoutes);
app.use(errorHandler);

app.use(express.static(path.join(_dirname, "/frontend/dist")));
app.get("*", (_, res) => {
  res.sendFile(path.resolve(_dirname, "frontend", "dist", "index.html"));
});

let PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  connectDB();
  console.log(`Server is running on port ${PORT}`);
});
