import { createFileRoute } from "@tanstack/react-router";
import { Chat } from "../components/chat";

export const Route = createFileRoute("/chats/$id")({
  component: RouteComponent,
});

function RouteComponent() {
  const { id } = Route.useParams();

  return <Chat chatId={id} />;
}
