import { Link } from "@tanstack/react-router";
import { dayjs } from "../lib/dayjs";

interface SessionCardProps {
  id: string;
  title: string;
  lastMessage: string;
  lastMessageAt: Date;
}

export function SessionCard({
  id,
  title,
  lastMessage,
  lastMessageAt,
}: SessionCardProps) {
  const isActive: boolean = false;

  return (
    <Link
      to="/chats/$id"
      params={{ id }}
      data-active={isActive}
      title={lastMessage}
      className="flex items-center gap-2 w-full p-2 hover:bg-zinc-100 data-[active=true]:bg-zinc-100 rounded-lg"
    >
      <p className="flex items-center justify-center w-10 h-10 font-black text-indigo-950 bg-indigo-400 uppercase rounded-lg">
        {title.slice(0, 2)}
      </p>
      <div className="space-y-1 max-w-40">
        <p className="font-semibold text-zinc-700">{title}</p>
        <p className="text-sm text-zinc-500 truncate">{lastMessage}</p>
      </div>

      <p className="text-xs text-zinc-400 mb-auto">
        {dayjs(lastMessageAt).fromNow()}
      </p>
    </Link>
  );
}
