const schedule = require("node-schedule");
function setupCron(callback, app) {
  // Schedule tasks to be run on the server.
  const job = schedule.scheduleJob("*/1 * * * *", async function () {
    console.log("Job Start!");
    await callback(app);
  });
}

module.exports = { setupCron };
