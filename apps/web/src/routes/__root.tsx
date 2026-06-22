import {
  createRootRoute,
  Outlet,
  redirect,
  useRouterState,
} from "@tanstack/react-router";
import { Sidebar } from "../components/sidebar";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { getProfile } from "../http/get-profile";

const queryClient = new QueryClient();

const RootLayout = () => {
  const { location } = useRouterState();
  const showSidebar = location.pathname !== "/login";

  return (
    <QueryClientProvider client={queryClient}>
      <div className="flex h-screen w-screen isolate">
        {showSidebar && <Sidebar />}
        <Outlet />
      </div>
    </QueryClientProvider>
  );
};

export const Route = createRootRoute({
  beforeLoad: async ({ location }) => {
    if (location.pathname === "/login") return;

    try {
      await getProfile();
    } catch {
      throw redirect({ to: "/login" });
    }
  },
  component: RootLayout,
});
