import { SessionCard } from "./session-card";

export function Sidebar() {
  return (
    <aside className="flex flex-col justify-between p-4 border-r border-zinc-200">
      <div className="space-y-2">
        <SessionCard
          id="342234"
          title="Wolney"
          lastMessage="This is the last message sent"
          lastMessageAt={new Date("2024-05-01")}
        />
      </div>
      <small className="text-zinc-400">
        ChatApp &copy; {new Date().getFullYear()}
      </small>
    </aside>
  );
}
