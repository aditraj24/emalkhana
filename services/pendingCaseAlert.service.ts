import Case from "@/models/Case";
import Notification from "@/models/Notification";
import User from "@/models/User";

/**
 * Check cases pending more than N days
 * and create notifications for admins
 */
export async function checkPendingCases(days = 7) {
  const limitDate = new Date();
  limitDate.setDate(limitDate.getDate() - days);

  // 1. Find long pending cases
  const pendingCases = await Case.find({
    status: "PENDING",
    createdAt: { $lt: limitDate },
  });

  if (pendingCases.length === 0) return 0;

  // 2. Find admins
  const admins = await User.find({ role: "ADMIN" });

  let createdCount = 0;

  // 3. Create notifications (idempotent)
  for (const admin of admins) {
    for (const c of pendingCases) {
      try {
        await Notification.create({
          userId: admin._id,
          type: "PENDING_CASE",
          referenceId: c._id,
          message: `⚠️ Case ${c.crimeNumber} pending for more than ${days} days`,
        });

        createdCount++;
      } catch (err: any) {
        // Duplicate key error = already exists (ignore safely)
        if (err.code !== 11000) {
          throw err;
        }
      }
    }
  }

  return createdCount;
}
