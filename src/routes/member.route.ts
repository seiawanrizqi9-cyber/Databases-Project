import { Router } from "express";
import * as memberController from "../controllers/member.controller";
import {
  createMemberValidation,
  updateMemberValidation,
  getMemberByIdValidation,
  searchMembersValidation,
} from "../middleware/member.validation";
import { validate } from "../utils/validation";

const router = Router();

router.get("/", memberController.getAll);
router.get("/search", validate(searchMembersValidation), memberController.search);
router.get("/:id", validate(getMemberByIdValidation), memberController.getById);
router.post("/", validate(createMemberValidation), memberController.create);
router.put("/:id", validate(updateMemberValidation), memberController.update);
router.delete("/:id", validate(getMemberByIdValidation), memberController.remove);

export default router;