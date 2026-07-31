import { apiReference } from "@scalar/express-api-reference";
import cors from "cors";
import "dotenv/config";
import express from "express";
import morgan from "morgan";
import swaggerUi from "swagger-ui-express";



// common routes

import { generateOpenAPIDocument } from "@/lib";
import { errorHandler, notFoundHandler } from "@/middleware";

import { authRouter } from "./api/auth/auth.route";
import { postRouter } from "./api/post/post.route";
import { userRouter } from "./api/user/user.route";
import { connectDB } from "./db";
import { getLocalIP } from "./lib/get-my-ip";
import { morganDevFormat } from "./lib/morgan";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/uploads", express.static("uploads"));
app.use(morgan(morganDevFormat));

app.use(
  cors({
    origin: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
  })
);

app.get("/", (_req, res) => {
  res.status(200).send("OK");
});

app.use("/api/auth", authRouter);
app.use("/api/posts", postRouter);
app.use("/api/users", userRouter);

// OpenAPI documentation
const openApiDocument = generateOpenAPIDocument();
app.use("/swagger", swaggerUi.serve, swaggerUi.setup(openApiDocument));
app.use(
  "/scaler",
  apiReference({
    theme: "deepSpace",
    content: openApiDocument,
  }),
);
app.get("/api-docs.json", (_req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.send(openApiDocument);
});

app.use(notFoundHandler);
app.use(errorHandler);

const port = process.env.PORT || 5000;
app.listen(Number(port), "0.0.0.0", async () => {
  await connectDB();

  console.log(`🚀 Server is running on port http://localhost:${port}`);
  console.log(`✨ Server is running on port http://${getLocalIP()}:${port} \n`);

  console.log(`✍️ Swagger doc: http://localhost:${port}/swagger`);
  console.log(`📋 Scaler doc: http://localhost:${port}/scaler \n`);
});
