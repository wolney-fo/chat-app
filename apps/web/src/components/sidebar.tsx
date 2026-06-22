import { useEffect, useState } from "react";
import { SessionCard } from "./session-card";
import { chatsSocketEventSchema, type ChatSchema } from "../http/schemas/chats";
import { SessionCardSkeleton } from "./session-card-skeleton";

export function Sidebar() {
  const [chats, setChats] = useState<ChatSchema[] | null>(null);

  useEffect(() => {
    const websocket = new WebSocket(
      `${import.meta.env.DEV ? "ws://" : "wss://"}${import.meta.env.VITE_API_URI}/chats`,
    );

    websocket.addEventListener("message", (event) => {
      const data = JSON.parse(event.data);
      const parsedData = chatsSocketEventSchema.parse(data);

      if (parsedData.type === "history") {
        setChats(parsedData.chats);
        return;
      }

      setChats((prev) => {
        if (!prev?.some((chat) => chat._id === parsedData.chat._id)) {
          return [parsedData.chat, ...(prev ?? [])];
        }

        return prev.map((chat) =>
          chat._id === parsedData.chat._id ? parsedData.chat : chat,
        );
      });
    });

    return () => websocket.close();
  }, []);

  return (
    <aside className="flex flex-col justify-between p-4 md:w-96 border-r border-zinc-200">
      <div className="space-y-2">
        {chats === null ? (
          <>
            <SessionCardSkeleton />
            <SessionCardSkeleton />
          </>
        ) : (
          chats.map((chat) => (
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
