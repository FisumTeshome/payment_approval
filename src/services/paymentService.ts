// src/services/paymentService.ts
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function createPayment(userId: number, amount: number) {
  return prisma.paymentRequest.create({
    data: { userId, amount, status: "PENDING" },
  });
}

export async function findPaymentById(id: number) {
  return prisma.paymentRequest.findUnique({ where: { id } });
}

export async function updatePaymentStatus(
  id: number,
  status: "APPROVED" | "ADMIN_REJECTED" | "ADMIN_APPROVED"
) {
  return prisma.paymentRequest.update({
    where: { id },
    data: { status },
  });
}
