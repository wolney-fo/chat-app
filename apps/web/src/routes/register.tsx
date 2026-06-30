import { createFileRoute, redirect } from "@tanstack/react-router";
import { RegisterForm } from "../components/register-form";
import { getProfile } from "../http/get-profile";

export const Route = createFileRoute("/register")({
  beforeLoad: async () => {
    const user = await getProfile().catch(() => null);
    if (user) throw redirect({ to: "/" });
  },
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="flex items-center justify-center w-screen h-screen">
      <RegisterForm />
    </div>
  );
}
