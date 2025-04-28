import express from "express";
import cors from "cors";
import cookieparser from "cookie-parser";
import { errorHandler } from "./utils/errorHandler.js";
const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

// app.use(cors({
//   origin: 'http://localhost:5173',  // Your frontend URL
//   methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
//   allowedHeaders: ['Content-Type', 'Authorization']
// }));

app.use(
  express.json({
    limit: "16kb",
  })
);

app.use(
  express.urlencoded({
    limit: "16kb",
    extended: "true",
  })
);

app.use(express.static("public"));

app.use(cookieparser());

import userRouter from "./routes/user.route.js";
import projectRouter from "./routes/project.route.js";

app.use("/api/v1/user", userRouter);
app.use("/api/v1/project", projectRouter);
// app.all("*", (req, res, next) => {
//   next(new ApiError(404, `Route ${req.originalUrl} not found`));
// });
app.use(errorHandler);

export default app;
