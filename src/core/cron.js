import schedule from "node-schedule";

export default function setupCron (callback, app){
  // Schedule tasks to be run on the server.
  const job = schedule.scheduleJob("*/1 * * * *", async function () {
    console.log("Job Start!");
    await callback(app);
  });
}