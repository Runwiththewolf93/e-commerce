import schedule from "node-schedule";
import { updateReviewSchema } from "./migration";

// Schedule the migration to run at 6:30 PM
const migrationJob = schedule.scheduleJob("45 18 * * *", async function () {
  console.log("Migration job started at:", new Date());

  try {
    await updateReviewSchema();
    console.log("Migration completed successfully.");
  } catch (error) {
    console.error("Migration failed:", error);
  } finally {
    // Cancel the job after it has run once
    migrationJob.cancel();
    console.log("Migration job cancelled.");
  }
});
