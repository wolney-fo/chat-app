import { createFileRoute, redirect } from "@tanstack/react-router";
import { LoginForm } from "../components/login-form";
import { getProfile } from "../http/get-profile";

export const Route = createFileRoute("/login")({
  beforeLoad: async () => {
    const user = await getProfile().catch(() => null);
    if (user) throw redirect({ to: "/" });
  },
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="flex items-center justify-center w-screen h-screen">
      <LoginForm />
    </div>
  );
}
