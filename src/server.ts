import express from "express";
import { authenticateToken, authorizeRoles } from "./middleware/auth.js";
import authRoutes from "./routes/auth.js";
import paymentRoutes from "./routes/payments.js";
import auditRoutes from "./routes/audit.js";

const app = express();

app.use(express.json());

// Routes
app.use("/auth", authRoutes);
app.use("/payments", paymentRoutes);
app.use("/audit-logs", auditRoutes);

// Example protected route (only Admin and Super Admin)
app.get("/admin/dashboard", authenticateToken, authorizeRoles("ADMIN", "SUPER_ADMIN"), (req, res) => {
  res.json({ message: "Welcome Admin or Super Admin!" });
});

// Example protected route (Super Admin only)
app.get("/super/dashboard", authenticateToken, authorizeRoles("SUPER_ADMIN"), (req, res) => {
  res.json({ message: "Welcome Super Admin!" });
});

app.listen(3000, () => {
  console.log("Server running at http://localhost:3000");
});

export default app;