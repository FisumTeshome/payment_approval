import { Router } from "express";
import {
  createPaymentController,
  listPaymentsController,
  adminApproveController,
  adminRejectController,
  superConfirmController,
} from "../controllers/payments.js";
import { authenticate } from "../middleware/auth.js";

const router = Router();

router.post("/", authenticate, createPaymentController);
router.get("/", authenticate, listPaymentsController);
router.post("/:id/approve", authenticate, adminApproveController);
router.post("/:id/reject", authenticate, adminRejectController);
router.post("/:id/confirm", authenticate, superConfirmController);

export default router;
