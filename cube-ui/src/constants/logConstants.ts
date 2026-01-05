export const LOG_STATUS = {
  SUCCESS: 'SUCCESS',
  FAILED: 'FAILED',
} as const;

export type LogStatus = typeof LOG_STATUS[keyof typeof LOG_STATUS];