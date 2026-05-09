/**
 * External Script Loader with Retry Logic
 * 
 * Safely loads external scripts (like Clerk) with timeout,
 * retry logic, and graceful fallback handling
 */

interface ScriptLoadOptions {
  src: string;
  timeout?: number;
  retries?: number;
  retryDelay?: number;
  onSuccess?: () => void;
  onError?: (error: Error) => void;
  onRetry?: (attempt: number) => void;
}

interface LoadedScript {
  src: string;
  loaded: boolean;
  error: Error | null;
  promise: Promise<void>;
}

// Cache of loaded scripts
const scriptCache = new Map<string, LoadedScript>();

/**
 * Load an external script with retry logic and timeout protection
 */
export function loadScriptWithOptions(options: ScriptLoadOptions): Promise<void> {
  const {
    src,
    timeout = 10000, // 10 seconds default timeout
    retries = 3,
    retryDelay = 1000, // 1 second default retry delay
    onSuccess,
    onError,
    onRetry
  } = options;

  // Check if already loaded or loading
  if (scriptCache.has(src)) {
    const cached = scriptCache.get(src)!;
    if (cached.loaded) {
      onSuccess?.();
      return Promise.resolve();
    }
    if (cached.error) {
      onError?.(cached.error);
      return Promise.reject(cached.error);
    }
    return cached.promise;
  }

  // Create cache entry
  const loadPromise = (async () => {
    let lastError: Error | null = null;

    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        await loadScriptOnce(src, timeout);
        
        // Success - create loaded script entry
        const successEntry: LoadedScript = {
          src,
          loaded: true,
          error: null,
          promise: Promise.resolve()
        };
        scriptCache.set(src, successEntry);
        onSuccess?.();
        console.log(`✅ Script loaded successfully: ${src} (attempt ${attempt})`);
        return;
        
      } catch (error) {
        lastError = error as Error;
        
        console.warn(`⚠️ Script load failed (attempt ${attempt}/${retries}): ${src}`, error);
        
        if (attempt < retries) {
          onRetry?.(attempt);
          console.log(`🔄 Retrying in ${retryDelay}ms...`);
          await new Promise(resolve => setTimeout(resolve, retryDelay));
        }
      }
    }

    // All retries failed - create failed script entry
    const failedEntry: LoadedScript = {
      src,
      loaded: false,
      error: lastError,
      promise: Promise.reject(lastError!)
    };
    scriptCache.set(src, failedEntry);
    onError?.(lastError!);
    throw lastError!;
  })();

  const cacheEntry: LoadedScript = {
    src,
    loaded: false,
    error: null,
    promise: loadPromise
  };

  scriptCache.set(src, cacheEntry);
  return loadPromise;
}

/**
 * Load a script once with timeout and enhanced error handling
 */
function loadScriptOnce(src: string, timeout: number): Promise<void> {
  return new Promise((resolve, reject) => {
    // Check if script already exists in DOM
    const existingScript = document.querySelector(`script[src="${src}"]`);
    if (existingScript) {
      // Check if the existing script already loaded successfully
      if (existingScript.getAttribute('data-loaded') === 'true') {
        resolve();
        return;
      }
      // If it exists but not loaded, wait for it
      const checkLoaded = () => {
        if (existingScript.getAttribute('data-loaded') === 'true') {
          resolve();
        } else if (existingScript.getAttribute('data-error') === 'true') {
          reject(new Error(`Existing script failed to load: ${src}`));
        } else {
          setTimeout(checkLoaded, 100);
        }
      };
      checkLoaded();
      return;
    }

    const script = document.createElement('script');
    script.src = src;
    script.async = true;
    script.crossOrigin = 'anonymous';
    
    // Add attributes for tracking
    script.setAttribute('data-loading', 'true');

    // Timeout handling
    const timeoutId = setTimeout(() => {
      script.setAttribute('data-error', 'true');
      script.setAttribute('data-timeout', 'true');
      script.remove();
      reject(new Error(`Script load timeout: ${src} (${timeout}ms)`));
    }, timeout);

    // Enhanced load handlers
    script.onload = () => {
      clearTimeout(timeoutId);
      script.setAttribute('data-loaded', 'true');
      script.removeAttribute('data-loading');
      console.log(`✅ Script loaded successfully: ${src}`);
      resolve();
    };

    script.onerror = (event) => {
      clearTimeout(timeoutId);
      script.setAttribute('data-error', 'true');
      script.removeAttribute('data-loading');
      
      // Provide more detailed error information
      const errorMessage = event instanceof ErrorEvent 
        ? `Script load failed: ${src} - ${event.message}`
        : `Script load failed: ${src}`;
      
      console.error(`❌ ${errorMessage}`);
      reject(new Error(errorMessage));
    };

    // Add to DOM with error handling
    try {
      document.head.appendChild(script);
    } catch (error) {
      clearTimeout(timeoutId);
      script.setAttribute('data-error', 'true');
      reject(new Error(`Failed to append script to DOM: ${src} - ${error}`));
    }
  });
}

/**
 * Load Clerk scripts safely with fallback
 */
export function loadClerkScripts(): Promise<{ success: boolean; error?: Error }> {
  const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY ?? '';
  
  // If no valid Clerk key, don't load scripts
  if (!clerkPubKey || 
      !clerkPubKey.startsWith('pk_') || 
      clerkPubKey === 'pk_test_disabled' ||
      clerkPubKey.includes('placeholder') ||
      clerkPubKey === 'disabled') {
    console.log('🔐 Clerk key disabled or invalid, using mock authentication');
    return Promise.resolve({ success: true });
  }

  // Clerk script URLs
  const clerkScriptUrl = 'https://js.clerk.dev/v4.72.4/clerk.browser.js';
  
  return loadScriptWithOptions({
    src: clerkScriptUrl,
    timeout: 15000, // 15 seconds for Clerk
    retries: 3,
    retryDelay: 2000, // 2 seconds between retries
    onSuccess: () => {
      console.log('🔐 Clerk scripts loaded successfully');
    },
    onError: (error) => {
      console.error('🔐 Failed to load Clerk scripts:', error);
    },
    onRetry: (attempt) => {
      console.log(`🔐 Retrying Clerk script load (attempt ${attempt})`);
    }
  })
  .then(() => ({ success: true }))
  .catch((error) => ({ success: false, error }));
}

/**
 * Preload critical scripts on app startup
 */
export function preloadCriticalScripts(): Promise<void> {
  console.log('🚀 Starting critical script preload...');
  
  return loadClerkScripts()
    .then((result) => {
      if (result.success) {
        console.log('✅ All critical scripts preloaded successfully');
      } else {
        console.warn('⚠️ Some critical scripts failed to load, app will use fallbacks');
      }
    })
    .catch((error) => {
      console.error('❌ Critical script preload failed:', error);
    });
}

/**
 * Check if a script is loaded
 */
export function isScriptLoaded(src: string): boolean {
  const cached = scriptCache.get(src);
  return cached?.loaded || false;
}

/**
 * Clear script cache (useful for testing)
 */
export function clearScriptCache(): void {
  scriptCache.clear();
  console.log('🗑️ Script cache cleared');
}

/**
 * Get script loading status for debugging
 */
export function getScriptLoadingStatus(): Record<string, { loaded: boolean; error: string | null }> {
  const status: Record<string, { loaded: boolean; error: string | null }> = {};
  
  scriptCache.forEach((loadedScript, src) => {
    status[src] = {
      loaded: loadedScript.loaded,
      error: loadedScript.error?.message || null
    };
  });
  
  return status;
}
