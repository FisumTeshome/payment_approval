// src/controllers/audit.ts
import { PrismaClient } from "@prisma/client";
import type { Response } from "express";
import type { AuthRequest } from "../middleware/auth.js";

const prisma = new PrismaClient();

export async function listAuditLogs(req: AuthRequest, res: Response) {
  try {
    const logs = await prisma.auditLog.findMany({
      orderBy: { createdAt: "desc" },
      take: Number(req.query.limit) || 100,
    });
    res.json(logs);
  } catch (err) {
    if (err instanceof Error) res.status(500).json({ error: err.message });
    else res.status(500).json({ error: "Unknown error occurred" });
  }
}
