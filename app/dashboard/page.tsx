"use client";

import { useUser } from "@clerk/nextjs";
import { Header } from "@/components/Header";
import { Card } from "@/components/ui/card";

const clerkConfigured = Boolean(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY);

export default function DashboardPage() {
  const { user, isLoaded } = useUser();

  if (!clerkConfigured) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 pt-24 pb-10">
          <Card className="p-6">
            <h1 className="text-2xl font-bold mb-2">Clerk Not Configured</h1>
            <p className="text-muted-foreground">
              Set NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY and CLERK_SECRET_KEY to enable authenticated dashboard access.
            </p>
          </Card>
        </main>
      </div>
    );
  }

  if (!isLoaded || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 pt-24 pb-10">
        <Card className="p-6">
          <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
          <p className="text-muted-foreground">Welcome {user.firstName || user.username || "User"}</p>
        </Card>
      </main>
    </div>
  );
}
