import cron from 'node-cron';
import { fullSync, syncCommodities, syncTerminals } from './sync';

let started = false;

export function startCron(): void {
  if (started) return;
  started = true;

  const intervalMinutes = parseInt(process.env.FETCH_INTERVAL_MINUTES || '30', 10);
  console.log(`[cron] Scheduling price fetch every ${intervalMinutes} minutes`);

  // Run on startup after 5s delay
  setTimeout(() => {
    fullSync().catch(console.error);
  }, 5000);

  // Schedule price sync every N minutes
  const cronExpr = `*/${intervalMinutes} * * * *`;
  cron.schedule(cronExpr, () => {
    fullSync().catch(console.error);
  });

  // Schedule commodity + terminal refresh daily at 3:07 AM
  cron.schedule('7 3 * * *', async () => {
    console.log('[cron] Daily metadata refresh');
    await syncCommodities().catch(console.error);
    await syncTerminals().catch(console.error);
  });
}
