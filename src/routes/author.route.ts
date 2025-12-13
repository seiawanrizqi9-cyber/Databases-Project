import { Router } from "express";
import * as authorController from "../controllers/author.controller";
import {
  createAuthorValidation,
  updateAuthorValidation,
  getAuthorByIdValidation,
  searchAuthorsValidation,
} from "../middleware/author.validation";
import { validate } from "../utils/validation";

const router = Router();

router.get("/", authorController.getAll);
router.get("/search", validate(searchAuthorsValidation), authorController.search);
router.get("/:id", validate(getAuthorByIdValidation), authorController.getById);
router.post("/", validate(createAuthorValidation), authorController.create);
router.put("/:id", validate(updateAuthorValidation), authorController.update);
router.delete("/:id", validate(getAuthorByIdValidation), authorController.remove);

export default router;