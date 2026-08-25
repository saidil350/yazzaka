interface AttemptRecord {
  count: number;
  windowStart: number;
}

const attempts = new Map<string, AttemptRecord>();

const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000; // 15 menit
const LOCKOUT_MS = 15 * 60 * 1000;

export function checkRateLimit(key: string): { allowed: boolean; retryAfterSeconds?: number } {
  const now = Date.now();
  const record = attempts.get(key);

  if (record) {
    const elapsed = now - record.windowStart;
    if (record.count >= MAX_ATTEMPTS && elapsed < LOCKOUT_MS) {
      const remainingMs = LOCKOUT_MS - elapsed;
      return { allowed: false, retryAfterSeconds: Math.ceil(remainingMs / 1000) };
    }
    if (elapsed >= WINDOW_MS && record.count < MAX_ATTEMPTS) {
      attempts.delete(key);
    } else if (elapsed >= WINDOW_MS) {
      attempts.set(key, { count: 0, windowStart: now });
    }
  }

  return { allowed: true };
}

export function recordFailedAttempt(key: string): void {
  const now = Date.now();
  const record = attempts.get(key);
  if (!record || now - record.windowStart >= WINDOW_MS) {
    attempts.set(key, { count: 1, windowStart: now });
  } else {
    record.count += 1;
  }
}

export function resetRateLimit(key: string): void {
  attempts.delete(key);
}

export function clearExpiredAttempts(): void {
  const now = Date.now();
  for (const [key, record] of attempts.entries()) {
    if (now - record.windowStart > LOCKOUT_MS) attempts.delete(key);
  }
}
