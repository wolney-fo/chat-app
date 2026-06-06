import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4">
      <img
        src="/croc.webp"
        alt="Hello"
        className="w-32 h-auto"
        loading="lazy"
        draggable={false}
      />
      <p className="text-zinc-500 italic">
        Select a conversation to start chatting.
      </p>
    </div>
  );
}
