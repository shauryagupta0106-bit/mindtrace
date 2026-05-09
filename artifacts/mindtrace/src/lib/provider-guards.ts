/**
 * Provider Guards - Runtime safety for provider-dependent components
 * Ensures no component/hook is used without its required provider
 */

import React from 'react';
import { isClerkEnabled } from './env-validation';

// Provider status flags
export const PROVIDER_STATUS = {
  queryClient: true, // Always enabled
  clerk: isClerkEnabled(),
  tooltip: true, // Always enabled
} as const;

/**
 * Higher-order component that guards provider-dependent components
 */
export function withProviderGuard<P extends object>(
  Component: React.ComponentType<P>,
  requiredProvider: keyof typeof PROVIDER_STATUS,
  FallbackComponent?: React.ComponentType<any>
) {
  return function GuardedComponent(props: P) {
    if (!PROVIDER_STATUS[requiredProvider]) {
      return FallbackComponent ? React.createElement(FallbackComponent) : null;
    }
    return React.createElement(Component, props);
  };
}

/**
 * Hook guard for provider-dependent hooks
 */
export function useProviderGuard(
  hookName: string,
  requiredProvider: keyof typeof PROVIDER_STATUS,
  hook: () => any
) {
  if (!PROVIDER_STATUS[requiredProvider]) {
    console.warn(`Hook ${hookName} requires ${requiredProvider} provider which is not enabled`);
    return null;
  }
  return hook();
}

/**
 * Conditional rendering helper
 */
export function renderWithProvider(
  condition: boolean,
  component: React.ReactNode,
  fallback: React.ReactNode = null
) {
  return condition ? component : fallback;
}

/**
 * Safe component wrapper for QueryClient-dependent components
 */
export function SafeQueryClientComponent({ children, fallback = null }: { 
  children: React.ReactNode; 
  fallback?: React.ReactNode;
}) {
  return renderWithProvider(PROVIDER_STATUS.queryClient, children, fallback);
}

/**
 * Safe component wrapper for Clerk-dependent components
 */
export function SafeClerkComponent({ children, fallback = null }: { 
  children: React.ReactNode; 
  fallback?: React.ReactNode;
}) {
  return renderWithProvider(PROVIDER_STATUS.clerk, children, fallback);
}
