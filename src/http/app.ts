import cors from "cors";
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
import { getBookController } from "./controllers/get-book-controller";
import { getBooksController } from "./controllers/get-books-controller";

export const app = express();
app.use(cors());
app.use(express.json());
app.post("/users", registerUserController);
app.post("/session", authenticateUserController);
app.get("/me", tokenAuthenticationMiddleware, getUserController);
app.patch(
  "/me/avatar",
  tokenAuthenticationMiddleware,
  multer().single("avatar"),
  updateUserAvatarController
);
app.post(
  "/book",
  tokenAuthenticationMiddleware,
  multer().single("bookImage"),
  registerBookController
);
app.get("/book", getBooksController);
app.get("/book/:bookId", getBookController);
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
app.delete(
  "/comment/:commentId",
  tokenAuthenticationMiddleware,
  deleteCommentController
);
app.get("/health", (_request, response) => {
  return response.status(200).json({ health: true });
});
app.use(errorHandlerMiddleware);
