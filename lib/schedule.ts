import schedule, { Range, RecurrenceRule } from "node-schedule"

type callbackCronJob = () => void



export default function Schedule(rule : RecurrenceRule, callback : callbackCronJob){
    return schedule.scheduleJob(rule, callback);
}

// export function daily(callback: callbackCronJob) {
//     schedule.scheduleJob("0 0 * * *", callback);
// }

// export function dailyAt(h: number, m: number, callback: callbackCronJob) {
//     try {
//         const rule = new schedule.RecurrenceRule();
//         rule.dayOfWeek
//         rule.hour = h;
//         rule.minute = m;
//         schedule.scheduleJob(rule, callback);
//     } catch (error: any) {
//         new Error(error);
//     }
// }

// export function weekly(callback: callbackCronJob) {
//     schedule.scheduleJob("0 0 * * 0", callback);
// }

// export function weeklyOn(d : number, h : number, m : number, callback : callbackCronJob){
//     try{
//         const rule = new schedule.RecurrenceRule();
//         rule.dayOfWeek = d;
//         rule.hour = h;
//         rule.minute = m;
//         schedule.scheduleJob(rule, callback)
//     }catch(error : any){
//         new Error(error)
//     }
// }

// export function monthly(callback : callbackCronJob){
//     schedule.scheduleJob("0 0 1 * *", callback);
// }