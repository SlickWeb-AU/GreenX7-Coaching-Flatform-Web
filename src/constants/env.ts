/**
 * Application environment constants with safe fallbacks.
 * Central source of truth for public runtime environment variables.
 */
export const ENV = {
  GREENX7_URL: process.env.NEXT_PUBLIC_GREENX7_URL || 'https://www.greenx7.com',
  IMAGE_DOMAIN: process.env.NEXT_PUBLIC_IMAGE_DOMAIN || '',
  APP_URL: process.env.NEXT_PUBLIC_APP_URL || process.env.APP_URL || 'http://localhost:3000',
} as const;
