import express from "express";
import multer from "multer";
import { errorHandlerMiddleware } from "./middlewares/error-handler";
import { registerUserController } from "./controllers/register-user-controller";
import { authenticateUserController } from "./controllers/authenticate-user-controller";
import { getUserController } from "./controllers/get-user-controller";
import { tokenAuthenticationMiddleware } from "./middlewares/token-authentication";
import { updateUserAvatarController } from "./controllers/update-user-avatar-controller";
import { registerBookController } from "./controllers/register-book-controller";
import { updateBookController } from "./controllers/update-book-controller";
import { deleteBookController } from "./controllers/delete-book-controller";
import { createCommentController } from "./controllers/create-comment-controller";
import { deleteCommentController } from "./controllers/delete-comment-controller";

export const app = express();
app.use(express.json());
app.get("/me", tokenAuthenticationMiddleware, getUserController);
app.patch(
  "/me/avatar",
  tokenAuthenticationMiddleware,
  multer().single("avatar"),
  updateUserAvatarController
);
app.post("/users", registerUserController);
app.post("/session", authenticateUserController);
app.post(
  "/book",
  tokenAuthenticationMiddleware,
  multer().single("bookImage"),
  registerBookController
);
app.put("/book/:bookId", tokenAuthenticationMiddleware, updateBookController);
app.delete(
  "/book/:bookId",
  tokenAuthenticationMiddleware,
  deleteBookController
);
app.post(
  "/book/:bookId/comment",
  tokenAuthenticationMiddleware,
  createCommentController
);
app.use(
  "/comment/:commentId",
  tokenAuthenticationMiddleware,
  deleteCommentController
);
app.use(errorHandlerMiddleware);
