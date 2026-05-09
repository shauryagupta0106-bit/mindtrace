/**
 * Smart System Modes - Intentional fallback behaviors
 * Instead of warnings, we define clear operational modes
 */

export type SystemMode = 'development-local' | 'production-real';

export interface SystemConfig {
  mode: SystemMode;
  authentication: 'local' | 'clerk';
  database: 'local' | 'external';
  analytics: 'local' | 'external';
}

export function getSystemMode(): SystemConfig {
  const clerkEnabled = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY?.startsWith('pk_live_') || 
                      import.meta.env.VITE_CLERK_PUBLISHABLE_KEY?.startsWith('pk_test_');
  const dbExternal = import.meta.env.DATABASE_URL?.startsWith('postgresql://') || 
                    import.meta.env.DATABASE_URL?.startsWith('postgres://');
  const analyticsExternal = import.meta.env.VITE_ANALYTICS_ID?.startsWith('GA-') || 
                           import.meta.env.VITE_ANALYTICS_ID?.startsWith('G-');

  const mode: SystemMode = (clerkEnabled || dbExternal || analyticsExternal) 
    ? 'production-real' 
    : 'development-local';

  return {
    mode,
    authentication: clerkEnabled ? 'clerk' : 'local',
    database: dbExternal ? 'external' : 'local',
    analytics: analyticsExternal ? 'external' : 'local',
  };
}

export function isLocalMode(): boolean {
  const config = getSystemMode();
  return config.mode === 'development-local';
}

export function isRealMode(): boolean {
  const config = getSystemMode();
  return config.mode === 'production-real';
}
