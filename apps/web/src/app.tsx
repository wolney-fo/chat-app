import { Chat } from "./components/chat";
import { Sidebar } from "./components/sidebar";

export function App() {
  return (
    <div className="flex h-screen w-screen">
      <Sidebar />
      <Chat />
    </div>
  );
}
