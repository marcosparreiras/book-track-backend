import express from "express";
import { errorHandlerMiddleware } from "./middlewares/error-handler";
import { registerUserController } from "./controllers/register-user-controller";
import { authenticateUserController } from "./controllers/authenticate-user-controller";

export const app = express();
app.use(express.json());
app.post("/register", registerUserController);
app.post("/session", authenticateUserController);
app.use(errorHandlerMiddleware);
