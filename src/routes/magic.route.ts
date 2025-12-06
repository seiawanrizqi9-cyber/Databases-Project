import { Router } from "express";
import { 
  requestMagicLink, 
  verifyMagicToken, 
  validateSession, 
  getUserProfile, 
  getAllUsers, 
  updateUserProfile,
  logout 
} from "../controllers/magicLogin.controller";
import { 
  requestMagicLinkValidation, 
  verifyTokenValidation,
  updateProfileValidation,
  getProfileValidation,
  validate 
} from "../middleware/magic.validation";

const router = Router();

// Public endpoints (no auth needed)
router.post("/request", validate(requestMagicLinkValidation), requestMagicLink);
router.post("/verify", validate(verifyTokenValidation), verifyMagicToken);

// Protected endpoints (need JWT token)
router.get("/validate", validateSession);
router.get("/users", getAllUsers);
router.get("/profile/:email", validate(getProfileValidation), getUserProfile);
router.put("/profile/:email", validate(updateProfileValidation), updateUserProfile);
router.post("/logout", logout);

export default router;