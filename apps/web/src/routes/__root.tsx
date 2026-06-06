import { createRootRoute, Outlet } from "@tanstack/react-router";
import { Sidebar } from "../components/sidebar";
import { Chat } from "../components/chat";

const RootLayout = () => {
  return (
    <div className="flex h-screen w-screen">
      <Sidebar />
      <Outlet />
    </div>
  );
};

export const Route = createRootRoute({
  component: RootLayout,
});
