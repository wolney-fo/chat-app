import { tv } from "tailwind-variants";
import { dayjs } from "../lib/dayjs";

const messageBaloon = tv({
  base: "flex flex-col items-end gap-2 p-4 w-max max-w-xl rounded-2xl",
  variants: {
    side: {
      received: "bg-zinc-100 rounded-ss-sm",
      sent: "bg-indigo-50 ml-auto rounded-se-sm",
    },
  },
  defaultVariants: {
    side: "sent",
  },
});

interface MessageProps {
  side: "received" | "sent";
  content: string;
  createdAt: Date;
}

export function Message({ side, content, createdAt }: MessageProps) {
  return (
    <div className={messageBaloon({ side: side })}>
      <p className="w-full">{content}</p>
      <small className="ml-auto text-xs text-zinc-500">
        {dayjs(createdAt).format("HH:mm")}
      </small>
    </div>
  );
}
