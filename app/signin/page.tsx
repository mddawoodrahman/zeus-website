import { SignIn } from "@clerk/nextjs";

const clerkConfigured = Boolean(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY);

export default function SignInRoutePage() {
  if (!clerkConfigured) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 py-10">
        <div className="max-w-lg rounded-lg border border-border bg-card p-6 text-center">
          <h1 className="text-2xl font-bold mb-2">Authentication Not Configured</h1>
          <p className="text-muted-foreground">
            Add NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY and CLERK_SECRET_KEY to enable Clerk sign-in.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-10">
      <SignIn path="/signin" routing="path" signUpUrl="/signup" />
    </div>
  );
}
