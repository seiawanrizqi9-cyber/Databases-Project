import { Router } from "express";
import { 
  getAll, 
  getById, 
  search, 
  create, 
  update, 
  remove 
} from "../controllers/book.controller";
import { 
  createBookValidation, 
  updateBookValidation, 
  getBookByIdValidation,
  searchBooksValidation,
  validate 
} from "../middleware/book.validation";

const router = Router();

router.get('/', getAll);
router.get('/search', validate(searchBooksValidation), search);
router.get('/:id', validate(getBookByIdValidation), getById);
router.post('/', validate(createBookValidation), create);
router.put('/:id', validate(updateBookValidation), update);
router.delete('/:id', validate(getBookByIdValidation), remove);

export default router;