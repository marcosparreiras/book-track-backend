import express from "express";
import multer from "multer";
import { errorHandlerMiddleware } from "./middlewares/error-handler";
import { registerUserController } from "./controllers/register-user-controller";
import { authenticateUserController } from "./controllers/authenticate-user-controller";
import { getUserController } from "./controllers/get-user-controller";
import { tokenAuthenticationMiddlware } from "./middlewares/token-authentication";
import { updateUserAvatarController } from "./controllers/update-user-avatar-controller";
import { registerBookController } from "./controllers/register-book-controller";

export const app = express();
app.use(express.json());
app.get("/me", tokenAuthenticationMiddlware, getUserController);
app.patch(
  "/me/avatar",
  tokenAuthenticationMiddlware,
  multer().single("avatar"),
  updateUserAvatarController
);
app.post("/users", registerUserController);
app.post("/session", authenticateUserController);
app.post(
  "/book",
  tokenAuthenticationMiddlware,
  multer().single("bookImage"),
  registerBookController
);
app.use(errorHandlerMiddleware);
