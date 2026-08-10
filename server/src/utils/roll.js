const ROLL_REGEX = /^[a-z]{2}\d{7}$/i;

export function normalizeRoll(rollNo) {
  return typeof rollNo === 'string' ? rollNo.trim().toLowerCase() : '';
}

export function isValidRoll(rollNo) {
  return ROLL_REGEX.test(normalizeRoll(rollNo));
}

export function generateTrackingCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}
