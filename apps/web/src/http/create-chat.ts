interface CreateChatParams {
  name: string;
  membersIds: string[];
}

export async function createChat({ name, membersIds }: CreateChatParams) {
  const response = await fetch(
    `${import.meta.env.DEV ? "http://" : "https://"}${import.meta.env.VITE_API_URI}/chats`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, membersIds }),
      credentials: "include",
    },
  );

  if (!response.ok) throw new Error("Failed to create chat");

  return response.json();
}
