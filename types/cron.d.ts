import schedule from 'node-schedule';
declare type callbackCron = (job: schedule.Job) => void;
export default function setupCron(callback: callbackCron): void;
export {};
//# sourceMappingURL=cron.d.ts.map