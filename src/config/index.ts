/**
 * Application Configuration
 * 
 * Centralized configuration management for the entire application.
 * All configuration values should be imported from here.
 */

export { getEnvConfig, validateEnv, logEnvInfo, getClerkPublishableKey } from '@/lib/env';

/**
 * Application metadata
 */
export const APP_CONFIG = {
  name: 'Aurion Studio',
  version: '1.0.0',
  description: 'AI-Powered Development Platform',
  author: 'Aurion Team',
} as const;

/**
 * Feature flags - control feature availability
 * Use environment variables to toggle features
 */
export const FEATURES = {
  // Analytics & Monitoring
  ANALYTICS_ENABLED: import.meta.env.VITE_ENABLE_ANALYTICS === 'true',
  ERROR_REPORTING_ENABLED: import.meta.env.VITE_ENABLE_ERROR_REPORTING === 'true',
  PERFORMANCE_MONITORING_ENABLED: import.meta.env.VITE_ENABLE_PERFORMANCE_MONITORING === 'true',
  
  // Application Modes
  DEMO_MODE_ENABLED: !import.meta.env.VITE_CLERK_PUBLISHABLE_KEY,
  DEBUG_MODE_ENABLED: import.meta.env.DEV || import.meta.env.VITE_DEBUG_MODE === 'true',
  
  // Feature Toggles
  ENABLE_PWA: import.meta.env.VITE_ENABLE_PWA === 'true',
  ENABLE_OFFLINE_MODE: import.meta.env.VITE_ENABLE_OFFLINE_MODE === 'true',
  ENABLE_MULTI_TENANT: import.meta.env.VITE_ENABLE_MULTI_TENANT === 'true',
  
  // Tools Availability
  ENABLE_CODE_EDITOR: true,
  ENABLE_APP_BUILDER: true,
  ENABLE_AGENT_AI: true,
  ENABLE_AURION_CHAT: true,
  ENABLE_TEXT_EDITOR: true,
} as const;

/**
 * API configuration
 */
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || '/api',
  TIMEOUT: 30000,
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000,
} as const;

/**
 * Authentication configuration
 */
export const AUTH_CONFIG = {
  SIGN_IN_PATH: '/sign-in',
  SIGN_UP_PATH: '/sign-up',
  AFTER_SIGN_IN_PATH: '/dashboard',
  AFTER_SIGN_UP_PATH: '/dashboard',
} as const;

/**
 * Dashboard configuration
 */
export const DASHBOARD_CONFIG = {
  STATS_REFRESH_INTERVAL: 30000, // 30 seconds
  ACTIVITY_REFRESH_INTERVAL: 45000, // 45 seconds
  TIME_REFRESH_INTERVAL: 1000, // 1 second
} as const;

/**
 * Security configuration
 */
export const SECURITY_CONFIG = {
  SESSION_TIMEOUT: 30 * 60 * 1000, // 30 minutes
  MAX_LOGIN_ATTEMPTS: 5,
  LOCKOUT_DURATION: 15 * 60 * 1000, // 15 minutes
} as const;

/**
 * Helper to check if a feature is enabled
 */
export function isFeatureEnabled(feature: keyof typeof FEATURES): boolean {
  return FEATURES[feature] === true;
}

export default {
  APP_CONFIG,
  FEATURES,
  API_CONFIG,
  AUTH_CONFIG,
  DASHBOARD_CONFIG,
  SECURITY_CONFIG,
  isFeatureEnabled,
};
