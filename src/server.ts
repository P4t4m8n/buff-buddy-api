import express, { Request, Response } from "express";
import cookieParser from "cookie-parser";
import http from "http";
import cors from "cors";
import path from "path";
import dotenv from "dotenv";
import { exerciseRoutes } from "./api/exercises/exercises.routes";
import { programsRoutes } from "./api/programs/programs.routes";

dotenv.config();

export const app = express();
//Option?? for adding sockets later, remove before deployment if not implemented
export const server = http.createServer(app);

//Middlewares
app.use(express.json());
//TODO?? build cookie parser and signed cookies, using library for now
app.use(cookieParser(process.env.COOKIE_SECRET));
//Local storage for easy access to user data in the back
// import { setupAsyncLocalStorage } from "./middlewares/localStorage.middleware";
// app.use(setupAsyncLocalStorage);

//CORS
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.resolve("public")));
} else {
  const corsOptions: cors.CorsOptions = {
    origin: ["http://127.0.0.1:5173", "http://localhost:5173", "10.0.0.3:8081"],
    credentials: true,
  };
  app.use(cors(corsOptions));
}

//Routes

app.use(`/api/v${process.env.CURRENT_API_VERSION}/exercises`, exerciseRoutes);

app.use(`/api/v${process.env.CURRENT_API_VERSION}/programs`, programsRoutes);
// Catch-all route
app.all("/{*any}", (req: Request, res: Response) => {
  res.sendFile(path.resolve("public/index.html"));
});
const port = process.env.PORT || 3030;

server.listen(port, () =>
  console.info(`Server ready at: http://localhost:${port}`)
);
