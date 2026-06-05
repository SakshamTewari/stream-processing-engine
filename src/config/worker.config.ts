/*
event
  ↓
worker
  ↓
handler.handle()
  ↓
success ?
  ↓ yes        ↓ no
done        retry queue
*/

export const WORKER_CONFIG = {
    MAX_RETRIES: 3,
    POLL_INTERVAL_MS: 1000,
    WORKER_COUNT: 3,
}