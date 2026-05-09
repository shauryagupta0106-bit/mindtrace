import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Show, RedirectToSignIn } from "@clerk/react";
import LandingPage from "@/pages/landing";
import DashboardPage from "@/pages/dashboard";
import TimelinePage from "@/pages/timeline";
import ThoughtsPage from "@/pages/thoughts";
import ThoughtDetailPage from "@/pages/thought-detail";
import NewThoughtPage from "@/pages/new-thought";
import AnalyticsPage from "@/pages/analytics";
import SettingsPage from "@/pages/settings";
import NotFound from "@/pages/not-found";
import Layout from "@/components/layout";
import { SafeSignIn, SafeSignUp, clerkEnabled } from "@/components/safe-clerk-provider";
import { localAuth } from "@/lib/local-auth";

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  if (clerkEnabled()) {
    return (
      <>
        <Show when="signed-in">{children}</Show>
        <Show when="signed-out">
          <RedirectToSignIn />
        </Show>
      </>
    );
  }

  if (!localAuth.isSignedIn()) {
    return <Navigate to="/sign-in" replace />;
  }
  return <>{children}</>;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/sign-in/*" element={<SafeSignIn />} />
        <Route path="/sign-up/*" element={<SafeSignUp />} />
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Layout>
              <DashboardPage />
            </Layout>
          </ProtectedRoute>
        } />
        <Route path="/new-thought" element={
          <ProtectedRoute>
            <Layout>
              <NewThoughtPage />
            </Layout>
          </ProtectedRoute>
        } />
        <Route path="/timeline" element={
          <ProtectedRoute>
            <Layout>
              <TimelinePage />
            </Layout>
          </ProtectedRoute>
        } />
        <Route path="/thoughts" element={
          <ProtectedRoute>
            <Layout>
              <ThoughtsPage />
            </Layout>
          </ProtectedRoute>
        } />
        <Route path="/thoughts/:id" element={
          <ProtectedRoute>
            <Layout>
              <ThoughtDetailPage />
            </Layout>
          </ProtectedRoute>
        } />
        <Route path="/analytics" element={
          <ProtectedRoute>
            <Layout>
              <AnalyticsPage />
            </Layout>
          </ProtectedRoute>
        } />
        <Route path="/settings" element={
          <ProtectedRoute>
            <Layout>
              <SettingsPage />
            </Layout>
          </ProtectedRoute>
        } />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
