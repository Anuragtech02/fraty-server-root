import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "../config/database";
import compression from "compression";

import cookieParser from "cookie-parser";
import Routes from "./routes/v1/index";
const app = express();
const port = process.env.PORT || 5000;

dotenv.config();

app.set("trust proxy", 1);
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://fraty.in",
      "https://fraty.in",
      "https://fraty.vercel.app",
      "http://fraty.vercel.app",
      "https://www.fraty.in",
      "http://www.fraty.in",
    ],
    credentials: true,
    preflightContinue: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());
app.use(compression());

app.use("/v1", Routes);
app.get("/", (req, res) => {
  return res.json({
    status: 200,
    message: "gm frens! API is running",
  });
});

let server;
// Connect to MongoDB and start the server
connectDB(() => {
  server = app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
});

export default server;
