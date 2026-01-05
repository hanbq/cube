export const USER_STATUS = {
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE',
} as const;

export type UserStatus = typeof USER_STATUS[keyof typeof USER_STATUS];
