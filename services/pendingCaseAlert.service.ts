import Case from "@/models/Case";
import Notification from "@/models/Notification";
import User from "@/models/User";

/**
 * Check cases pending more than N seconds (TESTING MODE)
 */
export async function checkPendingCases(seconds = 10) {
  const limitDate = new Date(Date.now() - seconds * 1000);

  // 1. Find long pending cases
  const pendingCases = await Case.find({
    status: "PENDING",
    createdAt: { $lt: limitDate },
  });

  if (pendingCases.length === 0) return 0;

  // 2. Find all users (ADMIN + OFFICER)
  const users = await User.find({
    role: { $in: ["ADMIN", "OFFICER"] },
  });

  let createdCount = 0;

  // 3. Create notifications (idempotent)
  for (const user of users) {
    for (const c of pendingCases) {
      try {
        await Notification.create({
          userId: user._id,
          type: "PENDING_CASE",
          referenceId: c._id,
          message: `⚠️ Case ${c.crimeNumber} pending for more than ${seconds} seconds`,
        });

        createdCount++;
      } catch (err: any) {
        // Ignore duplicate notifications
        if (err.code !== 11000) throw err;
      }
    }
  }

  return createdCount;
}
