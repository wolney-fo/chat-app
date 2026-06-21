import { useQuery } from "@tanstack/react-query";
import { SessionCard } from "./session-card";
import { chatsListSchema } from "../http/schemas/chats";
import { SessionCardSkeleton } from "./session-card-skeleton";

export function Sidebar() {
  const { data, isLoading } = useQuery({
    queryKey: ["chats"],
    queryFn: async () => {
      const response = await fetch(
        `${import.meta.env.DEV ? "http://" : "https://"}${import.meta.env.VITE_API_URI}/chats`,
        {
          credentials: "include",
        },
      );
      const data = await response.json();

      return chatsListSchema.parse(data).chats;
    },
  });

  return (
    <aside className="flex flex-col justify-between p-4 border-r border-zinc-200">
      <div className="space-y-2">
        {isLoading ? (
          <>
            <SessionCardSkeleton />
            <SessionCardSkeleton />
          </>
        ) : (
          data?.map((chat) => (
            <SessionCard
              key={chat._id}
              id={chat._id}
              title={chat.name}
              lastMessage={chat.lastMessage?.content ?? "Nenhuma mensagem"}
              lastMessageAt={chat.lastMessage?.createdAt ?? new Date()}
            />
          ))
        )}
      </div>
      <small className="text-zinc-400">
        ChatApp &copy; {new Date().getFullYear()}
      </small>
    </aside>
  );
}
