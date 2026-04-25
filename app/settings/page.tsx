"use client";

import { useSession } from "next-auth/react";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { User, Bell, Shield, Database, Trash2 } from "lucide-react";

export default function SettingsPage() {
  const { data: session } = useSession();

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-heading">Settings</h1>
        <p className="text-text-muted">Manage your profile and neural bank configurations.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Navigation */}
        <div className="space-y-1">
          {[
            { icon: User, label: "Profile" },
            { icon: Bell, label: "Notifications" },
            { icon: Shield, label: "Security & Privacy" },
            { icon: Database, label: "Data Management" },
          ].map((item) => (
            <button
              key={item.label}
              className="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium text-text-muted hover:bg-white/5 hover:text-white transition-all"
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="md:col-span-2 space-y-6">
          <Card className="space-y-6">
            <h3 className="text-lg font-bold font-heading">Personal Information</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-text-muted">Full Name</label>
                <Input defaultValue={session?.user?.name || ""} />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-text-muted">Email Address</label>
                <Input defaultValue={session?.user?.email || ""} disabled />
              </div>
              <Button size="sm">Save Changes</Button>
            </div>
          </Card>

          <Card className="space-y-6 border-red-500/20 bg-red-500/[0.02]">
            <h3 className="text-lg font-bold font-heading text-red-400">Danger Zone</h3>
            <div className="space-y-4">
              <p className="text-sm text-text-muted leading-relaxed">
                Once you delete your account and neural data, there is no going back. Please be certain.
              </p>
              <Button variant="outline" className="border-red-500/50 text-red-400 hover:bg-red-500/10 gap-2">
                <Trash2 className="w-4 h-4" />
                Delete Account
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
