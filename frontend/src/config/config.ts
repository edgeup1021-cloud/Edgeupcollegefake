/**
 * config.ts - Application Configuration
 *
 * Centralized configuration management.
 */

export const config = {
  // API Configuration
  api: {
    baseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api',
    timeout: 30000, // 30 seconds
  },

  // App Configuration
  app: {
    name: 'EdgeUp College',
    version: '1.0.0',
    description: 'Educational Management Portal',
  },

  // Auth Configuration
  auth: {
    tokenKey: 'accessToken',
    refreshTokenKey: 'refreshToken',
    tokenExpiry: 15 * 60 * 1000, // 15 minutes
    refreshTokenExpiry: 7 * 24 * 60 * 60 * 1000, // 7 days
  },

  // Feature Flags
  features: {
    enableSmartAssistant: true,
    enableJobMatcher: true,
    enableMentalHealth: true,
    enablePredictiveAnalytics: true,
  },

  // Pagination defaults
  pagination: {
    defaultPageSize: 10,
    maxPageSize: 100,
  },
} as const;

export type Config = typeof config;
