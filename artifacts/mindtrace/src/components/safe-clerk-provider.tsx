import React from "react";
import {
  ClerkProvider,
  SignIn,
  SignUp,
  UserButton,
  useAuth,
  useUser,
} from "@clerk/react";
import { LocalAuthProvider, useLocalAuthContext } from "@/lib/local-auth-context";
import LocalSignIn from "@/pages/LocalSignIn";
import LocalSignUp from "@/pages/LocalSignUp";
import { LogOut } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";

export const isValidClerkKey = (key: string | undefined): boolean => {
  return Boolean(
    key &&
      key.length > 20 &&
      (key.startsWith("pk_live_") || key.startsWith("pk_test_")) &&
      !key.includes("placeholder") &&
      !key.includes("disabled")
  );
};

export const clerkEnabled = (): boolean => {
  const key = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY as string | undefined;
  return isValidClerkKey(key);
};

import { setMockUserId } from "@workspace/api-client-react";

// Synchronizes the authenticated user ID with the local mock API database
function MockApiUserSync() {
  const user = useSafeUser();
  React.useEffect(() => {
    if (user?.id) {
      setMockUserId(user.id);
    } else {
      setMockUserId("anonymous");
    }
  }, [user?.id]);
  return null;
}

export function SafeClerkProvider({ children }: { children: React.ReactNode }) {
  const key = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY as string | undefined;

  if (!isValidClerkKey(key)) {
    return (
      <LocalAuthProvider>
        <MockApiUserSync />
        {children}
      </LocalAuthProvider>
    );
  }

  return (
    <ClerkProvider
      publishableKey={key as string}
      appearance={{
        variables: {
          colorPrimary: "#7c3aed",
          colorBackground: "#13111c",
          colorInputBackground: "#1e1b2e",
          colorInputText: "#ffffff",
          borderRadius: "12px",
        },
        elements: {
          card: "bg-[#13111c] shadow-2xl shadow-purple-900/20 border border-white/10",
          headerTitle: "text-white",
          formButtonPrimary: "bg-gradient-to-r from-violet-600 to-purple-600 hover:opacity-90",
          socialButtonsBlockButton: "border border-white/10 text-white hover:bg-white/5",
          // Hide clerk's bottom banner
          footer: "hidden",
        },
      }}
    >
      <DevBadgeRemover />
      <MockApiUserSync />
      {children}
    </ClerkProvider>
  );
}

// Resilient DOM sweeper that finds and hides Clerk's forced 'Development mode' text anywhere it appears
function DevBadgeRemover() {
  React.useEffect(() => {
    const hideBadges = () => {
      // Find all elements containing exact text "Development mode"
      const allElements = document.querySelectorAll("div, span");
      allElements.forEach((el) => {
        if (el.textContent === "Development mode" && el.children.length === 0) {
          // Hide the badge container
          const container = el.closest(".cl-badge") || el.parentElement;
          if (container) {
            (container as HTMLElement).style.display = "none";
            // Also try to hide the 30px stripe wrapper if it exists
            const wrapper = container.closest('div[style*="border-bottom"]');
            if (wrapper) (wrapper as HTMLElement).style.display = "none";
          }
        }
      });

      // Hide the global floating banner which usually has z-index 99999 or is fixed
      const banners = document.querySelectorAll('div[style*="z-index: 99999"], div[style*="z-index: 100000"]');
      banners.forEach(b => {
        if (b.textContent?.includes("Development") || b.textContent?.includes("Clerk")) {
          (b as HTMLElement).style.display = "none";
        }
      });
    };

    hideBadges();
    const interval = setInterval(hideBadges, 100);
    return () => clearInterval(interval);
  }, []);

  return null;
}

export function SafeSignIn() {
  if (!clerkEnabled()) {
    return <LocalSignIn />;
  }
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <SignIn
        routing="path"
        path="/sign-in"
        fallbackRedirectUrl="/dashboard"
        signUpFallbackRedirectUrl="/dashboard"
      />
    </div>
  );
}

export function SafeSignUp() {
  if (!clerkEnabled()) {
    return <LocalSignUp />;
  }
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <SignUp
        routing="path"
        path="/sign-up"
        fallbackRedirectUrl="/dashboard"
        signInFallbackRedirectUrl="/dashboard"
      />
    </div>
  );
}

function LocalUserAvatar() {
  const { user, signOut } = useLocalAuthContext();
  const label = (user?.firstName?.[0] || user?.email?.[0] || "U").toUpperCase();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="w-8 h-8 rounded-full bg-primary/20 border border-primary/35 text-primary flex items-center justify-center hover:bg-primary/30 transition-colors outline-none cursor-pointer">
          <span className="text-xs font-bold">{label}</span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 glass-card" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none text-foreground">
              {user?.fullName || user?.firstName || "User"}
            </p>
            <p className="text-xs leading-none text-muted-foreground truncate">
              {user?.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-white/10" />
        <DropdownMenuItem 
          onClick={signOut} 
          className="text-red-400 hover:text-red-300 hover:bg-red-500/10 cursor-pointer transition-colors"
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function SafeUserButton(props: any) {
  if (!clerkEnabled()) {
    return <LocalUserAvatar />;
  }
  return <UserButton {...props} />;
}

export function useSafeAuth() {
  const local = useLocalAuthContext();
  let clerkAuth: ReturnType<typeof useAuth> | null = null;
  try {
    clerkAuth = useAuth();
  } catch {
    clerkAuth = null;
  }

  if (!clerkEnabled() || !clerkAuth) {
    return {
      isSignedIn: local.isSignedIn,
      signOut: local.signOut,
      userId: local.user?.id ?? null,
    };
  }

  return clerkAuth;
}

export function useSafeUser() {
  const local = useLocalAuthContext();
  let clerkUser: ReturnType<typeof useUser>["user"] | null = null;
  try {
    clerkUser = useUser().user ?? null;
  } catch {
    clerkUser = null;
  }

  if (!clerkEnabled() || !clerkUser) {
    return local.user
      ? {
          id: local.user.id,
          fullName: local.user.fullName,
          firstName: local.user.firstName,
          primaryEmailAddress: { emailAddress: local.user.primaryEmailAddress },
          lastSignInAt: local.user.lastSignInAt,
          createdAt: local.user.createdAt,
          imageUrl: local.user.imageUrl,
        }
      : null;
  }

  return clerkUser;
}
