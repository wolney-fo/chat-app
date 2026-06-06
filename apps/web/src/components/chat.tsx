import { ArrowUpIcon } from "lucide-react";
import { Message } from "./message";

export function Chat() {
  const messages: {
    id: string;
    side: "received" | "sent";
    content: string;
    createdAt: Date;
  }[] = [
    {
      id: "1",
      side: "received",
      content: "Hey! Whats up",
      createdAt: new Date(2026, 5, 5, 21, 16),
    },
    {
      id: "2",
      side: "sent",
      content: "Hey!! Here you are",
      createdAt: new Date(2026, 5, 5, 21, 24),
    },
    {
      id: "3",
      side: "received",
      content: "E o PIX?",
      createdAt: new Date(2026, 5, 5, 21, 26),
    },
  ];

  return (
    <div className="flex flex-col items-center flex-1 bg-zinc-50">
      <header className="w-full p-4 border-b border-zinc-200 bg-white">
        <h2 className="font-semibold text-lg text-center">Wolney</h2>
      </header>

      <div className="flex-1 w-full py-4 overflow-y-auto">
        {messages.length > 0 ? (
          <div className="w-11/12 max-w-5xl space-y-2 mx-auto">
            {messages.map((message) => (
              <Message
                key={message.id}
                side={message.side}
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

      <form className="flex items-center gap-4 w-11/12 max-w-2xl p-4 bg-indigo-50 border border-zinc-200 rounded-xl mb-8 shadow-sm shadow-indigo-400/50">
        <input
          className="outline-none flex-1"
          type="text"
          placeholder="Type a message"
          autoComplete="off"
        />
        <button className="p-2 bg-indigo-500 rounded-full cursor-pointer">
          <ArrowUpIcon className="size-5 text-white" />
        </button>
      </form>
    </div>
  );
}
