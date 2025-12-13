import { Router } from "express";
import * as loanController from "../controllers/loan.controller";
import {
  createLoanValidation,
  updateLoanValidation,
  getLoanByIdValidation,
  searchLoansValidation,
} from "../middleware/loan.validation";
import { validate } from "../utils/validation";

const router = Router();

router.get("/", loanController.getAll);
router.get("/search", validate(searchLoansValidation), loanController.search);
router.get("/:id", validate(getLoanByIdValidation), loanController.getById);
router.post("/", validate(createLoanValidation), loanController.create);
router.put("/:id", validate(updateLoanValidation), loanController.update);
router.patch("/:id/return", validate(getLoanByIdValidation), loanController.returnBook);
router.delete("/:id", validate(getLoanByIdValidation), loanController.remove);

export default router;