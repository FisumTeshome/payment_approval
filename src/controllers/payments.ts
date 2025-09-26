import type { Response } from "express";
import type { AuthRequest } from "../middleware/auth.js";
import {
  createPayment,
  findPaymentById,
  updatePaymentStatus,
} from "../services/paymentService.js";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Create payment request (User only)
export async function createPaymentController(req: AuthRequest, res: Response) {
  try {
    const { amount } = req.body;
    if (!amount) return res.status(400).json({ error: "Amount is required" });

    const payment = await createPayment(req.user!.id, Number(amount));

    // Audit log
    await prisma.auditLog.create({
      data: {
        actorId: req.user!.id,
        actorRole: req.user!.role as any,
        action: "CREATE_PAYMENT",
        targetType: "PaymentRequest",
        targetId: payment.id,
        newValue: { amount, status: payment.status },
      },
    });

    res.json(payment);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}

// List payments (Admins and Super Admins)
export async function listPaymentsController(req: AuthRequest, res: Response) {
  try {
    const payments = await prisma.paymentRequest.findMany({
      include: { user: true, auditLogs: true },
    });
    res.json(payments);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}

// Admin approves a payment
export async function adminApproveController(req: AuthRequest, res: Response) {
  try {
    const paymentId = Number(req.params.id);

    const payment = await updatePaymentStatus(paymentId, "ADMIN_APPROVED");

    await prisma.auditLog.create({
      data: {
        actorId: req.user!.id,
        actorRole: req.user!.role as any,
        action: "ADMIN_APPROVE",
        targetType: "PaymentRequest",
        targetId: payment.id,
        oldValue: { status: "PENDING" },
        newValue: { status: payment.status },
      },
    });

    res.json(payment);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}

// Admin rejects a payment
export async function adminRejectController(req: AuthRequest, res: Response) {
  try {
    const paymentId = Number(req.params.id);

    const payment = await updatePaymentStatus(paymentId, "ADMIN_REJECTED");

    await prisma.auditLog.create({
      data: {
        actorId: req.user!.id,
        actorRole: req.user!.role as any,
        action: "ADMIN_REJECT",
        targetType: "PaymentRequest",
        targetId: payment.id,
        oldValue: { status: "PENDING" },
        newValue: { status: payment.status },
      },
    });

    res.json(payment);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}

// Super Admin confirms a payment (final approval)
export async function superConfirmController(req: AuthRequest, res: Response) {
  try {
    const paymentId = Number(req.params.id);

    const payment = await updatePaymentStatus(paymentId, "APPROVED");

    await prisma.auditLog.create({
      data: {
        actorId: req.user!.id,
        actorRole: req.user!.role as any,
        action: "SUPER_CONFIRM",
        targetType: "PaymentRequest",
        targetId: payment.id,
        oldValue: { status: "ADMIN_APPROVED" },
        newValue: { status: payment.status },
      },
    });

    res.json(payment);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}
