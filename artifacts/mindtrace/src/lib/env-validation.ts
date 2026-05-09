/**
 * Environment Variable Validation System
 * 
 * Provides robust validation and safe fallbacks for all environment variables
 * Prevents app crashes due to missing or invalid configuration
 */

// Environment variable definitions with validation rules
interface EnvVarDefinition {
  name: string;
  required: boolean;
  validator?: (value: string) => boolean;
  fallback?: string;
  description: string;
}

const ENV_DEFINITIONS: EnvVarDefinition[] = [
  {
    name: 'VITE_CLERK_PUBLISHABLE_KEY',
    required: false,
    validator: (value: string) => {
      // Clean validation - no warnings for disabled keys
      if (!value || value === 'disabled' || value === 'pk_test_disabled') {
        return false; // Disabled but valid
      }
      // Clerk publishable keys must start with pk_live_ or pk_test_
      return value.startsWith('pk_live_') || value.startsWith('pk_test_');
    },
    fallback: 'pk_test_disabled',
    description: 'Clerk frontend publishable key'
  },
  {
    name: 'VITE_CLERK_PROXY_URL',
    required: false,
    validator: (value: string) => {
      // Optional proxy URL - can be empty or valid URL
      return !value || value.startsWith('http://') || value.startsWith('https://');
    },
    fallback: '',
    description: 'Clerk proxy URL for custom domains'
  },
  {
    name: 'VITE_BASE_URL',
    required: false,
    validator: (value: string) => {
      // Allow empty or disabled values
      if (!value || value === 'disabled') {
        return false; // Invalid but not fatal
      }
      return value.length > 0;
    },
    fallback: 'http://localhost:5173',
    description: 'Base URL for the application'
  },
  {
    name: 'VITE_NODE_ENV',
    required: false,
    validator: (value: string) => ['development', 'production', 'test'].includes(value),
    fallback: 'development',
    description: 'Node environment'
  },
  {
    name: 'VITE_PORT',
    required: false,
    validator: (value: string) => {
      const port = parseInt(value, 10);
      return !isNaN(port) && port > 0 && port < 65536;
    },
    fallback: '5173',
    description: 'Server port'
  },
  {
    name: 'VITE_BASE_PATH',
    required: false,
    validator: (value: string) => value.length > 0,
    fallback: '/',
    description: 'Base path for routing'
  },
  {
    name: 'VITE_DATABASE_URL',
    required: false,
    validator: (value: string) => {
      // Basic PostgreSQL URL validation
      return value.startsWith('postgresql://') || value.startsWith('postgres://');
    },
    fallback: 'postgresql://mock:mock@localhost:5432/mockdb',
    description: 'Database connection string'
  },
  {
    name: 'VITE_CLERK_SECRET_KEY',
    required: false,
    validator: (value: string) => {
      // Clerk secret keys must start with sk_live_ or sk_test_
      return value.startsWith('sk_live_') || value.startsWith('sk_test_');
    },
    fallback: 'sk_test_disabled_for_development',
    description: 'Clerk backend secret key'
  },
  {
    name: 'VITE_LOG_LEVEL',
    required: false,
    validator: (value: string) => ['error', 'warn', 'info', 'debug'].includes(value),
    fallback: 'info',
    description: 'Logging level'
  },
  {
    name: 'VITE_REPL_ID',
    required: false,
    validator: () => true, // Always valid
    fallback: '',
    description: 'Replit environment ID'
  },
  {
    name: 'DATABASE_URL',
    required: false,
    validator: (value: string) => {
      // Clean validation - local mode is valid
      if (!value || value === 'local' || value === 'disabled') {
        return false; // Local mode but valid
      }
      // Basic PostgreSQL URL validation
      return value.startsWith('postgresql://') || value.startsWith('postgres://');
    },
    fallback: 'local',
    description: 'Database connection string (backend)'
  },
  {
    name: 'CLERK_SECRET_KEY',
    required: false,
    validator: (value: string) => {
      // Clean validation - disabled keys are valid
      if (!value || value === 'disabled' || value === 'sk_test_disabled') {
        return false; // Disabled but valid
      }
      // Clerk secret keys must start with sk_live_ or sk_test_
      return value.startsWith('sk_live_') || value.startsWith('sk_test_');
    },
    fallback: 'sk_test_disabled',
    description: 'Clerk backend secret key'
  },
  {
    name: 'VITE_ANALYTICS_ID',
    required: false,
    validator: (value: string) => {
      // Clean validation - disabled is valid
      if (!value || value === 'disabled') {
        return false; // Disabled but valid
      }
      // Basic analytics ID validation (Google Analytics format)
      return value.startsWith('GA-') || value.startsWith('G-');
    },
    fallback: 'disabled',
    description: 'Analytics tracking ID'
  }
];

// Validation results
interface ValidationResult {
  isValid: boolean;
  value: string;
  isUsingFallback: boolean;
  warnings: string[];
}

// Cache validation results
const validationCache = new Map<string, ValidationResult>();

/**
 * Validate a single environment variable
 */
function validateEnvVar(definition: EnvVarDefinition | undefined): ValidationResult {
  // Guard against undefined definition
  if (!definition?.name) {
    return {
      isValid: false,
      value: '',
      isUsingFallback: true,
      warnings: ['Invalid environment variable definition']
    };
  }

  const cached = validationCache.get(definition.name);
  if (cached) {
    return cached;
  }

  // Handle both frontend (import.meta.env) and backend (process.env) variables
  let rawValue: string | undefined;
  
  if (definition.name.startsWith('VITE_') || definition.name.startsWith('NEXT_PUBLIC_')) {
    // Frontend variable
    rawValue = import.meta.env[definition.name];
  } else {
    // Backend variable - in frontend, this will be undefined, so we use fallback
    if (typeof process !== 'undefined' && process.env) {
      rawValue = process.env[definition.name];
    } else {
      rawValue = undefined;
    }
  }
  const warnings: string[] = [];
  let isValid = true;
  let value = rawValue;
  let isUsingFallback = false;

  // Check if value exists and is not undefined
  if (rawValue === undefined || rawValue === null || rawValue === '') {
    if (definition.required) {
      warnings.push(`Required environment variable ${definition.name} is missing or empty`);
      isValid = false;
    }
    
    if (definition.fallback) {
      value = definition.fallback;
      isUsingFallback = true;
      warnings.push(`Using fallback value for ${definition.name}: ${definition.fallback}`);
    }
  } else {
    // Sanitize the value - trim whitespace and check for placeholder patterns
    const sanitizedValue = rawValue.trim();
    
    // Check for common placeholder patterns
    const placeholderPatterns = [
      'dummy', 'test', 'xxxx', 'xxxxx', 'placeholder', 'example',
      'your_key_here', 'replace_with_actual', 'change_me'
    ];
    
    const isPlaceholder = placeholderPatterns.some(pattern => 
      sanitizedValue.toLowerCase().includes(pattern)
    );
    
    if (isPlaceholder) {
      warnings.push(`Placeholder value detected for ${definition.name}: ${sanitizedValue}`);
      isValid = false;
      
      if (definition.fallback) {
        value = definition.fallback;
        isUsingFallback = true;
        warnings.push(`Using fallback value for ${definition.name}: ${definition.fallback}`);
      }
    } else {
      // Validate the sanitized value if it exists
      if (definition.validator && !definition.validator(sanitizedValue)) {
        warnings.push(`Invalid value for ${definition.name}: ${sanitizedValue}`);
        isValid = false;
        
        if (definition.fallback) {
          value = definition.fallback;
          isUsingFallback = true;
          warnings.push(`Using fallback value for ${definition.name}: ${definition.fallback}`);
        }
      } else {
        value = sanitizedValue;
      }
    }
  }

  const result: ValidationResult = {
    isValid,
    value: value || '',
    isUsingFallback,
    warnings
  };

  validationCache.set(definition.name, result);
  return result;
}

/**
 * Get validated environment variable with fallback
 */
export function getValidatedEnv(name: string): string {
  const definition = ENV_DEFINITIONS.find(def => def.name === name);
  if (!definition) {
    // Silent fallback for missing definitions
    return import.meta.env[name] ?? '';
  }

  const result = validateEnvVar(definition);
  
  // Silent fallback - no console spam for normal operation
  return result.value;
}

/**
 * Check if Clerk integration is properly configured
 */
export function isClerkEnabled(): boolean {
  try {
    const key = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
    return Boolean(key && 
      (key.startsWith('pk_live_') || key.startsWith('pk_test_')) &&
      !key.includes('placeholder') &&
      !key.includes('disabled') &&
      key.length > 20);
  } catch {
    return false;
  }
}

/**
 * Check if database is properly configured
 */
export function isDatabaseEnabled(): boolean {
  try {
    const dbDef = ENV_DEFINITIONS.find((def) => def?.name === "DATABASE_URL");
    const dbResult = validateEnvVar(dbDef);
    return Boolean(dbResult?.isValid);
  } catch {
    return false;
  }
}

/**
 * Get all validation results for debugging
 */
/**
 * Check if analytics is properly configured
 */
export function isAnalyticsEnabled(): boolean {
  try {
    const analyticsDef = ENV_DEFINITIONS.find((def) => def?.name === "VITE_ANALYTICS_ID");
    const analyticsResult = validateEnvVar(analyticsDef);
    return Boolean(analyticsResult?.isValid);
  } catch {
    return false;
  }
}

/**
 * Log single startup summary instead of noisy individual logs
 */
export function logStartupSummary(): void {
  if (import.meta.env.DEV) {
    const clerkEnabled = isClerkEnabled();
    const dbEnabled = isDatabaseEnabled();
    const analyticsEnabled = isAnalyticsEnabled();
    
    console.log(
      `%c🧠 Mind Trace - Development Mode\n` +
      `┌─────────────────────────────────┐\n` +
      `│ Authentication: ${clerkEnabled ? 'Real (Clerk)' : 'Local (localStorage)'}\n` +
      `│ Database:       ${dbEnabled ? 'Real' : 'Local (localStorage)'}\n` +
      `│ Analytics:      ${analyticsEnabled ? 'Real' : 'Local (disabled)'}\n` +
      `└─────────────────────────────────┘`,
      'color: #6366f1; font-weight: bold;'
    );
  }
}

/**
 * Get all validation results for debugging
 */
export function getValidationResults(): Record<string, ValidationResult> {
  const results: Record<string, ValidationResult> = {};
  
  ENV_DEFINITIONS.forEach((definition) => {
    const envName = definition?.name ?? "unknown";
    results[envName] = validateEnvVar(definition);
  });
  
  return results;
}

/**
 * Log environment validation summary
 */
export function logEnvironmentValidation(): void {
  const results = getValidationResults();
  const enabledIntegrations: string[] = [];
  const disabledIntegrations: string[] = [];
  
  if (isClerkEnabled()) {
    enabledIntegrations.push('Clerk Authentication');
  } else {
    disabledIntegrations.push('Clerk Authentication (using mock)');
  }
  
  if (isDatabaseEnabled()) {
    enabledIntegrations.push('Database');
  } else {
    disabledIntegrations.push('Database (using mock)');
  }
  
  console.group('🔧 Environment Validation Summary');
  console.log('✅ Enabled Integrations:', enabledIntegrations);
  if (disabledIntegrations.length > 0) {
    console.warn('⚠️ Disabled Integrations:', disabledIntegrations);
  }
  
  // Log any warnings
  const allWarnings = Object.values(results).flatMap(r => r.warnings);
  if (allWarnings.length > 0) {
    console.warn('⚠️ Warnings:', allWarnings);
  } else {
    console.log('✅ All environment variables are valid');
  }
  
  console.groupEnd();
}
