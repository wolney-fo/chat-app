import { useEffect, useRef, useState } from "react";
import { useCurrentUser } from "../hooks/use-current-user";
import {
  chatSocketEventSchema,
  type ChatMessageSchema,
} from "../http/schemas/chat-message";
import { Message } from "./message";
import { SendMessageForm } from "./send-message-form";

interface ChatProps {
  chatId: string;
}

const BOTTOM_THRESHOLD_PX = 100;

export function Chat({ chatId }: ChatProps) {
  const user = useCurrentUser();

  const [messages, setMessages] = useState<ChatMessageSchema[]>([]);

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const isAtBottomRef = useRef(true);

  function handleScroll() {
    const container = scrollContainerRef.current;
    if (!container) return;

    const distanceFromBottom =
      container.scrollHeight - container.scrollTop - container.clientHeight;

    isAtBottomRef.current = distanceFromBottom < BOTTOM_THRESHOLD_PX;
  }

  useEffect(() => {
    if (!isAtBottomRef.current) return;

    scrollContainerRef.current?.scrollTo({
      top: scrollContainerRef.current.scrollHeight,
    });
  }, [messages]);

  useEffect(() => {
    const websocket = new WebSocket(
      `${import.meta.env.DEV ? "ws://" : "wss://"}${import.meta.env.VITE_API_URI}/chats/${chatId}/messages`,
    );

    websocket.addEventListener("message", (event) => {
      const data = JSON.parse(event.data);
      const parsedData = chatSocketEventSchema.parse(data);

      if (parsedData.type === "history") {
        setMessages(parsedData.messages);
      } else {
        setMessages((prev) => [...prev, parsedData.message]);
      }
    });

    return () => websocket.close();
  }, [chatId]);

  return (
    <div className="flex flex-col items-center flex-1 bg-zinc-50">
      <header className="w-full p-4 border-b border-zinc-200 bg-white">
        <h2 className="font-semibold text-lg text-center">Wolney</h2>
      </header>

      <div
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className="flex-1 w-full py-4 overflow-y-auto"
      >
        {messages.length > 0 ? (
          <div className="w-11/12 max-w-5xl space-y-2 mx-auto">
            {messages.map((message) => (
              <Message
                key={`${chatId}-messages-${message._id}`}
                side={message.senderId === user?._id ? "sent" : "received"}
                content={message.content}
                createdAt={message.createdAt}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center gap-4 h-full">
            <img
              src="/hatching-chick.webp"
              alt="Hello"
              className="w-32 h-auto"
              loading="lazy"
              draggable={false}
            />
            <div className="text-center">
              <p>There are no messages here...</p>
              <p className="italic text-zinc-600">Say hi</p>
            </div>
          </div>
        )}
      </div>

      <SendMessageForm chatId={chatId} />
    </div>
  );
}
