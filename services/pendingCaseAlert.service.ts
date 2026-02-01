import Case from "@/models/Case";
import Notification from "@/models/Notification";
import User from "@/models/User";


export async function checkPendingCases(seconds = 10) {
  const limitDate = new Date(Date.now() - seconds * 1000);

  const pendingCases = await Case.find({
    status: "PENDING",
    createdAt: { $lt: limitDate },
  });

  if (pendingCases.length === 0) return 0;

 
  const users = await User.find({
    role: { $in: ["ADMIN", "OFFICER"] },
  });

  let createdCount = 0;

 
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
        
        if (err.code !== 11000) throw err;
      }
    }
  }

  return createdCount;
}
