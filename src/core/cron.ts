/* tslint:disable:no-string-literal */
import schedule from "node-schedule";

type callbackCron = (job: schedule.Job) => void

export default function setupCron (callback: callbackCron): void {
  // Schedule tasks to be run on the server.
  const job = schedule.scheduleJob("*/1 * * * *", async function () {
    console.log("Job Start!");
    callback(job);
  });
}