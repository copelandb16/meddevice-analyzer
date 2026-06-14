import { SignUp } from "@clerk/nextjs";

export const metadata = {
  title: "Sign up",
};

export default function SignUpPage() {
  return (
    <main className="mx-auto flex min-h-[60vh] max-w-6xl items-center justify-center px-6 py-16">
      <SignUp routing="path" path="/sign-up" signInUrl="/sign-in" />
    </main>
  );
}
