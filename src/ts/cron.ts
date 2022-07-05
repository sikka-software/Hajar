import schedule from "node-schedule";

type callbackCron = () => void

export default function setupCron(callback: callbackCron){
    // Schedule tasks to be run on the server.
    const job = schedule.scheduleJob("*/1 * * * *", async function () {
        console.log("Job Start!");
        callback();
    });
}