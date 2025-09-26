// src/routes/audit.ts
import { Router } from "express";
import { listAuditLogs } from "../controllers/audit.js";
import { authenticateToken, authorizeRoles } from "../middleware/auth.js";

const router = Router();
router.use(authenticateToken);
router.get("/", authorizeRoles("ADMIN", "SUPER_ADMIN"), listAuditLogs);

export default router;
